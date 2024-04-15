require('dotenv').config({path: `.${process.env.NODE_ENV}.env`})
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const router = require('./router/index')
const path = require("path")
const resValidator = require("./middlewares/validator.middleware")

const PORT = process.env.PORT || 5000;
const app = express()

app.use("/static", express.static(path.join(__dirname, 'static')));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ 
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use('/api', router);
app.use(resValidator) 
 

const start = async () => {
    try {
        
        app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

start()