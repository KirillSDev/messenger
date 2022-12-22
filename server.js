const express = require("express")
const path = require("path")
const DEFAULT_PORT = 3000

const app = express() //initialization
// const __dirname = path.resolve() //current path
const PORT = process.env.PORT || DEFAULT_PORT

app.use(express.static(path.join(__dirname + "/dist")))

app.listen(PORT, () => {
  console.log(`Server has been started on port ${PORT}`)
})
