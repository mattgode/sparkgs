package sparkgs

uses sparkgs.util.IHasRequestContext

class LayoutSupport implements IReentrant, IHasRequestContext {

  static final var BODY_DELIMITER = "_SPARK_GOSU_BODY_SPARK_GOSU_BODY_"

  structure Layout {
    function renderToString(body : String) : String
  }

  static var _globalLayout : Layout as GlobalLayout

  var _layoutEnd = ""

  override function enter() {
    var layoutSplit : String[]
    if(GlobalLayout != null) {
      var layout = GlobalLayout.renderToString(BODY_DELIMITER)
      layoutSplit = layout.split(BODY_DELIMITER)
      Writer.write(layoutSplit[0])
      _layoutEnd = layoutSplit[1]
    }
  }

  override function exit() {
    Writer.write(_layoutEnd)
  }
}