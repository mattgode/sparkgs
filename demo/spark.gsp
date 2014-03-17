// classpath "org.gosu-lang.gosu:sparkgs:0.10"
// extends sparkgs.SparkFile

uses view.*
uses view.layout.*

// Set layout
Layout = new AppLayoutTmp() // Should be AppLayout

// Set location of static files
StaticFiles = "/public"

get("/", \-> Sample.render(Writer) )

get("/foo", "Foo!" )

get("/bar", "Bar!" )

get("/bar2", "Bar!" )

get("/square/:int", \-> Params['int'].toInt() * Params['int'].toInt() )
