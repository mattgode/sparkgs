package sparkgs.util

uses java.util.Map
uses java.util.Set
uses java.util.Collection
uses java.lang.UnsupportedOperationException

class CookieJar implements Map<String, String>, IHasRequestContext {

  private construct(){}
  static var _instance = new CookieJar()

  static property get Instance() : CookieJar {
    return _instance
  }

  override function get(key: Object): String {
    return Request.Cookies[key.toString()]
  }

  override function put(key: String, value: String): String {
    set(key, value)
    return ""
  }

  override function remove(key: Object): String {
    return null
  }

  override function putAll(m: Map< ? extends String, ? extends String>) {
    m.eachKeyAndValue( \ k, v -> put(k, v) )
  }

  function set(cookieName : String, value : String, expires = -1, secure  = false, path  = "") {
      Response.SparkJavaResponse.cookie(path, cookieName, value, expires, secure)
  }

  //----------------------------------------------------
  //  Unsupported Junk
  //----------------------------------------------------
  override function size(): int {
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