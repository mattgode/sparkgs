package sparkgs.util

uses java.lang.System

class TraceComponent {

  var _name : String
  var _depth : long as readonly Depth
  var _start : long as readonly Start
  var _end : long as readonly End

  construct(componentName : String) {
    _start = System.nanoTime()
    _name = componentName
  }

  property get Start() : long {
    return _start
  }

  property get name() : String {
    return _name
  }


}