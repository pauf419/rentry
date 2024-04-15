const Response = require("../responses/response")

module.exports = function(data, _, res, _) {
    if(data instanceof Response) {
        console.log(data)
        if(data.force) return res.status(200).json(data.force)
        return res.status(data.status ? data.status : 200).json(data)
    }
    if(data instanceof Error) return res.status(500).json(Response.InternalServerError())
    return res.json(data)
}