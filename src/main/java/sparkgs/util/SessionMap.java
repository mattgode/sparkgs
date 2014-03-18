package sparkgs.util;

import spark.Request;
import spark.Session;
import java.util.*;

public class SessionMap implements Map<String, Object> {

  Session session;

  public SessionMap(Request req) {
    session = req.session();
  }

  //-----------------------------------------------------------
  // SparkJava passthrough
  //-----------------------------------------------------------

  public Session getSparkJavaSession() {
    return session;
  }

  @SuppressWarnings("unchecked")
  public <T> T attribute(String name) {
    return (T) session.attribute(name);
  }

  public void attribute(String name, Object value) {
    session.attribute(name, value);
  }

  public Set<String> getAttributes() {
    return session.attributes();
  }

  public long getCreationTime() {
    return session.creationTime();
  }

  public String getId() {
    return session.id();
  }

  public long getLastAccessedTime() {
    return session.lastAccessedTime();
  }

  public int getMaxInactiveInterval() {
    return session.maxInactiveInterval();
  }

  public void setMaxInactiveInterval(int interval) {
    session.maxInactiveInterval(interval);
  }

  public void invalidate() {
    session.invalidate();
  }

  public boolean isNew() {
    return session.isNew();
  }

  public void removeAttribute(String name) {
    session.removeAttribute(name);
  }

  //-----------------------------------------------------------
  // Map implementation
  //-----------------------------------------------------------

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
    return session.attribute(key.toString());
  }

  public Object put(String key, Object value) {
    session.attribute(key, value);
    return null;
  }

  public Object remove(Object key) {
    session.removeAttribute(key.toString());
    return null;
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