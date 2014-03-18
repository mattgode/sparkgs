package controller

uses sparkgs.util.IHasRequestContext
uses sparkgs.IResourceController

class ContactsController implements IHasRequestContext, IResourceController {
  override function index() {
    Writer.append("Index")
  }

  override function _new() {
    Writer.append("New")
  }

  override function create() {
    Writer.append("Create")
  }

  override function show(id: String) {
    Writer.append("Show ${Params['id']}")
  }

  override function edit(id: String) {
    Writer.append("Edit ${Params['id']}")
  }

  override function update(id: String) {
    Writer.append("Update ${Params['id']}")
  }

  function search() {
    Writer.append("Search")
  }

  function addresses(id : String) {
    Writer.append("Update ${Params['id']}")
  }

}