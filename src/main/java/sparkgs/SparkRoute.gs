package sparkgs

uses spark.Request
uses spark.Response
uses java.lang.ThreadLocal
uses spark.Route

class SparkRoute  extends Route {

  //--------------------------------------------------
  //  Thread Local Request Support
  //--------------------------------------------------
  static class RequestInfo {

    var _req : SparkRequest as Req
    var _res : SparkResponse as Resp

    static var _THREAD_INFO = new ThreadLocal<RequestInfo>()

    static function clear() {
      _THREAD_INFO.set(null);
    }

    static function set(req : SparkRequest, resp : SparkResponse) {
      _THREAD_INFO.set(new() {:Req = req, :Resp = resp});
    }

    static property get Request() : SparkRequest {
      return _THREAD_INFO.get().Req
    }

    static property get Response() : SparkResponse {
      return _THREAD_INFO.get().Resp
    }
  }

  static property get Request() : SparkRequest {
    return RequestInfo.Request
  }

  static property get Response() : SparkResponse {
    return RequestInfo.Response
  }

  //TODO move to layout handling...
  static final var BODY_DELIMITER = "_SPARK_GOSU_BODY_SPARK_GOSU_BODY_"

  var _body():String

  construct(path : String, handler: Object) {
    super(path)
    if(handler typeis block():String) {
      _body = handler as block():String
    } else if(handler typeis block() ) {
      var tmp = handler as block()
      _body = \-> { tmp(); return "" }
    } else {
      _body = \-> handler.toString();
    }
  }

  function handle(request: Request, response: Response) : String {
    var sparkResponse = new SparkResponse(response);
    RequestInfo.set(new SparkRequest(request), sparkResponse)
    try
    {
      var layoutSplit : String[]
      if(SparkFile.Layout != null) {
        var layout = SparkFile.Layout.renderToString(BODY_DELIMITER)
        layoutSplit =layout.split(BODY_DELIMITER)
        sparkResponse.Writer.write(layoutSplit[0])
      }
      sparkResponse.Writer.write(_body())
      if(layoutSplit.length > 0) {
        sparkResponse.Writer.write(layoutSplit[1])
      }
      return ""
    }
        finally
    {
      sparkResponse.Writer.flush();
      RequestInfo.clear();
    }
  }

}