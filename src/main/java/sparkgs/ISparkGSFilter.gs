package sparkgs

interface ISparkGSFilter {
  function before(req : SparkGSRequest, resp : SparkGSResponse)
  function after(req : SparkGSRequest, resp : SparkGSResponse)
}