const logic = require("../utils/logic")
const Response = require("../responses/response")
const markdownService = require("../services/markdown-service")

class MarkdownController {
    async get(req, res, next) {
        try {
            const {raw, id} = req.query;
            if(logic.regexobject({id})) throw Response.BadRequest("Expected data not validated")
            
            const res = await markdownService.get(
                id, 
                raw==="true" ? true : false,
                String(req.headers['x-forwarded-for'] || req.socket.remoteAddress).replace("::ffff:", "")
            )
            return next(res)
        } catch (e) { 
            console.error(e)
            return next(e) 
        }
    }

    async edit(req, res, next) {
        try {
            const {data, edit_code, id, new_edit_code} = req.body;
            if(logic.regexobject({data, edit_code, id})) throw Response.BadRequest("Expected data not validated")
            const res = await markdownService.edit(
                id, 
                edit_code,
                data,
                new_edit_code
            )
            return next(res)
        } catch (e) {  
            console.error(e)
            return next(e) 
        } 
    }

    async upload(req, res, next) {
        try {
            const {data, custom_edit_code} = req.body;
            if(logic.regexobject({data})) throw Response.BadRequest("Expected data not validated")
            const res = await markdownService.upload(
                data, 
                req.socket.remoteAddress, 
                custom_edit_code
            )
            return next(res)
        } catch (e) {  
            console.error(e)
            return next(e) 
        }
    }

    async get_visitors(req, res, next) {
        try { 

            const {id, edit_code} = req.query 
            if(logic.regexobject({id, edit_code})) throw Response.BadRequest("Expected data not validated")
            const res = await markdownService.get_visitors(
                id, 
                edit_code
            )
            return next(res)
        } catch(e) {
            console.error(e) 
            return next(e)
        }
    }

    async get_raw(req, res, next) {
        try { 

            const {id} = req.params
            if(logic.regexobject({id})) throw Response.BadRequest("Expected data not validated")
            const res = await markdownService.get( 
                id, 
                true,
                String(req.headers['x-forwarded-for'] || req.socket.remoteAddress).replace("::ffff:", "")
            )
            console.log(res)
            return next(res)
        } catch(e) {
            console.error(e) 
            return next(e)
        }   
    }

    async delete(req, res, next) {
        try { 

            const {id, edit_code} = req.body
            if(logic.regexobject({id, edit_code})) throw Response.BadRequest("Expected data not validated")
            const res = await markdownService.delete(
                id, 
                edit_code
            )
            return next(res)
        } catch(e) {
            console.error(e) 
            return next(e)
        } 
    }
}

module.exports = new MarkdownController()