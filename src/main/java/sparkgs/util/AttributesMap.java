package sparkgs.util;

import spark.Request;

import java.util.Collection;
import java.util.Map;
import java.util.Set;

public class AttributesMap implements Map<String, Object> {

  Request _req;

  public AttributesMap(Request req) {
    _req = req;
  }

  public int size() {
    return 0; //TODO implement
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

  public Object get(Object key) {
    return _req.attribute(key.toString());
  }

  public Object put(String key, Object value) {
    _req.attribute(key, value);
    return null;
  }

  public String remove(Object key) {
    throw new UnsupportedOperationException("Immutable map");
  }

  public void putAll(Map<? extends String, ? extends Object> m) {
    throw new UnsupportedOperationException("");
  }

  public void clear() {
    throw new UnsupportedOperationException("Immutable map");
  }

  public Set<String> keySet() {
    throw new UnsupportedOperationException();
  }

  public Collection<Object> values() {
    throw new UnsupportedOperationException();
  }

  public Set<Entry<String, Object>> entrySet() {
    throw new UnsupportedOperationException();
  }
}