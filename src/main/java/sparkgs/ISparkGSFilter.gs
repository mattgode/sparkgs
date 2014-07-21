package sparkgs

interface ISparkGSFilter {
  function before(req : SparkGSRequest, resp : SparkGSResponse)
  function after(req : SparkGSRequest, resp : SparkGSResponse)

  static function wrapBefore(blk : block(req: SparkGSRequest, resp: SparkGSResponse)) : ISparkGSFilter {
    return new ISparkGSFilter() {
      override function before(req: SparkGSRequest, resp: SparkGSResponse) {
        blk(req, resp);
      }
      override function after(req: SparkGSRequest, resp: SparkGSResponse) {
      }
    }
  }

  static function wrapAfter(blk : block(req: SparkGSRequest, resp: SparkGSResponse)) : ISparkGSFilter {
    return new ISparkGSFilter() {
      override function before(req: SparkGSRequest, resp: SparkGSResponse) {
      }
      override function after(req: SparkGSRequest, resp: SparkGSResponse) {
        blk(req, resp);
      }
    }
  }
}