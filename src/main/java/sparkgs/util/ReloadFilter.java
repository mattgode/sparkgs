package sparkgs.util;

import gw.lang.reflect.IType;
import gw.lang.reflect.ITypeRef;
import gw.lang.reflect.TypeSystem;
import gw.util.GosuClassUtil;
import gw.util.GosuExceptionUtil;
import gw.util.StreamUtil;
import spark.Filter;
import spark.Request;
import spark.Response;
import spark.Spark;
import spark.route.RouteMatcherFactory;

import java.io.File;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.HashMap;

public class ReloadFilter extends Filter {

  private final String _content;
  private final URL _url;
  private File _fileRoot;
  private HashMap<File, Long> _timeStamps;

  public ReloadFilter(URL url, String content) {
    _url = url;
    _content = content;
    _timeStamps = new HashMap<File, Long>();
    _fileRoot = getDir(url);
    if (_fileRoot != null) {
      scanForChanges(_fileRoot, false);
    }
  }

  public ReloadFilter(URL url, String content, HashMap<File, Long> timeStamps) {
    _url = url;
    _content = content;
    _timeStamps = timeStamps;
    _fileRoot = getDir(url);
  }

  private File getDir(URL url) {
    File f;
    try {
      f = new File(url.toURI());
    } catch (URISyntaxException e) {
      f = new File(url.getPath());
    }
    if (f.exists()) {
      return f.getParentFile();
    } else {
      return null;
    }
  }

  private void scanForChanges(File file, boolean updateResource) {
    if (file.isFile()) {
      String ext = GosuClassUtil.getFileExtension(file);
      if (".gs".equals(ext) || ".gsx".equals(ext) || ".gst".equals(ext)) {
        long modified = file.lastModified();
        if (updateResource) {
          Long lastTimeStamp = _timeStamps.get(file);
          if (lastTimeStamp == null || modified != lastTimeStamp) {
            fireResourceUpdate(file);
          }
        }
        _timeStamps.put(file, modified);
      }
    } else if (file.isDirectory()) {
      for (File child : file.listFiles()) {
        scanForChanges(child, updateResource);
      }
    }
  }

  private void fireResourceUpdate(File file) {
    String filePath = file.getAbsolutePath();
    String rootPath = _fileRoot.getAbsolutePath();
    String typeName = filePath.substring(rootPath.length() + 1, filePath.lastIndexOf('.'));
    typeName = typeName.replace(File.separatorChar, '.');
    IType type = TypeSystem.getByFullNameIfValid(typeName);
    if (type != null) {
      TypeSystem.refresh((ITypeRef) type);
    }
  }

  @Override
  public void handle(Request request, Response response) {
    try {
      if (_fileRoot != null) {
        scanForChanges(_fileRoot, true);
      }
      String newContent = new String(StreamUtil.getContent(_url.openStream()));
      if (!newContent.equals(_content)) {
        System.out.println("Sparkfile changed, reloading routes!");
        RouteMatcherFactory.get().clearRoutes();
        //TODO cgross - reimplement
        //Bootstrap.evalSparkfile(newContent);
        Spark.before(new ReloadFilter(_url, newContent, _timeStamps));
      }
    } catch (Exception e) {
      throw GosuExceptionUtil.forceThrow(e);
    }
  }

}