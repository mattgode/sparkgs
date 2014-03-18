// classpath "org.gosu-lang.gosu:sparkgs:0.10"
// extends sparkgs.SparkFile

uses controller.*
uses view.*
uses view.layout.*

// Set layout
Layout = new AppLayoutTmp() // Should be AppLayout

// Set location of static files
StaticFiles = "/public"

handle("/", \-> Sample.render(Writer), { GET, POST } )

get("/foo", "Foo!")

get("/bar", \-> "Bar!")

handle("/post_to", \-> Params['foo'] )

handle("/handle", \-> Request.IsGet )

