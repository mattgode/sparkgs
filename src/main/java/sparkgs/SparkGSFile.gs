package sparkgs

uses spark.*
uses sparkgs.util.*
uses java.lang.*
uses gw.lang.reflect.*
uses gw.lang.reflect.gs.*
uses gw.lang.cli.*
uses java.io.File
uses spark.utils.SparkUtils

abstract class SparkGSFile implements IHasRequestContext, IManagedProgramInstance {

  static var _staticFilesSet = false;

  construct(){
    // Look for a PORT environment variable
    var port = System.Env["PORT"]
    if (port != null) {
      Port = Integer.parseInt(port)
    }
  }

  //===================================================================
  //  Configuration Support
  //===================================================================
  property set StaticFiles(path : String) {
    if(!_staticFilesSet) {
      _staticFilesSet = true;
      if(new File(".", path).exists()){
        Spark.externalStaticFileLocation(new File(".", path).AbsolutePath)
      } else if(new File(path).exists()) {
        Spark.externalStaticFileLocation(new File(path).AbsolutePath)
      } else {
        Spark.staticFileLocation(path)
      }
    } else {
      print("Cannot reinitialize static directory...") //TODO cgross - log this properly
    }
  }

  property set Port(port : int) {
    Spark.setPort(port)
  }

  //===================================================================
  //  Routing Support
  //===================================================================

  function get(path : String, handler: Object) {
    Spark.get(path, new SparkGSRoute (handler))
  }

  function post(path : String, handler: Object ) {
    Spark.post(path, new SparkGSRoute (handler))
  }

  function put(path : String, handler: Object ) {
    Spark.put(path, new SparkGSRoute (handler))
  }

  function patch(path : String, handler: Object ) {
    Spark.patch(path, new SparkGSRoute (handler))
  }

  function delete(path : String, handler: Object ) {
    Spark.delete(path, new SparkGSRoute (handler))
  }

  function head(path : String, handler: Object ) {
    Spark.head(path, new SparkGSRoute (handler))
  }

  function trace(path : String, handler: Object ) {
    Spark.trace(path, new SparkGSRoute (handler))
  }

  function connect(path : String, handler: Object ) {
    Spark.connect(path, new SparkGSRoute (handler))
  }

  function options(path : String, handler: Object ) {
    Spark.options(path, new SparkGSRoute (handler))
  }

  function handle(path: String, handler: Object, verbs : List<SparkGSRequest.HttpVerb> = null) {
    if(verbs == null) {
      verbs = sparkgs.SparkGSRequest.HttpVerb.AllValues
    }
    if(verbs.contains(sparkgs.SparkGSRequest.HttpVerb.GET)) get(path, handler)
    if(verbs.contains(sparkgs.SparkGSRequest.HttpVerb.POST)) post(path, handler)
    if(verbs.contains(sparkgs.SparkGSRequest.HttpVerb.PUT)) put(path, handler)
    if(verbs.contains(sparkgs.SparkGSRequest.HttpVerb.PATCH)) patch(path, handler)
    if(verbs.contains(sparkgs.SparkGSRequest.HttpVerb.DELETE)) delete(path, handler)
    if(verbs.contains(sparkgs.SparkGSRequest.HttpVerb.HEAD)) head(path, handler)
    if(verbs.contains(sparkgs.SparkGSRequest.HttpVerb.TRACE)) trace(path, handler)
    if(verbs.contains(sparkgs.SparkGSRequest.HttpVerb.CONNECT)) connect(path, handler)
    if(verbs.contains(sparkgs.SparkGSRequest.HttpVerb.OPTIONS)) options(path, handler)
  }

  function resource(path : String, controller : IResourceController) {
    // Basic collection REST-ful URLs
    get(path, \-> controller.index())
    get(path + "/new", \-> controller._new())
    post(path, \-> controller.create())

    // Additional methods
    if(controller.IntrinsicType.TypeInfo typeis IRelativeTypeInfo) {
      var publicMethods = controller.IntrinsicType.TypeInfo.DeclaredMethods.where( \ m -> m.Public && not m.Static )
      for(m in publicMethods) {
        if(!{"index", "_new", "show", "create", "edit", "update"}.contains(m.DisplayName)) {
          if(m.Parameters.length == 0){
            handle(path + "/" + m.DisplayName.toLowerCase(), \-> m.CallHandler.handleCall(controller, {}))
          }
          else if(m.Parameters.length == 1 && m.Parameters[0].FeatureType == String)
          {
            handle(path + "/:id/" + m.DisplayName.toLowerCase(), \-> m.CallHandler.handleCall(controller, {Params['id']}))
          }
        }
      }
    }

    // Basic instance REST-ful URLs
    get(path + "/:id", \-> controller.show(Params['id']))
    get(path + "/:id/edit", \-> controller.edit(Params['id']))
    handle(path + "/:id", \-> controller.update(Params['id']), :verbs = {PUT, POST})
  }

  function rpc(path : String, controller : Object) {
    var typeInfo = (typeof controller).TypeInfo
    if(typeInfo typeis IRelativeTypeInfo) {
      var publicMethods = typeInfo.DeclaredMethods.where( \ m -> m.Public && not m.Static )
      var addedMethods = {}
      for(m in publicMethods) {
        if(!addedMethods.contains(m.DisplayName)) {
          handle(path + "/" + m.DisplayName.toLowerCase(), \-> m.CallHandler.handleCall(controller, ParamConverter.populateArgs(Params, m.Parameters)))
        } else {
          throw "Overloaded method now allowed in RPC endpoints: ${typeInfo.DisplayName}.${m.DisplayName}"
        }
      }
    }
  }

  function onException(ex : Class<Exception>, blk : block(ex:Exception, req:SparkGSRequest , resp:SparkGSResponse)) {
    Spark.exception(ex, \ e, r, p -> blk(e, Request, Response))
  }

  function before(handler : block(req:SparkGSRequest , resp:SparkGSResponse), path : String = SparkUtils.ALL_PATHS, acceptType: String = null) {
    Spark.before(path, acceptType, \ r, p -> handler(Request, Response))
  }

  function after(handler : block(req:SparkGSRequest , resp:SparkGSResponse), path : String = SparkUtils.ALL_PATHS, acceptType: String = null) {
    Spark.after(path, acceptType, \ r, p -> handler(Request, Response))
  }

  //===================================================================
  // Command line arg handling
  //===================================================================

  override function afterExecution( t : Throwable ) {
    if(t != null) {
      print("Error when evaluating SparkFile:")
      t.printStackTrace()
    }
  }

  override function beforeExecution() : boolean {
    if(CommandLineAccess.RawArgs.size() > 1) {
      if(CommandLineAccess.RawArgs[0] == "--port") {
        Port = CommandLineAccess.RawArgs[1].toInt()
      }
    }
    return true
  }

}