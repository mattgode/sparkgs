package sparkgs

uses spark.Response
uses sparkgs.util.LayoutAwareWriter

class SparkResponse {

  var _writer : LayoutAwareWriter as Writer
  var _response : Response as SparkJavaResponse

  function redirect(to : String, code = 302) {
    _response.redirect(to, code)
  }

  property get Committed() : boolean {
    return _response.raw().Committed
  }

  property set Status(val : int) {
    _response.status(val)
  }

  property set Type(type : String) {
    _response.type(type)
  }

}