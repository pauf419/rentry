const { v4 } = require("uuid");
const Response = require("../responses/response");
const randomId = require("random-id");
const MarkdownDto = require("../dtos/markdown-dto");
const MarkdownDtoUnlocked = require("../dtos/markdown-dto-unlocked");
const DB = require("../utils/db_query");
const geoService = require("./geo-service");
const bcrypt = require("bcrypt");
const cron = require("node-cron");

class MarkdownService {
  async get(id, raw, ip) {
    const markdown = await DB.query(
      "SELECT * FROM markdown WHERE id = $1",
      [id],
      true
    );

    if (!markdown)
      return Response.NotFound(
        "Could not find markdown with the same id(or edit code invalid)."
      );

    const visitor = await DB.query(
      "SELECT * FROM visitor WHERE refer = $1 AND ip = $2",
      [id, ip],
      true
    );
    const visitor_dynamic = await DB.query(
      "SELECT * FROM visitor_dynamic WHERE refer = $1 AND ip = $2",
      [id, ip],
      true
    );
    if (raw) {
      if (!visitor) {
        await DB.query(
          "INSERT INTO visitor(ip, timestamp, country, refer, id, timestamp_last) VALUES($1, $2, $3, $4, $5, $6)",
          [ip, Date.now(), "USA", id, v4(), Date.now()]
        );
      }
      if (!visitor_dynamic)
        await DB.query(
          "INSERT INTO visitor_dynamic(ip, timestamp, refer, id) VALUES($1, $2, $3, $4)",
          [ip, Date.now(), id, v4()]
        );
      await DB.query(
        "UPDATE visitor SET timestamp_last = $1 WHERE refer = $2 AND ip = $3",
        [Date.now(), id, ip]
      );
      await DB.query(
        "UPDATE visitor_dynamic SET timestamp = $1 WHERE refer = $2 AND ip = $3",
        [Date.now(), id, ip]
      );
    }

    const visitors = await DB.query("SELECT * FROM visitor WHERE refer = $1", [
      id,
    ]);

    if (raw) return Response.DEFAULT(markdown.data);
    return Response.OK(
      new MarkdownDto({
        ...markdown,
        visitors: visitors.length,
      })
    );
  }

  async edit(id, edit_code, data, new_edit_code) {
    const markdown_exists = await DB.query(
      "SELECT * FROM markdown WHERE id = $1",
      [id],
      true
    );
    if (!markdown_exists) return Response.NotFound("Undefined markdown id");
    const equal = await bcrypt.compare(edit_code, markdown_exists.edit_code);
    if (!equal) return Response.Unauthorized("Invalid edit code");
    if (!new_edit_code) new_edit_code = edit_code;
    const hash_code = await bcrypt.hash(new_edit_code, 3);
    const markdown = await DB.query(
      "UPDATE markdown SET data = $1, edit_code = $2 WHERE id = $3 RETURNING *",
      [data, hash_code, id],
      true
    );
    return Response.OK(
      new MarkdownDtoUnlocked({
        ...markdown,
        edit_code: new_edit_code,
      })
    );
  }

  async upload(data, owner, custom_edit_code) {
    const edit_code = custom_edit_code ? custom_edit_code : randomId(12, "aA0");
    const hash_code = await bcrypt.hash(edit_code, 3);
    const markdown = await DB.query(
      "INSERT INTO markdown(id, edit_code, data, timestamp, owner) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [randomId(8, "aA0"), hash_code, data, Date.now(), owner],
      true
    );
    return Response.OK(
      new MarkdownDtoUnlocked({
        ...markdown,
        edit_code,
      })
    );
  }

  async delete(id, edit_code) {
    const exists = await DB.query(
      "SELECT * FROM markdown WHERE id = $1 AND edit_code = $2",
      [id, edit_code],
      true
    );
    if (!exists)
      return Response.NotFound(
        "Could not find markdown with the same id(or edit code invalid)"
      );
    const data = await DB.query(
      "DELETE FROM markdown WHERE id = $1 AND edit_code = $2 RETURNING *",
      [id, edit_code]
    );
    return Response.OK({
      data,
    });
  }

  async get_visitors(id, edit_code, extended, offset, limit) {
    const exists = await DB.query(
      "SELECT * FROM markdown WHERE id = $1",
      [id],
      true
    );
    if (!exists)
      return Response.NotFound("Could not find markdown with the same id");
    const equal = await bcrypt.compare(edit_code, exists.edit_code);
    if (!equal) return Response.Unauthorized("Invalid edit code");
    var visitors = await DB.query(
      "SELECT * FROM visitor WHERE refer = $1 ORDER BY timestamp DESC LIMIT $2, $3",
      [id, offset, limit]
    );
    if (extended)
      for (var i = 0; i < visitors.length; i++) {
        visitors[i].timestamp = visitors[i].timestamp_last;
      }
    return Response.OK({
      visitors,
    });
  }

  async get_visitors_count(id, edit_code) {
    const exists = await DB.query(
      "SELECT * FROM markdown WHERE id = $1",
      [id],
      true
    );
    if (!exists)
      return Response.NotFound("Could not find markdown with the same id");
    const equal = await bcrypt.compare(edit_code, exists.edit_code);
    if (!equal) return Response.Unauthorized("Invalid edit code");
    var visitors = await DB.query("SELECT * FROM visitor WHERE refer = $1", [
      id,
    ]);
    return Response.OK({
      visitors: visitors.length,
    });
  }

  async get_visitors_dynamic_count(id, edit_code) {
    const exists = await DB.query(
      "SELECT * FROM markdown WHERE id = $1",
      [id],
      true
    );
    if (!exists)
      return Response.NotFound("Could not find markdown with the same id");
    const equal = await bcrypt.compare(edit_code, exists.edit_code);
    if (!equal) return Response.Unauthorized("Invalid edit code");
    var visitors = await DB.query("SELECT * FROM visitor_dynamic");

    return Response.OK({
      visitors: visitors.length,
    });
  }

  async get_visitor_stats(id, edit_code, ip) {
    const exists = await DB.query(
      "SELECT * FROM markdown WHERE id = $1",
      [id],
      true
    );
    if (!exists)
      return Response.NotFound("Could not find markdown with the same id");
    const equal = await bcrypt.compare(edit_code, exists.edit_code);
    if (!equal) return Response.Unauthorized("Invalid edit code");
    const visits = await DB.query(
      "SELECT * FROM visit WHERE markdown = $1 AND refer = $2",
      [id, ip]
    );
    return Response.OK({
      visits,
    });
  }

  async cron(min) {
    const rows = await DB.query(
      "UPDATE cron SET min = $1 WHERE base = 'root' RETURNING *",
      [min]
    );
    return Response.OK(rows[0]);
  }

  async get_cron() {
    const rows = await DB.query("SELECT * FROM cron WHERE base = 'root'");
    return Response.OK(rows[0]);
  }
}

module.exports = new MarkdownService();
