const pool = require("../db/pool")
const {v4} = require("uuid")
const Response = require("../responses/response")
const logic = require("../utils/logic")
const randomId = require("random-id")
const {SuperfaceClient} = require("@superfaceai/one-sdk")
const MarkdownDto = require("../dtos/markdown-dto")
const MarkdownDtoUnlocked = require("../dtos/markdown-dto-unlocked")

class MarkdownService {

    async getContry(ip) {
        
        const sdk = new SuperfaceClient();

        const profile = await sdk.getProfile("address/ip-geolocation@1.0.1");
      
        const result = await profile.getUseCase("IpGeolocation").perform(
          {
            ipAddress: ip
          },
          {
            provider: "ipdata",
            security: {
              apikey: {
                apikey: "6a29e3602ce5c218aa652e2b439083d30f1cca5095ddf9127fc3d310"
              }
            }
          }
        );       
      
        try {
          return result.unwrap()
        } catch (error) {
            return "Undefined"
        }
      }
     

    async get(id, raw, ip) {

        var {addressCountry} = await this.getContry(ip);

        const visitor = await pool.query("SELECT * FROM visitor WHERE refer = $1 AND ip = $2", [id, ip]).then(data => data.rows[0])
        if(!visitor) await pool.query("INSERT INTO visitor(ip, timestamp, country, refer, id) VALUES($1, $2, $3, $4, $5)", [ip, Date.now(), addressCountry, id, v4()])

        const markdown = await pool.query("SELECT * FROM markdown WHERE id = $1", [id]).then(data => data.rows[0])

        if(!markdown) return Response.NotFound("Could not find markdown with the same id(or edit code invalid).")

        const visitors = await pool.query("SELECT * FROM visitor WHERe refer = $1", [id]).then(data => data.rows)
        console.log("Markdown service: " + markdown.data)
        if(raw) return Response.DEFAULT(markdown.data)
        return Response.OK(new MarkdownDto({
            ...markdown, 
            visitors: visitors.length
        }))
    
    }

    async edit(id, edit_code, data, new_edit_code) {
      const markdown_exists = await pool.query("SELECT * FROM markdown WHERE id = $1 AND edit_code = $2", [id, edit_code]).then(data => data.rows[0]) 
      if(!markdown_exists) return Response.Unauthorized("Invalid edit code.") 
      if(!new_edit_code) new_edit_code = edit_code
      const markdown = await pool.query("UPDATE markdown SET data = $1, edit_code = $2 WHERE id = $3 RETURNING *", [data, new_edit_code, id]).then(data => data.rows[0])
      return Response.OK(new MarkdownDtoUnlocked({
        ...markdown,
      }))
    }

    async upload(data, owner, custom_edit_code) {
      const edit_code = custom_edit_code ? custom_edit_code : randomId(12, "aA0")
        const markdown = await pool.query("INSERT INTO markdown(id, edit_code, data, timestamp, owner) VALUES($1, $2, $3, $4, $5) RETURNING *", [randomId(8, "aA0"), edit_code, data, Date.now(), owner]).then(data => data.rows[0])
        return Response.OK(new MarkdownDtoUnlocked({
          ...markdown,
        }))
    }  

    async delete(id, edit_code) {
      const exists = await pool.query("SELECT * FROM markdown WHERE id = $1 AND edit_code = $2", [id, edit_code]).then(data => data.rows[0])
      if(!exists) return Response.NotFound("Could not find markdown with the same id(or edit code invalid)")
      const data = await pool.query("DELETE FROM markdown WHERE id = $1 AND edit_code = $2 RETURNING *", [id, edit_code]).then(data => data.rows)
      return Response.OK({
        data
      })
    }
    
    async get_visitors(id, edit_code) {
      const exists = await pool.query("SELECT * FROM markdown WHERE id = $1 AND edit_code = $2", [id, edit_code]).then(data => data.rows[0])
      if(!exists) return Response.NotFound("Could not find markdown with the same id(or edit code invalid)")
      const visitors = await pool.query("SELECT * FROM visitor WHERE refer = $1", [id]).then(data => data.rows)
      return Response.OK({
        visitors 
      })
    }

}

module.exports = new MarkdownService()