package sparkgs.util

uses sparkgs.*
uses java.util.Map
uses spark.Spark
uses javax.servlet.http.HttpServletResponse
uses java.util.Stack
uses com.google.gson.Gson

enhancement IHasRequestContextEnhancement: IHasRequestContext {

  /*
    Return the raw value of the string, ignore layouts
   */
  function raw(str : Object) : RawContent {
    return new() {:Content = str}
  }

  function json(obj : Object) : RawContent {
    Response.Type = "application/json"
    return raw(new Gson().toJson(obj))
  }

  function halt(code = HttpServletResponse.SC_OK, message = "") {
    Spark.halt(code, message)
  }

  property get Request() : SparkGSRequest {
    return SparkGSRequestSupport.Request
  }

  property get Response() : SparkGSResponse {
    return SparkGSRequestSupport.Response
  }

  property get Params() : Map<String, String>  {
    return Request.Params
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

  property get Layouts() : Stack<SparkGSLayout> {
    return Response.Layouts
  }

  property set Layout(layout : SparkGSLayout) {
    if(Response != null) {
      Response.Layouts.clear()
      if(layout != null) {
        Response.Layouts.push(layout)
      }
    } else {
      SparkGSResponse.DefaultLayout = layout
    }
  }

  function redirect(to: String, code = 302) {
    Response.redirect(to, code)
  }
}