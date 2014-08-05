#!/usr/bin/env gosu
classpath "org.gosu-lang.sparkgs:sparkgs:0.1-SNAPSHOT,."

uses controller.*
uses view.*
uses view.layout.*
uses java.util.*
uses java.lang.Exception
uses java.lang.System

extends sparkgs.SparkGSFile

//// Config
StaticFiles = "/public"
Layout = AppLayout

//// Routes
handle("/", \-> Sample.renderToString(), :verbs = { GET, POST } )

//// Raw string example
get("/foo", \-> "Foo! ${Params['bar']}")

using(beforeFilter(\ req, resp -> print(req.IP))) {
  get("/filtered", \-> "Foo!")
}

// Post example
post("/post_to", \-> Params['foo'] )

// Handle example
handle("/handle", \-> Request.IsGet )

// Redirect example
get("/redirect", \-> redirect("/foo") )

// REST-ful resource example
resource("/contacts", new ContactsController())

// RPC Example
rpc("/rpc", new RPCExample())

// Nested Layout Example
get("/nested", \-> {
  Layouts.push(NestedLayout)
  return "asdfsadf"
})

//// Custom Layout Example
//get("/custom_layout", \-> {
//  Layout = CustomLayout
//  return "asdfsadf"
//})

// Cookie example
get("/cookie1", \-> {
  Cookies["Foo"] =  UUID.randomUUID().toString()
  redirect("/cookie2")
})
get("/cookie2", \-> Cookies["Foo"] )

// Header example
get("/header", \-> {
  Headers["X-Foo"] = "Bar"
  return "derp"
})

// Feature Literal Examples
get("/fl_example", TestController#foo())
get("/fl_static_example", TestController#staticFoo())
get("/fl_bad", TestController#bar())

get("/log_info", \-> {
  logInfo(Request.SparkJavaRequest.queryString());
  return "${Params['bar']}"
})

get("/trace_example", \-> {
  Request.pushToTrace()
  Request.pushToTrace()
  Request.printTrace()

  Request.popFromTrace()
  Request.printTrace()
  return "Check out your console!"
})

// exception handling
get("/exception", \-> { throw "Foo!" } )
onException(Exception, \ ex, req, resp -> {
  resp.Body = "Exception Handled!"
})