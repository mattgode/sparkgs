package sparkgs.util.metrics

uses sparkgs.ISparkGSFilter
uses com.codahale.metrics.MetricRegistry
uses sparkgs.SparkGSRequest
uses sparkgs.SparkGSResponse
uses sparkgs.SparkGSFile

/*
 * Pushes a metrics registry onto the stack before the execution of the handler and removes
 * the registry from the stack after the handler has been executed. MetricsRunner will start
  * a timer when it is called in SparkGSRoute (and stop it upon return of the handler)
 */
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