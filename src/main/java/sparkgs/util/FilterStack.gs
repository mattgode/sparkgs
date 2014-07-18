package sparkgs.util

uses java.io.Closeable
uses sparkgs.ISparkGSFilter
uses java.util.LinkedList

class FilterStack implements Closeable {
  static var _filterStack : List<ISparkGSFilter>

  construct() {
    _filterStack = new LinkedList<ISparkGSFilter>()
  }

  function push(filter : ISparkGSFilter) {
    _filterStack.add(filter)
  }

  // as if we are popping
  function popOrderedList() : List<ISparkGSFilter> {
    var popOrderedList = _filterStack.copy()
    return popOrderedList.reverse()
  }

  override function close() {
    _filterStack.remove(_filterStack.size()-1)
  }


}