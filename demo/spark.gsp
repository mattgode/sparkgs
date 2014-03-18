// classpath "org.gosu-lang.gosu:sparkgs:0.10"
// extends sparkgs.SparkFile

uses controller.*
uses view.*
uses view.layout.*

// Config
DefaultLayout = new AppLayoutTmp() // Should be AppLayout
StaticFiles = "/public"

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
  Layout = new NestedLayoutTmp()
  Writer.append("asdfsadf")
})

