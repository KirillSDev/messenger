const express = require("express")
const path = require("path")
const DEFAULT_PORT = 3000

const app = express() //initialization
// const __dirname = path.resolve() //current path
const PORT = process.env.PORT || DEFAULT_PORT

app.use(express.static(path.join(__dirname + "/dist")))

app.get("/500", (req, res) => {
  res.sendFile(__dirname + "/dist/pages/500/500.html")
})
app.get("/*", (req, res) => {
  res.sendFile(__dirname + "/dist/pages/404/404.html")
})

app.listen(PORT, () => {
  console.log(`Server has been started on port ${PORT}`)
})
