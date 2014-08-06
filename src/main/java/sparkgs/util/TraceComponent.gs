package sparkgs.util

uses java.lang.System

class TraceComponent {
  var _name : String
  var _startTime : long

  construct(componentName : String) {
    _startTime = System.nanoTime()
    _name = componentName
  }

  property get startTime() : long {
    return _startTime
  }

  property get name() : String {
    return _name
  }


}