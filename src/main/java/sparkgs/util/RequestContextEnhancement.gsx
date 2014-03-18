package sparkgs.util

uses sparkgs.*
uses java.util.Map
uses java.io.Writer

enhancement RequestContextEnhancement : IHasRequestContext {

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

}