const Response = require("../responses/response")
const logic = require("../utils/logic")

module.exports = async function(req, _, next) {
    try {
        const accessCode = req.query.access_code
        
        if(logic.regexobject({accessCode})) return next(Response.Unauthorized())

        if(accessCode !== process.env.ACCESS_CODE) return next(Response.Unauthorized())
        
        next()
    } catch(e) {
        console.error(e) 
        return next(Response.Unauthorized())
    }
}