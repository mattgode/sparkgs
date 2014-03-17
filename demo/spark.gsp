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

get("/foo", "Foo!", {
    get("/bar", \-> someFunc() )
 })

get("/bar", new TestController().foo() )

get("/square/:int", \-> Params['int'].toInt() * Params['int'].toInt() )
