package sparkgs

uses spark.*
uses java.lang.*
uses java.util.*
uses java.io.*
uses java.util.Map
uses java.util.AbstractMap

class SparkFile {

  class RequestInfo {
    var _req : Request as Request
    var _res : Response as Response
    var _writer : Writer as Writer
    var _params : Map<String, String> as Params
  }

  static var _THREAD_INFO = new ThreadLocal<RequestInfo>()

  //===================================================================
  //  Utility Properties
  //===================================================================
  property get Request() : Request {
    return _THREAD_INFO.get().Request
  }

  property get Response() : Response {
    return _THREAD_INFO.get().Response
  }

  property get Params() : Map<String, String>  {
    return _THREAD_INFO.get().Params
  }

  property get Writer() : Writer {
    return _THREAD_INFO.get().Writer
  }

  construct(){
    // Look for a PORT environment variable
    var port = System.getenv("PORT");
    if (port != null) {
      Spark.setPort(Integer.parseInt(port))
    }
  }

  //===================================================================
  //  HTTP Verbs
  //===================================================================
  function get(path : String, handler: Object ) {
    Spark.get(makeRoute(path, handler))
  }

  function post(path : String, handler: Object ) {
    Spark.post(makeRoute(path, handler))
  }

  function put(path : String, handler: Object ) {
    Spark.put(makeRoute(path, handler))
  }

  function patch(path : String, handler: Object ) {
    Spark.patch(makeRoute(path, handler))
  }

  function delete(path : String, handler: Object ) {
    Spark.delete(makeRoute(path, handler))
  }

  function head(path : String, handler: Object ) {
    Spark.head(makeRoute(path, handler))
  }

  function trace(path : String, handler: Object ) {
    Spark.trace(makeRoute(path, handler))
  }

  function connect(path : String, handler: Object ) {
    Spark.connect(makeRoute(path, handler))
  }

  function options(path : String, handler: Object ) {
    Spark.options(makeRoute(path, handler))
  }

  private function sparkGosuWrapper(request: Request, response: Response, body : block():String) : String {
    var writer = new OutputStreamWriter(response.raw().OutputStream)
    _THREAD_INFO.set(new() { :Request = request, :Response = response, :Writer = writer, :Params = new ParamMap(request) })
    try
    {
      writer.write(body())
      return ""
    }
    finally
    {
      writer.flush();
      _THREAD_INFO.set(null);
    }
  }

  private function makeRoute(path : String, handler: Object) : Route {

    if(handler typeis block():String) {
      var tmp = handler as block():String
      return new(path) {
        override function handle(request: Request, response: Response) : String {
          return sparkGosuWrapper(request, response, tmp);
        }
      }
    } else if(handler typeis block() ) {
      var tmp = handler as block()
      var tmp2 = \-> { tmp(); return "" }
      return new(path) {
        override function handle(request: Request, response: Response) : String {
          return sparkGosuWrapper(request, response, tmp2);
        }
      }
    }

    return new(path) {
      override function handle(request: Request, response: Response) : String {
          return sparkGosuWrapper(request, response, \-> handler.toString());
      }
    }
  }

}