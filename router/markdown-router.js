const Router = require('express').Router;
const router = new Router();
const markdownController = require("../controllers/markdown-controller")

router.get('/', markdownController.get)
router.post('/', markdownController.upload)
router.post("/edit", markdownController.edit)
router.get("/visitors", markdownController.get_visitors) 
router.post("/delete", markdownController.delete)

module.exports = router