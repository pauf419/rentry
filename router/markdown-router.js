const Router = require("express").Router;
const router = new Router();
const markdownController = require("../controllers/markdown-controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", markdownController.get);
router.post("/", markdownController.upload);
router.post("/edit", markdownController.edit);
router.get("/visitors", markdownController.get_visitors);
router.get("/visitors/count", markdownController.get_visitors_count);
router.get(
  "/visitors/dynamic/count",
  markdownController.get_visitors_dynamic_count
);
router.post("/delete", markdownController.delete);
router.post("/cron", authMiddleware, markdownController.cron);
router.get("/cron", authMiddleware, markdownController.get_cron);

module.exports = router;
