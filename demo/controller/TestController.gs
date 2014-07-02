package controller

class TestController implements sparkgs.util.IHasRequestContext {
  
  static var counter = 0;

  function foo() : String{
  	counter++
    return  "Foo Foo! ${counter}"
  }

  static function staticFoo() : String {
    return "Static Foo Foo!"
  }

  function bar(s : String) : String {
    return "Bar Bar!"
  }

}