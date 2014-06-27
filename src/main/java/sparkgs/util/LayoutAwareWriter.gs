package sparkgs.util

uses java.io. *
uses java.util. *
uses java.lang.CharSequence
uses sparkgs.Layout

class LayoutAwareWriter extends OutputStreamWriter implements IHasRequestContext {

  static var _globalLayout: Layout as DefaultLayout
  static final var BODY_DELIMITER = "_SPARK_GOSU_BODY_SPARK_GOSU_BODY_"

  var _initialLayout: Layout as InitialLayout
  var _hasBegunWriting: boolean as HasBegunWriting = false
  var _layoutEnd = new Stack()

  construct(out: OutputStream) {
    super(out)
    InitialLayout = DefaultLayout
  }

  //================================================================
  // Writer pass through
  //================================================================

  override function write(c: int) {
    maybeStartLayout()
    super.write(c)
  }

  override function write(cbuf: char[], off: int, len: int) {
    maybeStartLayout()
    super.write(cbuf, off, len)
  }

  override function write(str: String, off: int, len: int) {
    maybeStartLayout()
    super.write(str, off, len)
  }

  override function flush() {
    super.flush()
  }

  override function close() {
    if(not Response.Committed) {
      while (_layoutEnd.size() > 0) {
        write(_layoutEnd.pop().toString())
      }
      super.close()
    }
  }

  override function write(cbuf: char[]) {
    maybeStartLayout()
    super.write(cbuf)
  }

  function writeRaw(str: String) {
    super.write(str)
  }

  override function write(str: String) {
    maybeStartLayout()
    super.write(str)
  }

  override function append(csq: CharSequence): Writer {
    maybeStartLayout()
    return super.append(csq)
  }

  override function append(csq: CharSequence, start: int, end: int): Writer {
    maybeStartLayout()
    return super.append(csq, start, end)
  }

  override function append(c: char): Writer {
    maybeStartLayout()
    return super.append(c)
  }

  //================================================================
  // Layout Support
  //================================================================

  property set Layout(newLayout : Layout) {
    if(HasBegunWriting) {
      handleLayout(newLayout)
    } else {
      InitialLayout = newLayout
    }
  }

  private function maybeStartLayout() {
    if (not HasBegunWriting) {
      HasBegunWriting = true
      handleLayout(InitialLayout)
    }
  }

  private function handleLayout(layout: Layout) {
    if(layout != null) {
      var str = layout.renderToString(BODY_DELIMITER)
      var layoutSplit = str.split(BODY_DELIMITER)
      write(layoutSplit[0])
      if(layoutSplit.length > 1) {
        _layoutEnd.push(layoutSplit[1])
      }
    }
  }
}