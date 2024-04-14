const Router = require('express').Router;
const router = new Router();
const markdownRouter = require('./markdown-router')

router.use("/markdown", markdownRouter)

module.exports = router