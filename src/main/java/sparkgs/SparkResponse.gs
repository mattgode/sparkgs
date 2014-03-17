package sparkgs

uses java.io.Writer
uses spark.Response
uses java.io.OutputStreamWriter

class SparkResponse {

  var _writer : Writer as Writer
  var _response : Response as SparkJavaResponse

  construct(response:Response) {
    _response = response;
    _writer = new OutputStreamWriter(response.raw().OutputStream)
  }

}