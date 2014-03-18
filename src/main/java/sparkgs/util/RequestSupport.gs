package sparkgs.util

uses sparkgs.*
uses java.lang.*
uses java.io.Closeable

class RequestSupport implements  Closeable {

  var _req: SparkRequest as Req
  var _res: SparkResponse as Resp

  static var _THREAD_INFO = new ThreadLocal<RequestSupport>()

  construct(req: SparkRequest, res: SparkResponse) {
    _req = req
    _res = res
    _THREAD_INFO.set(this);
  }

  static property get Request(): SparkRequest {
    return _THREAD_INFO.get().Req
  }

  static property get Response(): SparkResponse {
    return _THREAD_INFO.get().Resp
  }

  override function close() {
    _THREAD_INFO.set(null);
  }

}