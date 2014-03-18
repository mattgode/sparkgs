package sparkgs

uses sparkgs.util.RequestSupport

class SparkTemplate {

  static property get Request() : SparkRequest {
    return RequestSupport.Request
  }

  static property get Response() : SparkResponse {
    return RequestSupport.Response
  }

  static function setLayout(layout : Layout) {
    Response.Writer.Layout = layout
  }

}