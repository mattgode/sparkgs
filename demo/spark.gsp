// classpath "org.gosu-lang.gosu:sparkgs:0.10"
// extends sparkgs.SparkFile

get("/", \-> test.render(Writer) )

get("/foo", \-> "Foo!" )

get("/bar", \-> "Barrr!" )

get("/doh", \-> "It's a miracle!" )

get("/bbb", \-> "It's a miracle! ${Params['asdf']}" )

get("/square/:int", \-> ({1, 2, 3} as String) )

get("/test/:foo", \-> Params[':foo'] )

post("/post_to", \-> Params['foo'] )