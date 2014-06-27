package sparkgs

uses spark.*
uses sparkgs.util.*
uses gw.lang.function.IBlock
uses gw.lang.reflect.features.*

class SparkRoute extends Route implements IHasRequestContext {

  var _body():Object

  construct(path : String, handler: Object) {
    super(path)
    if(handler typeis IBlock) {
      _body = \-> handler.invokeWithArgs({})
    } else if(handler typeis IMethodReference) {
      if(handler.MethodInfo.Parameters.length > 0) {
        _body = \-> { throw "Only no-arg methods can be used as routes!" }
      } else if(handler.MethodInfo.Static) {
        _body = \-> handler.evaluate({})
      } else if(handler typeis BoundMethodReference) {
        _body = \-> handler.evaluate({})
      } else {
        var ctor = handler.RootType.TypeInfo.getCallableConstructor({})
        if(ctor != null) {
          _body = \-> handler.evaluate({ctor.Constructor.newInstance({})})
        } else {
          _body = \-> { throw "Cannot find a no-arg contructor for ${handler.RootType}" }
        }
      }
    } else {
      _body = \-> handler
    }
  }

  override function handle(request: Request, response: Response): String {
    var writer = new LayoutAwareWriter(response.raw().OutputStream)
    using (new RequestSupport(new SparkRequest(request),
                              new SparkResponse(){:SparkJavaResponse = response,
                                                  :Writer = writer})) {
      using(writer) {
        var body = _body()
        if(body typeis String) {
          writer.write(body)
        } if (body typeis RawContent) {
          writer.writeRaw(body.toString())
        }
        if(!Response.Committed) {
          writer.flush()
        }
        return ""
      }
    }
  }
}