package sparkgs

uses sparkgs.util.SparkGSRequestSupport
uses java.util.Stack
uses java.util.Map
uses sparkgs.util.SessionMap
uses sparkgs.util.CookieJar
uses gw.lang.reflect.features.PropertyReference
uses sparkgs.util.inputhelper.InputGenerator

class SparkGSTemplate {

  static property get Request() : SparkGSRequest {
    return SparkGSRequestSupport.Request
  }

  static property get Response() : SparkGSResponse {
    return SparkGSRequestSupport.Response
  }

  property get Layouts() : Stack<SparkGSLayout> {
    return Response.Layouts
  }

  property get Params() : Map<String, String>  {
    return Request.Params
  }

  property get Session() : SessionMap {
    return Request.Session
  }

  property get Cookies() : CookieJar {
    return CookieJar.Instance
  }

  function setLayout(layout : SparkGSLayout) {
    if(Response != null) {
      Response.Layouts.clear()
      if(layout != null) {
        Response.Layouts.push(layout)
      }
    } else {
      SparkGSResponse.DefaultLayout = layout
    }
  }

  static function textInput(literal: PropertyReference, name: String = null, options: Map<String, String> = null) : String {
    return InputGenerator.textInput(literal, name ,options)
  }

  static function radioInput(literal: PropertyReference, name: String = null, options: Map<String, String> = null) : String {
    return InputGenerator.radioInput(literal,name,options)
  }

  static function selectInput(literal: PropertyReference, name: String = null, options: Map<String, String> = null) : String {
    return InputGenerator.selectInput(literal, name, options)
  }

  static function labelInput(literal: PropertyReference, name: String = null) : String {
    return InputGenerator.labelInput(literal, name)
  }

  static function submitInput(text: String = 'Submit', options: Map<String, String> = null) : String {
    return InputGenerator.submitInput(text,options)
  }

}