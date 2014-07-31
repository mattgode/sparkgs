package sparkgs.util

uses sparkgs.ISparkGSFilter
uses sparkgs.SparkGSRequest
uses sparkgs.SparkGSResponse
uses org.slf4j.LoggerFactory

class RequestLogFilter implements ISparkGSFilter {
  override function before(req: SparkGSRequest, resp: SparkGSResponse) {
    var logger = LoggerFactory.getLogger("Request: "+req.URL.toString())
    logger.info(req.SparkJavaRequest.queryString())
  }

  override function after(req: SparkGSRequest, resp: SparkGSResponse) {
  }
}