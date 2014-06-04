#!/usr/bin/env gosu
classpath "org.gosu-lang.sparkgs:sparkgs:0.1-SNAPSHOT,."

uses controller.*
uses view.*
uses view.layout.*
uses java.util.*

extends sparkgs.SparkFile

// Config
StaticFiles = "/public"
Layout = AppLayout

// Routes

// Root example to writer
handle("/", \-> Sample.render(Writer), :verbs = { GET, POST } )

// Raw string example
get("/foo", "Foo!")

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
  Writer.append("")
  Layout = NestedLayout
  Writer.append("asdfsadf")
})

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

