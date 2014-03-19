package sparkgs.util

uses java.util.Map
uses java.util.Set
uses java.util.Collection
uses java.lang.UnsupportedOperationException

class HeaderMap implements Map<String, String>, IHasRequestContext {

  private construct(){}
  static var _instance = new HeaderMap()

  static property get Instance() : HeaderMap {
    return _instance
  }

  override function get(key: Object): String {
    return Request.SparkJavaRequest.headers(key.toString())
  }

  override function put(key: String, value: String): String {
    Response.SparkJavaResponse.header(key, value)
    return ""
  }

  override function putAll(m: Map< ? extends String, ? extends String>) {
    m.eachKeyAndValue( \ k, v -> put(k, v) )
  }

  //----------------------------------------------------
  //  Unsupported Junk
  //----------------------------------------------------
  override function size(): int {
    throw new UnsupportedOperationException()
  }

  override function remove(key: Object): String {
    throw new UnsupportedOperationException()
  }


  override property get Empty(): boolean {
    throw new UnsupportedOperationException()
  }

  override function containsKey(key: Object): boolean {
    throw new UnsupportedOperationException()
  }

  override function containsValue(value: Object): boolean {
    throw new UnsupportedOperationException()
  }

  override function clear() {
    throw new UnsupportedOperationException()
  }

  override function keySet(): Set<String> {
    throw new UnsupportedOperationException()
  }

  override function values(): Collection<String> {
    throw new UnsupportedOperationException()
  }

  override function entrySet(): Set<Map.Entry<String, String>> {
    throw new UnsupportedOperationException()
  }
}