package sparkgs

uses java.util.Map
uses spark.Request
uses sparkgs.util.ParamMap

class SparkRequest {

  enum HttpVerb {
    GET,
    POST,
    PUT,
    PATCH,
    DELETE,
    HEAD,
    TRACE,
    CONNECT,
    OPTIONS,
  }

  var _params : Map<String, String> as Params
  var _request : Request as SparkJavaRequest

  construct(request:Request) {
    _request = request;
    _params = new ParamMap(SparkJavaRequest)
  }

  //----------------------------------------------------------------------
  // HTTP Verb Helpers
  //----------------------------------------------------------------------
  property get IsGet() : boolean {
    return _request.requestMethod().equalsIgnoreCase(HttpVerb.GET.toString())
  }

  property get IsPost() : boolean {
    return _request.requestMethod().equalsIgnoreCase(HttpVerb.POST.toString())
  }

  property get IsPut() : boolean {
    return _request.requestMethod().equalsIgnoreCase(HttpVerb.PUT.toString())
  }

  property get IsPatch() : boolean {
    return _request.requestMethod().equalsIgnoreCase(HttpVerb.PATCH.toString())
  }

  property get IsDelete() : boolean {
    return _request.requestMethod().equalsIgnoreCase(HttpVerb.DELETE.toString())
  }

  property get IsHead() : boolean {
    return _request.requestMethod().equalsIgnoreCase(HttpVerb.HEAD.toString())
  }

  property get IsTrace() : boolean {
    return _request.requestMethod().equalsIgnoreCase(HttpVerb.TRACE.toString())
  }

  property get IsConnect() : boolean {
    return _request.requestMethod().equalsIgnoreCase(HttpVerb.CONNECT.toString())
  }

  property get IsOptions() : boolean {
    return _request.requestMethod().equalsIgnoreCase(HttpVerb.OPTIONS.toString())
  }

  //----------------------------------------------------------------------
  // Pass Through API
  //----------------------------------------------------------------------

  property get ContentType() : String {
    return _request.contentType()
  }

  property get Body() : String {
    return _request.body()
  }

  property get ContentLength() : int {
    return _request.contentLength()
  }

  property get ContextPath() : String {
    return _request.contextPath()
  }

  property get Cookies() : Map<String, String> {
    return _request.cookies()
  }


}