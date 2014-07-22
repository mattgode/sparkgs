package sparkgs.util

uses sparkgs.*
uses java.lang.*

class SparkGSRequestSupport {

  static var _REQUEST = new ThreadLocal<SparkGSRequest>()
  static var _RESPONSE = new ThreadLocal<SparkGSResponse>()

  static function set(rawReq: spark.Request, rawResp: spark.Response) {
    var req = new SparkGSRequest (rawReq)
    var resp = new SparkGSResponse (rawResp)
    _REQUEST.set(req);
    _RESPONSE.set(resp);
  }

  static property get Request(): SparkGSRequest {
    return _REQUEST.get()
  }

  static property get Response(): SparkGSResponse {
    return _RESPONSE.get()
  }

  static function clear() {
    _REQUEST.set(null)
    _RESPONSE.set(null)
  }
}