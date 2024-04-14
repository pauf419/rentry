const logic = require("../utils/logic")
const Response = require("../responses/response")
const markdownService = require("../services/markdown-service")

class MarkdownController {
    async get(req, res, next) {
        try {
            return console.log(
            req.headers['x-real-ip'])
            const {raw, edit_code} = req.query;
            if(logic.regexobject({edit_code})) throw Response.BadRequest("Expected data not validated")
            
            const res = await markdownService.get(
                edit_code, 
                raw==="true" ? true : false,
                req.headers['x-forwarded-for'] || req.socket.remoteAddress  
            )
            return next(res)
        } catch (e) { 
            console.error(e)
            return next(e) 
        }
    }

    async upload(req, res, next) {
        try {
            const {data} = req.body;
            if(logic.regexobject({data})) throw Response.BadRequest("Expected data not validated")
            const res = await markdownService.upload(
                data, 
                req.socket.remoteAddress, 
            )
            return next(res)
        } catch (e) {  
            console.error(e)
            return next(e) 
        }
    }
}

module.exports = new MarkdownController()