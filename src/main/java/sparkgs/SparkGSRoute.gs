package sparkgs

uses spark.*
uses sparkgs.util.*
uses gw.lang.function.IBlock
uses gw.lang.reflect.features.*
uses sparkgs.util.metrics.MetricsRunner

class SparkGSRoute implements Route, IHasRequestContext {

  var _body():Object
  var _route : String

  construct(handler: Object, route : String) {
    _route = route
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
    using(MetricsRunner.time(_route, request.requestMethod())) {
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
    }
  }
}