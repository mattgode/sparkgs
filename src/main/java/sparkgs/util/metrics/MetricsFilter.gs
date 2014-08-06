package sparkgs.util.metrics

uses sparkgs.ISparkGSFilter
uses com.codahale.metrics.MetricRegistry
uses sparkgs.SparkGSRequest
uses sparkgs.SparkGSResponse
uses sparkgs.SparkGSFile

class MetricsFilter implements ISparkGSFilter {

  var _metrics : MetricRegistry as Metrics

  construct() {
    _metrics = new()
  }

  override function before(req: SparkGSRequest, resp: SparkGSResponse) {
    SparkGSFile.MetricsStack.push(_metrics)
  }

  override function after(req: SparkGSRequest, resp: SparkGSResponse) {
    SparkGSFile.MetricsStack.pop()
  }

}