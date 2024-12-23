require('dotenv').config()
const express = require("express")
const { createInvoice } = require("./createInvoice.js");
const app = express()
app.use(express.json())
const PORT = process.env["PORT"] || 11000


app.post("/createInvoice", (req,res) => {
    res.status(200)
   // res.contentType("application/pdf");
   createInvoice(req.body, "invoice.pdf")
    res.send("Invoice created successfully");
})


app.get("/", (req,res)=> {
    res.status(200).send({msg: "Hi there, welcome to Invoice API. Go to /sample route to get sample data"})
})

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})