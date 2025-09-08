const express = require('express');
const app = express();
const PORT = 3002;
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.listen(PORT, () => {
      console.log(`App is listening at http://localhost:${PORT}`);
})