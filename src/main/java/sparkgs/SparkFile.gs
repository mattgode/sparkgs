package sparkgs

uses spark.*
uses java.lang.*
uses java.util.*
uses java.io.*
uses java.util.Map
uses java.util.AbstractMap

class SparkFile {

  structure Layout {
    function renderToString(body : String) : String
  }

  static var _globalLayout : Layout as Layout

  static var _staticFilesSet = false;

  construct(){
    // Look for a PORT environment variable
    var port = System.getenv("PORT");
    if (port != null) {
      Spark.setPort(Integer.parseInt(port))
    }
  }

  //===================================================================
  //  API Properties
  //===================================================================
  property get Request() : SparkRequest {
    return SparkRoute.Request
  }

  property get Response() : SparkResponse {
    return SparkRoute.Response
  }

  property get Params() : Map<String, String>  {
    return SparkRoute.Request.Params
  }

  property get Writer() : Writer {
    return SparkRoute.Response.Writer
  }

  property set StaticFiles(path : String) {
    if(!_staticFilesSet) {
      _staticFilesSet = true;
      Spark.staticFileLocation(path)
    } else {
      print("Cannot reinitialize static directory...") //TODO cgross - log this properly
    }
  }

  //===================================================================
  //  HTTP Verbs
  //===================================================================

  function get(path : String, handler: Object ) {
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
  //  Higher Level Route Definitions
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

}