const express        = require('express');
const bodyParser     = require('body-parser');

const flatfile 		 = require('flat-file-db');
const db 			 = flatfile.sync('./app/databases/db.json');

const app            = express();
const port 			 = 8000;
app.use(bodyParser.urlencoded({ extended: true }));

const routes = require('./app/routes/index')
routes(app, db);

app.listen(port, () => {
  console.log('We are live on ' + port);
});