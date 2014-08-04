package sparkgs.util.metering

uses sparkgs.ISparkGSFilter
uses com.codahale.metrics.MetricRegistry
uses sparkgs.SparkGSRequest
uses sparkgs.SparkGSResponse
uses com.codahale.metrics.Timer

class MetricsFilter implements ISparkGSFilter {

  static var TIMER_DELIMITER : String as TimerDelimiter = '__timer__'
  static var TIMER_KEY = MetricsFilter.Type.Name + TIMER_DELIMITER
  static final var _metrics : MetricRegistry as Metrics = new()

  override function before(req: SparkGSRequest, resp: SparkGSResponse) {
    req.Attributes[TIMER_KEY] = _metrics.timer(TIMER_DELIMITER + req.URL).time()
  }

  override function after(req: SparkGSRequest, resp: SparkGSResponse) {
    (req.Attributes[TIMER_KEY] as Timer.Context).stop()
  }

}