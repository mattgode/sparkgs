package sparkgs.util.metrics

uses sparkgs.util.IHasRequestContext
uses sparkgs.IResourceController
uses java.net.URLDecoder

class MetricsController implements IHasRequestContext, IResourceController {

  override function index(): Object {
    Layout = MetricsLayout
    return MetricsView.renderToString()
  }

  override function _new(): Object {
    return null
  }

  override function create(): Object {
    return null
  }

  override function show(id: String): Object {
    Layout = MetricsLayout
    return RouteView.renderToString(URLDecoder.decode(id, 'UTF-8'))
  }

  override function edit(id: String): Object {
    return null
  }

  override function update(id: String): Object {
    return null
  }

}