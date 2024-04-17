const {v4} = require("uuid")
const Response = require("../responses/response")
const randomId = require("random-id")
const MarkdownDto = require("../dtos/markdown-dto")
const MarkdownDtoUnlocked = require("../dtos/markdown-dto-unlocked")
const DB = require("../utils/db_query")
const geoService = require("./geo-service")
const bcrypt = require('bcrypt');

class MarkdownService {
    async get(id, raw, ip) {

      var {addressCountry} = await geoService.getGeoStats(ip);

      const visitor = await DB.query("SELECT * FROM visitor WHERE refer = ? AND ip = ?", [id, ip], true)
      if(!visitor) await DB.query("INSERT INTO visitor(ip, timestamp, country, refer, id) VALUES(?, ?, ?, ?, ?)", [ip, Date.now(), addressCountry, id, v4()])

      const markdown = await DB.query("SELECT * FROM markdown WHERE id = ?", [id], true)

      if(!markdown) return Response.NotFound("Could not find markdown with the same id(or edit code invalid).")

      const visitors = await DB.query("SELECT * FROM visitor WHERE refer = ?", [id])

      if(raw) return Response.DEFAULT(markdown.data) 
      return Response.OK(new MarkdownDto({
          ...markdown, 
          visitors: visitors.length
      }))
    
    }

    async edit(id, edit_code, data, new_edit_code) {
      const markdown_exists = await DB.query("SELECT * FROM markdown WHERE id = ?", [id], true)
      if(!markdown_exists) return Response.NotFound("Undefined markdown id") 
      const equal = await bcrypt.compare(edit_code, markdown_exists.edit_code)
      if(!equal) return Response.Unauthorized("Invalid edit code")
      if(!new_edit_code) new_edit_code = edit_code
      const hash_code = await bcrypt.hash(new_edit_code, 3)
      const markdown = await DB.query("UPDATE markdown SET data = ?, edit_code = ? WHERE id = ? RETURNING *", [data, hash_code, id], true)
      return Response.OK(new MarkdownDtoUnlocked({
        ...markdown,
        edit_code: new_edit_code
      }))
    }
 
    async upload(data, owner, custom_edit_code) {
      const edit_code = custom_edit_code ? custom_edit_code : randomId(12, "aA0")
      const hash_code = await bcrypt.hash(edit_code, 3)
      const markdown = await DB.query("INSERT INTO markdown(id, edit_code, data, timestamp, owner) VALUES(?, ?, ?, ?, ?) RETURNING *", [randomId(8, "aA0"), hash_code, data, Date.now(), owner], true)
      return Response.OK(new MarkdownDtoUnlocked({
        ...markdown,
        edit_code
      }))
    }  

    async delete(id, edit_code) {
      const exists = await DB.query("SELECT * FROM markdown WHERE id = ? AND edit_code = ?", [id, edit_code], true)
      if(!exists) return Response.NotFound("Could not find markdown with the same id(or edit code invalid)")
      const data = await DB.query("DELETE FROM markdown WHERE id = ? AND edit_code = ? RETURNING *", [id, edit_code])
      return Response.OK({
        data
      })
    }
    
    async get_visitors(id, edit_code) {
      const exists = await DB.query("SELECT * FROM markdown WHERE id = ?", [id], true)
      if(!exists) return Response.NotFound("Could not find markdown with the same id")
      const equal = await bcrypt.compare(edit_code, exists.edit_code)
      if(!equal) return Response.Unauthorized("Invalid edit code")
      const visitors = await DB.query("SELECT * FROM visitor WHERE refer = ?", [id])
      return Response.OK({  
        visitors 
      })
    }
}

module.exports = new MarkdownService()