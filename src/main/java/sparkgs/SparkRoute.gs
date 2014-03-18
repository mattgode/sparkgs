package sparkgs

uses spark.*
uses sparkgs.util.*
uses gw.lang.function.IBlock

class SparkRoute extends Route implements IHasRequestContext {

  var _body():String

  construct(path : String, handler: Object) {
    super(path)
    if(handler typeis IBlock) {
      _body = \-> {
        var body = handler.invokeWithArgs({})
        if(body != null) {
          return body.toString();
        } else {
          return ""
        }
      }
    } else {
      _body = \-> handler.toString();
    }
  }

  override function handle(request: Request, response: Response): String {
    var writer = new LayoutAwareWriter(response.raw().OutputStream)
    using (new RequestSupport(new SparkRequest(request),
                              new SparkResponse(){:SparkJavaResponse = response,
                                                  :Writer = writer})) {
      using(writer) {
        writer.write(_body())
        if(!Response.Committed) {
          writer.flush()
        }
        return ""
      }
    }
  }
}