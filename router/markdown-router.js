const Router = require('express').Router;
const router = new Router();
const markdownController = require("../controllers/markdown-controller")

router.get('/', markdownController.get)
router.post('/', markdownController.upload)

module.exports = router