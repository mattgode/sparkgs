package sparkgs

uses spark.Request
uses spark.Response
uses spark.Route
uses sparkgs.util.*

class SparkRoute extends Route implements IHasRequestContext {

  var _body():String

  construct(path : String, handler: Object) {
    super(path)
    if(handler typeis block():String) {
      _body = handler
    } else if(handler typeis block() ) {
      var blk = handler as block()
      _body = \-> { blk() return "" }
    } else {
      _body = \-> handler.toString();
    }
  }

  override function handle(request: Request, response: Response): String {
    using (new RequestSupport(new SparkRequest(request), new SparkResponse(response))) {
      using(new LayoutSupport()) {
        Writer.write(_body())
        return ""
      }
    }
  }
}