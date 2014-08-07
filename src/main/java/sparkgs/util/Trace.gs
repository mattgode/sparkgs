package sparkgs.util

uses java.io.Closeable

class Trace {

  var _root : TraceComponent
  var _current : TraceComponent

  function begin(name : String) {
    var tc = new TraceComponent(name, _current)
    if(_root == null) {
      _root = tc
    }
    _current = tc
  }

  function end() {
    _current.close()
    _current = _current.Parent
  }

  function traceWith(name : String) : Closeable {
    begin(name)
    return \-> end()
  }

  function print() : String {
    return _root.print()
  }
}