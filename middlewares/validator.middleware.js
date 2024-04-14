const Response = require("../responses/response")

module.exports = function(data, _, res, _) {
    if(data instanceof Response) {
        return res.status(data.status).json(data)
    }
    if(data instanceof Error) return res.status(500).json(Response.InternalServerError())
    return res.json(data)
}