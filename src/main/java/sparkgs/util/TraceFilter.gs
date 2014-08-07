package sparkgs.util

uses sparkgs.ISparkGSFilter
uses sparkgs.SparkGSResponse
uses sparkgs.SparkGSRequest

class TraceFilter implements ISparkGSFilter {
  var _name : String

  construct(name : String) {
    _name = name
  }

  override function before(req: SparkGSRequest, resp: SparkGSResponse) {
    req.pushToTrace(_name)
  }

  override function after(req: SparkGSRequest, resp: SparkGSResponse) {
    req.popFromTrace()
  }
}