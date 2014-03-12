// classpath "org.gosu-lang.gosu:sparkgs:0.10"
extends sparkgs.SparkFile

uses view.*
uses view.layout.*

// Set layout
Layout = new AppLayoutTmp() // Should be AppLayout

// Set location of static files
//StaticFiles = "/public"

get("/", \-> Sample.render(Writer) )

get("/foo", "Foo!" )

get("/bar", "Bar!" )

get("/square/:int", \-> Params['int'] * Params['int'] )

post("/post_to", \-> Params['foo'] )

get("/example/:bar", MyController#foo())

handle("/asdf", with(\-> "Foo", {
          get("/bar", \-> "Bar"
  })

rpc("/foo", MyRpcController)

restful("/contacts", ContactsController)
//  GET /contacts   -> ContactsController#index()
//  POST /contacts   -> ContactsController#create()
//  GET /contacts/:id -> ContactsController#show(id:String)

<a href="<%= urlFor(ContactsController#show(myContact.Id)) %>">Go To It</a>


  GET /asdf/bar