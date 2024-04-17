const Responses = require("../utils/res.models")

module.exports = class Response {
    status
    msg
    description
    data
    force

    constructor(model = {}) {
        if(model.force) {
            this.status = model.status 
            this.data = model.data 
            this.force = true
            return;
        }
        this.status = model.status ? model.status : 200
        this.msg = model.msg ? model.msg : null
        this.description = model.description ? model.description : null
        this.data = model.data ?model.data : null
    }

    static DEFAULT(data) {
        return new Response({force: true, data, status: 200})
    }

    static NotFound(msg=Responses.NotFound.msg) {
        return new Response({...Responses.NotFound, data: null, msg})
    }

    static OK(data = null, msg = Responses.OK.msg) {
        return new Response({...Responses.OK, data, msg})
    }

    static Created(data = null, msg = Responses.Created.msg) {
        return new Response({...Responses.Created, data, msg})
    }

    static BadRequest(msg = Responses.BadRequest.msg) {
        return new Response({...Responses.BadRequest, msg})
    }

    static BadRequestPayload(data = null, msg = Responses.BadRequest.msg) {
        return new Response({...Responses.BadRequest, data})
    }

    static InternalServerError(msg = Responses.InternalServerError.msg) {
        return new Response({...Responses.InternalServerError, msg})
    }

    static Unauthorized(msg) {
        return new Response({...Responses.Unauthorized, msg})
    }
}