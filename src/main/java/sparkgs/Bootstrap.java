package sparkgs;

import gw.config.CommonServices;
import gw.lang.Gosu;
import gw.lang.parser.*;
import gw.lang.parser.exceptions.ParseResultsException;
import gw.lang.reflect.IType;
import gw.lang.reflect.TypeSystem;
import gw.lang.reflect.gs.IGosuProgram;
import gw.lang.reflect.gs.IProgramInstance;
import gw.util.GosuExceptionUtil;
import gw.util.StreamUtil;
import spark.Spark;
import sparkgs.util.ReloadFilter;

import java.io.File;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Arrays;
import java.util.List;

public class Bootstrap {

  public static void main(String[] args) {
    try {
      String sparkFile = "/spark.gsp";
      if (args.length > 0) {
        sparkFile = args[0];
      }
      URL url = Bootstrap.class.getResource(sparkFile);
      if (url == null) {
        url = ClassLoader.getSystemResource(sparkFile);
        if (url == null) {
          File f = new File(sparkFile);
          if (f.exists()) {
            url = f.toURI().toURL();
          }
        }
      }
      if (url == null) {
        throw new IllegalStateException("Please specify a valid sparkfile or place a file named " +
          "spark.gsp at the root of your project.");
      }
      try {
        File f = new File(url.toURI());
        Gosu.init(Arrays.asList(f.getParentFile()));
      } catch (URISyntaxException e) {
        Gosu.init();
      }
      String content = new String(StreamUtil.getContent(url.openStream()));
      evalSparkfile(content);
      Spark.before(new ReloadFilter(url, content));
    } catch (Exception e) {
      throw GosuExceptionUtil.forceThrow(e);
    }
  }

  public static void evalSparkfile(String content) throws ParseResultsException {
    IGosuProgramParser programParser = GosuParserFactory.createProgramParser();
    List<String> packages = Arrays.asList("org.sparkgosu");
    ITypeUsesMap typeUses = CommonServices.getGosuIndustrialPark().createTypeUsesMap(packages);
    for (String aPackage : packages) {
      typeUses.addToDefaultTypeUses(aPackage);
    }
    IType supertype = TypeSystem.getByFullName("sparkgs.SparkFile");
    ParserOptions options = new ParserOptions().withTypeUsesMap(typeUses).withSuperType(supertype);
    IParseResult result = programParser.parseExpressionOrProgram(content, new StandardSymbolTable(true), options);
    IGosuProgram program = result.getProgram();
    IProgramInstance instance = program.getProgramInstance();
    instance.evaluate(null);
  }

}
