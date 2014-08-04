package sparkgs.util

uses org.slf4j.LoggerFactory
uses org.slf4j.Logger

enhancement IHasRequestLogEnhancement : IHasRequestLog {
  function logInfo(message : String) {
    getLogger().info(message)
  }

  function logError(message : String) {
    getLogger().error(message)
  }

  function logDebug(message : String) {
    getLogger().debug(message)
  }

  function logWarn(message : String) {
    getLogger().warn(message)
  }

  function logTrace(message : String) {
    getLogger().trace(message)
  }

  private function getLogger() : Logger {
    return LoggerFactory.getLogger("Request: "+SparkGSRequestSupport.Request.URL.toString())
  }
}
