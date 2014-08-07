package sparkgs

uses spark.*
uses sparkgs.util.*
uses gw.lang.function.IBlock
uses gw.lang.reflect.features.*
uses java.lang.System

class SparkGSRoute implements Route, IHasRequestContext {

  var _body():Object

  construct(handler: Object) {
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

  override function handle(r: Request, p: Response): String {
    var start = System.currentTimeMillis()
    logInfo( \-> "Started ${Request.Method} ${Request.PathInfo}")
    try {
      var body = _body()
      if (body typeis String) {
        return Response.handleLayouts(body)
      }
      if (body typeis RawContent) {
        return body.toString();
      }
      if (body typeis Json) {
        Response.Type ="application/json"
        return body.toString()
      }
      return null
    } finally {
      logInfo( \-> "Finished ${Request.Method} ${Request.PathInfo} in ${System.currentTimeMillis() - start}ms")
      logInfo( "Trace for ${Request.Method} ${Request.PathInfo}")
    }
  }
}