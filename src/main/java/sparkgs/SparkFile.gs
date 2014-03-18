package sparkgs

uses spark.*
uses sparkgs.util.*
uses java.lang.*

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

    get(path, \-> controller.index())
    get(path + "/new", \-> controller._new())
    post(path, \-> controller.create())

    get(path + "/:id", \-> controller.show(Params['id']))
    get(path + "/:id/edit", \-> controller.edit(Params['id']))
    put(path + "/:id", \-> controller.update(Params['id']))

  }
}