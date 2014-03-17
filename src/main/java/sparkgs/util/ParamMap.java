package sparkgs.util;

import spark.Request;

import java.util.Collection;
import java.util.Map;
import java.util.Set;

public class ParamMap implements Map<String, String> {

  Request _req;

  public ParamMap(Request req) {
    _req = req;
  }

  public int size() {
    return _req.queryParams().size(); //TODO - include path params
  }

  public boolean isEmpty() {
    return size() == 0;
  }

  public boolean containsKey(Object key) {
    return get(key) != null;
  }

  public boolean containsValue(Object value) {
    throw new UnsupportedOperationException();
  }

  public String get(Object key) {
    String val = _req.params(key.toString());
    if (val != null) {
      return val;
    } else {
      return _req.queryParams(key.toString());
    }
  }

  public String put(String key, String value) {
    throw new UnsupportedOperationException("Immutable map");
  }

  public String remove(Object key) {
    throw new UnsupportedOperationException("Immutable map");
  }

  public void putAll(Map<? extends String, ? extends String> m) {
    throw new UnsupportedOperationException("Immutable map");
  }

  public void clear() {
    throw new UnsupportedOperationException("Immutable map");
  }

  public Set<String> keySet() {
    throw new UnsupportedOperationException();
  }

  public Collection<String> values() {
    throw new UnsupportedOperationException();
  }

  public Set<Entry<String, String>> entrySet() {
    throw new UnsupportedOperationException();
  }
}