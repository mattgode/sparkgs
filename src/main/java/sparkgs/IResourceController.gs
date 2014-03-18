package sparkgs

interface IResourceController {

  function index()
  function _new()
  function create()

  function show(id : String)
  function edit(id : String)
  function update(id : String)

}