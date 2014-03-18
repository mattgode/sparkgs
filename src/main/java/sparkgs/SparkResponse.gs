package sparkgs

uses java.io.Writer
uses spark.Response
uses java.io.OutputStreamWriter
uses javax.servlet.http.HttpServletResponse

class SparkResponse {

  var _writer : Writer as Writer
  var _response : Response as SparkJavaResponse

  construct(response:Response) {
    _response = response;
    _writer = new OutputStreamWriter(response.raw().OutputStream)
  }

  function redirect(to : String, code = 302) {
    _response.redirect(to, code)
  }

  property get Committed() : boolean {
    return _response.raw().Committed
  }

}