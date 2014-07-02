package sparkgs.util

uses sparkgs.*
uses java.lang.*
uses java.io.Closeable

class SparkGSRequestSupport implements  Closeable {

  var _req: SparkGSRequest as Req
  var _res: SparkGSResponse as Resp

  static var _THREAD_INFO = new ThreadLocal<SparkGSRequestSupport>()

  construct(req: SparkGSRequest, res: SparkGSResponse) {
    _req = req
    _res = res
    _THREAD_INFO.set(this);
  }

  static property get Request(): SparkGSRequest {
    return _THREAD_INFO.get()?.Req
  }

  static property get Response(): SparkGSResponse {
    return _THREAD_INFO.get()?.Resp
  }

  override function close() {
    //TODO cgross - need a callback from sparkjava to clear this once request is really over including
    // exception processing
    // _THREAD_INFO.set(null)
  }

}