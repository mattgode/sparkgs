// classpath "org.gosu-lang.gosu:sparkgs:0.10"
// extends sparkgs.SparkFile

uses controller.*
uses view.*
uses view.layout.*

// Config
Layout = new AppLayoutTmp() // Should be AppLayout
StaticFiles = "/public"

// Routes
handle("/", \-> Sample.render(Writer), :verbs = { GET, POST } )

get("/foo", "Foo!")

get("/bar", \-> "Bar!")

get("/doh", \-> "Smergy!")

handle("/post_to", \-> Params['foo'] )

handle("/handle", \-> Request.IsGet )

get("/redirect", \-> redirect("/foo") )

resource("/contacts", new ContactsController())