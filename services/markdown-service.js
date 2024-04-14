const pool = require("../db/pool")
const {v4} = require("uuid")
const Response = require("../responses/response")
const logic = require("../utils/logic")
const randomId = require("random-id")
const {SuperfaceClient} = require("@superfaceai/one-sdk")

class MarkdownService {

    async run(ip) {

        console.log(ip)
        
        const sdk = new SuperfaceClient();
        // Load the profile
        const profile = await sdk.getProfile("address/ip-geolocation@1.0.1");
      
        // Use the profile
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
      
        // Handle the result
        try {
          const data = result.unwrap();
          console.log("\n DATA: "+ data)
        } catch (error) {
        }
      }
    

    async get(edit_code, raw, ip) {

        var geo = await this.run(ip);

        console.log(geo)

        await pool.query("INSERT INTO visitor(ip, timestamp, country, refer, id) VALUES($1, $2, $3, $4, $5)", [ip, Date.now(), ])

    }

    async upload(data, owner) {
        const markdown = await pool.query("INSERT INTO markdown(id, edit_code, data, timestamp, owner) VALUES($1, $2, $3, $4, $5) RETURNING *", [v4(), randomId(12, "aA0"), data, Date.now(), owner]).then(data => data.rows[0])
        return Response.OK(markdown)
    }   

}

module.exports = new MarkdownService()