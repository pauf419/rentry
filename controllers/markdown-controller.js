const logic = require("../utils/logic");
const Response = require("../responses/response");
const markdownService = require("../services/markdown-service");

class MarkdownController {
  async get(req, res, next) {
    try {
      const { raw, id } = req.query;
      if (logic.regexobject({ id }))
        throw Response.BadRequest("Expected data not validated");

      /*const res = await markdownService.get(
                id, 
                raw==="true" ? true : false,
                String(req.headers['x-forwarded-for'] || req.socket.remoteAddress).replace("::ffff:", "")
            )*/
      const res = await markdownService.get(
        id,
        raw === "true" ? true : false,
        String(
          req.headers["x-forwarded-for"] || req.socket.remoteAddress
        ).replace("::ffff:", "")
      );
      return next(res);
    } catch (e) {
      console.error(e);
      return next(e);
    }
  }

  async edit(req, res, next) {
    try {
      const { data, edit_code, id, new_edit_code } = req.body;
      if (logic.regexobject({ data, edit_code, id }))
        throw Response.BadRequest("Expected data not validated");
      const res = await markdownService.edit(
        id,
        edit_code,
        data,
        new_edit_code
      );
      return next(res);
    } catch (e) {
      console.error(e);
      return next(e);
    }
  }

  async upload(req, res, next) {
    try {
      const { data, custom_edit_code } = req.body;
      if (logic.regexobject({ data }))
        throw Response.BadRequest("Expected data not validated");
      const res = await markdownService.upload(
        data,
        req.socket.remoteAddress,
        custom_edit_code
      );
      return next(res);
    } catch (e) {
      console.error(e);
      return next(e);
    }
  }

  async get_visitors(req, res, next) {
    try {
      const { id, edit_code, extended, offset, limit } = req.query;
      if (logic.regexobject({ id, edit_code, offset, limit }))
        throw Response.BadRequest("Expected data not validated");
      const res = await markdownService.get_visitors(
        id,
        edit_code,
        extended === "true" ? true : false,
        offset,
        limit
      );
      return next(res);
    } catch (e) {
      console.error(e);
      return next(e);
    }
  }

  async cron(req, res, next) {
    try {
      const { min } = req.body;
      if (logic.regexobject({ min }))
        throw Response.BadRequest("Expected data not validated");
      const res = await markdownService.cron(min);
      return next(res);
    } catch (e) {
      console.error(e);
      return next(e);
    }
  }

  async get_cron(req, res, next) {
    try {
      const res = await markdownService.get_cron();
      return next(res);
    } catch (e) {
      console.error(e);
      return next(e);
    }
  }

  async get_visitors_count(req, res, next) {
    try {
      const { id, edit_code } = req.query;
      if (logic.regexobject({ id, edit_code }))
        throw Response.BadRequest("Expected data not validated");
      const res = await markdownService.get_visitors_count(id, edit_code);
      return next(res);
    } catch (e) {
      console.error(e);
      return next(e);
    }
  }

  async get_visitors_dynamic_count(req, res, next) {
    try {
      const { id, edit_code } = req.query;
      if (logic.regexobject({ id, edit_code }))
        throw Response.BadRequest("Expected data not validated");
      return next(
        await markdownService.get_visitors_dynamic_count(id, edit_code)
      );
    } catch (e) {
      console.error(e);
      return next(e);
    }
  }

  async get_raw(req, res, next) {
    try {
      const { id } = req.params;
      if (logic.regexobject({ id }))
        throw Response.BadRequest("Expected data not validated");
      const res = await markdownService.get(
        id,
        true,
        String(
          req.headers["x-forwarded-for"] || req.socket.remoteAddress
        ).replace("::ffff:", "")
      );
      return next(res);
    } catch (e) {
      console.error(e);
      return next(e);
    }
  }

  async delete(req, res, next) {
    try {
      const { id, edit_code } = req.body;
      if (logic.regexobject({ id, edit_code }))
        throw Response.BadRequest("Expected data not validated");
      const res = await markdownService.delete(id, edit_code);
      return next(res);
    } catch (e) {
      console.error(e);
      return next(e);
    }
  }
}

module.exports = new MarkdownController();
