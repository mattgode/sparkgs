package sparkgs

uses spark.*
uses sparkgs.util.*
uses java.lang.*
uses gw.lang.reflect.*
uses gw.lang.reflect.gs.*
uses gw.lang.cli.*
uses java.io.File
uses spark.utils.SparkUtils
uses java.io.Closeable
uses java.util.Stack
uses java.util.LinkedList
uses sparkgs.util.metrics.*
uses com.codahale.metrics.MetricRegistry

abstract class SparkGSFile implements IHasRequestContext, IManagedProgramInstance {

  static var _staticFilesSet = false;
  static var _filterStack = new Stack<ISparkGSFilter>()
  static var _pathQueue = new LinkedList<String>()
  static var _metricsStack : Stack<MetricRegistry> as MetricsStack = new()
  static var _setup : block(req:spark.Request, resp:spark.Response)

  construct(){
    // Look for a PORT environment variable
    var port = System.Env["PORT"]
    if (port != null) {
      Port = Integer.parseInt(port)
    }
    _setup = \req , resp -> SparkGSRequestSupport.set(req, resp)
  }

  //===================================================================
  //  Configuration Support
  //===================================================================
  property set StaticFiles(path : String) {
    if(!_staticFilesSet) {
      _staticFilesSet = true;
      if(new File(".", path).exists()){
        Spark.externalStaticFileLocation(new File(".", path).AbsolutePath)
      } else if(new File(path).exists()) {
        Spark.externalStaticFileLocation(new File(path).AbsolutePath)
      } else {
        Spark.staticFileLocation(path)
      }
    } else {
      print("Cannot reinitialize static directory...") //TODO cgross - log this properly
    }
  }

  property set Port(port : int) {
    Spark.setPort(port)
  }

  //===================================================================
  //  Routing Support
  //===================================================================

  function get(path : String, handler: Object, routes : block() = null) {
    path = nested(path)
    applyFilters(path)
    Spark.get((path), new SparkGSRoute(handler, path))
    handleRoutes(path, routes)
  }

  function post(path : String, handler: Object, routes : block() = null) {
    path = nested(path)
    applyFilters(path)
    Spark.post(path, new SparkGSRoute(handler, path))
    handleRoutes(path, routes)
  }

  function put(path : String, handler: Object, routes : block() = null) {
    path = nested(path)
    applyFilters(path)
    Spark.put(path, new SparkGSRoute(handler, path))
    handleRoutes(path, routes)
  }

  function patch(path : String, handler: Object, routes : block() = null) {
    path = nested(path)
    applyFilters(path)
    Spark.patch(path, new SparkGSRoute(handler, path))
    handleRoutes(path, routes)
  }

  function delete(path : String, handler: Object, routes : block() = null) {
    path = nested(path)
    applyFilters(path)
    Spark.delete(path, new SparkGSRoute(handler, path))
    handleRoutes(path, routes)
  }

  function head(path : String, handler: Object, routes : block() = null) {
    path = nested(path)
    applyFilters(path)
    Spark.head(path, new SparkGSRoute(handler, path))
    handleRoutes(path, routes)
  }

  function trace(path : String, handler: Object, routes : block() = null) {
    path = nested(path)
    applyFilters(path)
    Spark.trace(path, new SparkGSRoute(handler, path))
    handleRoutes(path, routes)
  }

  function connect(path : String, handler: Object, routes : block() = null) {
    path = nested(path)
    applyFilters(path)
    Spark.connect(path, new SparkGSRoute(handler, path))
    handleRoutes(path, routes)
  }

  function options(path : String, handler: Object, routes : block() = null) {
    path = nested(path)
    applyFilters(path)
    Spark.options(path, new SparkGSRoute(handler, path))
    handleRoutes(path, routes)
  }

  function handle(path: String, handler: Object, verbs : List<SparkGSRequest.HttpVerb> = null) {
    if(verbs == null) {
      verbs = SparkGSRequest.HttpVerb.AllValues
    }
    if(verbs.contains(SparkGSRequest.HttpVerb.GET)) get(path, handler)
    if(verbs.contains(SparkGSRequest.HttpVerb.POST)) post(path, handler)
    if(verbs.contains(SparkGSRequest.HttpVerb.PUT)) put(path, handler)
    if(verbs.contains(SparkGSRequest.HttpVerb.PATCH)) patch(path, handler)
    if(verbs.contains(SparkGSRequest.HttpVerb.DELETE)) delete(path, handler)
    if(verbs.contains(SparkGSRequest.HttpVerb.HEAD)) head(path, handler)
    if(verbs.contains(SparkGSRequest.HttpVerb.TRACE)) trace(path, handler)
    if(verbs.contains(SparkGSRequest.HttpVerb.CONNECT)) connect(path, handler)
    if(verbs.contains(SparkGSRequest.HttpVerb.OPTIONS)) options(path, handler)
  }

  function resource(path : String, controller : IResourceController) {
    // Basic collection REST-ful URLs
    get(path, \-> controller.index())
    get(path + "/new", \-> controller._new())
    post(path, \-> controller.create())

    // Additional methods
    if(controller.IntrinsicType.TypeInfo typeis IRelativeTypeInfo) {
      var publicMethods = controller.IntrinsicType.TypeInfo.DeclaredMethods.where( \ m -> m.Public && not m.Static )
      for(m in publicMethods) {
        if(!{"index", "_new", "show", "create", "edit", "update"}.contains(m.DisplayName)) {
          if(m.Parameters.length == 0){
            handle(path + "/" + m.DisplayName.toLowerCase(), \-> m.CallHandler.handleCall(controller, {}))
          }
          else if(m.Parameters.length == 1 && m.Parameters[0].FeatureType == String)
          {
            handle(path + "/:id/" + m.DisplayName.toLowerCase(), \-> m.CallHandler.handleCall(controller, {Params['id']}))
          }
        }
      }
    }

    // Basic instance REST-ful URLs
    get(path + "/:id", \-> controller.show(Params['id']))
    get(path + "/:id/edit", \-> controller.edit(Params['id']))
    handle(path + "/:id", \-> controller.update(Params['id']), :verbs = {PUT, POST})
  }

  function rpc(path : String, controller : Object) {
    var typeInfo = (typeof controller).TypeInfo
    if(typeInfo typeis IRelativeTypeInfo) {
      var publicMethods = typeInfo.DeclaredMethods.where( \ m -> m.Public && not m.Static )
      var addedMethods = {}
      for(m in publicMethods) {
        if(!addedMethods.contains(m.DisplayName)) {
          handle(path + "/" + m.DisplayName.toLowerCase(), \-> m.CallHandler.handleCall(controller, ParamConverter.populateArgs(Params, m.Parameters)))
        } else {
          throw "Overloaded method now allowed in RPC endpoints: ${typeInfo.DisplayName}.${m.DisplayName}"
        }
      }
    }
  }

  function onException(ex : Class<Exception>, blk : block(ex:Exception, req:SparkGSRequest , resp:SparkGSResponse)) {
    Spark.exception(ex, \ e, r, p -> blk(e, Request, Response))
  }

  //===================================================================
  // Nested Path Support
  //===================================================================

  function path(path : String) : Closeable {
    _pathQueue.add(path)
    return \-> _pathQueue.remove()
  }

  private function handleRoutes(path : String, routes : block()) {
    _pathQueue.add(path)
    if (routes != null) routes()
    _pathQueue.pop()
  }

  private function nested(original : String) : String {
    var newPath = new StringBuffer()
    for (path in _pathQueue) {
      newPath.append(path)
    }
    newPath.append(original)
    return newPath.toString()
  }

  //===================================================================
  // Filtering Support
  //===================================================================

  function filter(filter : ISparkGSFilter) : Closeable {
    _filterStack.push(filter)
    return \-> _filterStack.pop()
  }

  function filters(filters : List<ISparkGSFilter>) : Closeable {
    filters.each(\ f -> _filterStack.push(f))
    return \-> filters.each(\ f -> _filterStack.pop() )
  }

  function beforeFilter(blk : block(req: SparkGSRequest, resp: SparkGSResponse)) : Closeable {
    return filter(ISparkGSFilter.wrapBefore(blk))
  }

  function beforeFilters(filters : List<block(req: SparkGSRequest, resp: SparkGSResponse)>) : Closeable {
    filters.each(\ f -> _filterStack.push(ISparkGSFilter.wrapBefore(f)))
    return \-> filters.each(\ f -> _filterStack.pop() )
  }

  function afterFilter(blk : block(req: SparkGSRequest, resp: SparkGSResponse)) : Closeable {
    return filter(ISparkGSFilter.wrapAfter(blk))
  }

  function afterFilters(filters : List<block(req: SparkGSRequest, resp: SparkGSResponse)>) : Closeable {
    filters.each(\ f -> _filterStack.push(ISparkGSFilter.wrapAfter(f)))
    return \-> filters.each(\ f -> _filterStack.pop() )
  }

  // Telescope through the stack of filters
  private function applyFilters(path : String) {
    maybeInitRequestSetupFilter()
    for (currentFilter in _filterStack) {
      Spark.before(path, \ r, p -> currentFilter.before(Request, Response))
    }
    for (currentFilter in _filterStack.reverse()) {
      Spark.after(path, \ r, p -> currentFilter.after(Request, Response))
    }
  }


  function before(handler : block(req:SparkGSRequest , resp:SparkGSResponse), path : String = SparkUtils.ALL_PATHS, acceptType: String = null) {
    Spark.before(path, acceptType, \ r, p -> handler(Request, Response))
  }

  function after(handler : block(req:SparkGSRequest , resp:SparkGSResponse), path : String = SparkUtils.ALL_PATHS, acceptType: String = null) {
    Spark.after(path, acceptType, \ r, p -> handler(Request, Response))
  }

  function metering(path : String = null) : Closeable {
    var controller = new MetricsController(path ?: '/metering')
    resource(path ?: '/metering', controller)
    return filter(controller.Filter)
  }


  function traceWith(name : String = "Trace") : Closeable {
    return filter(new TraceFilter(name))
  }


  //===================================================================
  // Command line arg handling
  //===================================================================

  override function afterExecution( t : Throwable ) {
    maybeInitRequestSetupFilter()
    Spark.after( \req, resp -> SparkGSRequestSupport.clear() )
    if(t != null) {
      print("Error when evaluating SparkFile:")
      t.printStackTrace()
    }
  }

  function maybeInitRequestSetupFilter() {
    if(_setup != null) {
      Spark.before(_setup)
      _setup = null
    }
  }

  override function beforeExecution() : boolean {
    if(CommandLineAccess.RawArgs.size() > 1) {
      if(CommandLineAccess.RawArgs[0] == "--port") {
        Port = CommandLineAccess.RawArgs[1].toInt()
      }
    }
    return true
  }

}