package sparkgs

uses spark.*
uses sparkgs.util.*
uses java.lang.*
uses gw.lang.reflect.IRelativeTypeInfo
uses gw.lang.reflect.IParameterInfo
uses gw.lang.reflect.TypeSystem
uses gw.lang.reflect.ReflectUtil

class SparkFile implements IHasRequestContext {

  static var _staticFilesSet = false;

  construct(){
    // Look for a PORT environment variable
    var port = System.getenv("PORT");
    if (port != null) {
      Port = Integer.parseInt(port)
    }
  }

  //===================================================================
  //  Config Properties
  //===================================================================
  property set StaticFiles(path : String) {
    if(!_staticFilesSet) {
      _staticFilesSet = true;
      Spark.staticFileLocation(path)
    } else {
      print("Cannot reinitialize static directory...") //TODO cgross - log this properly
    }
  }

  property set Layout(layout : LayoutSupport.Layout ) {
    LayoutSupport.GlobalLayout = layout
  }

  property set Port(port : int) {
    Spark.setPort(port)
  }

  //===================================================================
  //  Routing - HTTP Verbs
  //===================================================================

  function get(path : String, handler: Object) {
    Spark.get(new SparkRoute(path, handler))
  }

  function post(path : String, handler: Object ) {
    Spark.post(new SparkRoute(path, handler))
  }

  function put(path : String, handler: Object ) {
    Spark.put(new SparkRoute(path, handler))
  }

  function patch(path : String, handler: Object ) {
    Spark.patch(new SparkRoute(path, handler))
  }

  function delete(path : String, handler: Object ) {
    Spark.delete(new SparkRoute(path, handler))
  }

  function head(path : String, handler: Object ) {
    Spark.head(new SparkRoute(path, handler))
  }

  function trace(path : String, handler: Object ) {
    Spark.trace(new SparkRoute(path, handler))
  }

  function connect(path : String, handler: Object ) {
    Spark.connect(new SparkRoute(path, handler))
  }

  function options(path : String, handler: Object ) {
    Spark.options(new SparkRoute(path, handler))
  }

  //===================================================================
  //  Routing - Higher Level Definitions
  //===================================================================

  function handle(path: String, handler: Object, verbs : List<SparkRequest.HttpVerb> = null) {
    if(verbs == null) {
      verbs = SparkRequest.HttpVerb.AllValues
    }
    if(verbs.contains(SparkRequest.HttpVerb.GET)) get(path, handler)
    if(verbs.contains(SparkRequest.HttpVerb.POST)) post(path, handler)
    if(verbs.contains(SparkRequest.HttpVerb.PUT)) put(path, handler)
    if(verbs.contains(SparkRequest.HttpVerb.PATCH)) patch(path, handler)
    if(verbs.contains(SparkRequest.HttpVerb.DELETE)) delete(path, handler)
    if(verbs.contains(SparkRequest.HttpVerb.HEAD)) head(path, handler)
    if(verbs.contains(SparkRequest.HttpVerb.TRACE)) trace(path, handler)
    if(verbs.contains(SparkRequest.HttpVerb.CONNECT)) connect(path, handler)
    if(verbs.contains(SparkRequest.HttpVerb.OPTIONS)) options(path, handler)
  }

  function resource(path : String, controller : IResourceController) {
    // Basic collection REST-ful URLs
    get(path, \-> controller.index())
    get(path + "/new", \-> controller._new())
    post(path, \-> controller.create())

    // Basic instance REST-ful URLs
    get(path + "/:id", \-> controller.show(Params['id']))
    get(path + "/:id/edit", \-> controller.edit(Params['id']))
    put(path + "/:id", \-> controller.update(Params['id']))

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
  }

  function rpc(path : String, controller : Object) {
    var typeInfo = (typeof controller).TypeInfo
    if(typeInfo typeis IRelativeTypeInfo) {
      var publicMethods = typeInfo.DeclaredMethods.where( \ m -> m.Public && not m.Static )
      var addedMethods = {}
      for(m in publicMethods) {
        if(!addedMethods.contains(m.DisplayName)) {
          handle(path + "/" + m.DisplayName.toLowerCase(), \-> m.CallHandler.handleCall(controller, populateArgs(m.Parameters)))
        } else {
          //TODO - log method overloading warning
        }
      }
    }
  }

  function populateArgs(params : IParameterInfo[]) : Object[] {
    var result = new Object[params.length]
    for(p in params index i) {
      try {
        result[i] = ParamConverter.convertValue(p.FeatureType, Params[p.DisplayName])
      } catch(e) {
        Writer.append("Bad value for param #{p.DisplayName} of type ${p.FeatureType.DisplayName} : ${Params[p.DisplayName]}")
      }
    }
    return result;
  }

}