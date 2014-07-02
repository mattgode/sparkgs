package sparkgs

uses sparkgs.util.SparkGSRequestSupport
uses java.util.Stack
uses java.util.Map
uses sparkgs.util.SessionMap
uses sparkgs.util.CookieJar

class SparkGSTemplate {

  static property get Request() : SparkGSRequest {
    return SparkGSRequestSupport.Request
  }

  static property get Response() : SparkGSResponse {
    return SparkGSRequestSupport.Response
  }

  property get Layouts() : Stack<SparkGSLayout> {
    return Response.Layouts
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

  function setLayout(layout : SparkGSLayout) {
    if(Response != null) {
      Response.Layouts.clear()
      if(layout != null) {
        Response.Layouts.push(layout)
      }
    } else {
      SparkGSResponse.DefaultLayout = layout
    }
  }

}