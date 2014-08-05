package sparkgs

uses java.util.*
uses spark.*
uses sparkgs.util.*
uses java.lang.StringBuilder
uses java.lang.System

class SparkGSRequest {

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

  var _params : ParamMap as readonly Params
  var _attributes : Map<String, Object> as readonly Attributes
  var _request : Request as readonly SparkJavaRequest
  var _session : SessionMap as readonly Session
  var _traceStack : Stack<TraceComponent>

  construct(request:Request) {
    _request = request;
    _params = new ParamMap(SparkJavaRequest)
    _attributes = new AttributesMap(SparkJavaRequest)
    _session = new SessionMap(SparkJavaRequest)
    _traceStack = new Stack<TraceComponent>()
    _traceStack.push(new TraceComponent("Request:   "+request.servletPath()))
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

  property get Headers() : Set<String> {
    return _request.headers()
  }

  property get Host() : String {
    return _request.host()
  }

  property get IP() : String {
    return _request.ip()
  }

  property get PathInfo() : String {
    return _request.pathInfo()
  }

  property get UserAgent() : String {
    return _request.userAgent()
  }

  property get Splat() : String[] {
    return _request.splat()
  }

  property get Scheme() : String {
    return _request.scheme()
  }

  property get URL() : String {
    return _request.url()
  }

  property get Port() : int {
    return _request.port()
  }

  property get QueryMap() : QueryParamsMap {
    return _request.queryMap()
  }

  //----------------------------------------------------------------------
  // Tracing Support
  //----------------------------------------------------------------------

  function pushToTrace(name : String = null) {
    if (name == null) name = "-Section " + _traceStack.size() + ":"
    _traceStack.push(new TraceComponent(name))
  }


  function popFromTrace() : TraceComponent {
    return _traceStack.pop()
  }


  function printTrace() {
    var s = new StringBuilder()
    for (e in _traceStack index i) {
      var time = (System.nanoTime() - e.startTime) as double / 1000000
      s.append(e.name + " ["+time+" ms]\n")
    }
    print(s)
  }


}