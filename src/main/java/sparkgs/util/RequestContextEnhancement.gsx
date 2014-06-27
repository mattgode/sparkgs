package sparkgs.util

uses sparkgs.*
uses java.util.Map
uses java.io.Writer

enhancement RequestContextEnhancement : IHasRequestContext {

  function raw(str : Object) : RawContent {
    return new() {:Content = str}
  }

  property set Layout(layout: Layout) {
    if (Response != null) {
      Response.Writer.Layout = layout
    }
  }

  property get Request() : SparkRequest {
    return RequestSupport.Request
  }

  property get Response() : SparkResponse {
    return RequestSupport.Response
  }

  property get Params() : Map<String, String>  {
    return RequestSupport.Request.Params
  }

  property get Writer() : Writer {
    return RequestSupport.Response.Writer
  }

  property get Session() : SessionMap {
    return Request.Session
  }

  property get Cookies() : CookieJar {
    return CookieJar.Instance
  }

  property get Headers() : HeaderMap {
    return HeaderMap.Instance
  }

  function redirect(to: String, code = 302) {
    Response.redirect(to, code)
  }
}