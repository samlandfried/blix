let express = require('express')
let app = express()
let bodyParser = require('body-parser')
const routes = require('./routes')
let port = (process.env.PORT || 3000)
let helmet = require('helmet')

app.use(helmet())
app.use(bodyParser.json())
app.use('/api/v1', routes)
app.use('/assets', express.static('assets'))

app.listen(port, () => {
  console.log(`Worker ${process.pid} listening at port: ${port}`)
})