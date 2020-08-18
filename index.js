const express = require('express');
const cors = require('cors');
const { connectToDB } = require('./database/db-connect.js');
const config = require('./config');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/error');
const routes = require('./routes');
const pkg = require('./package.json');


const { port, dbUrl, secret } = config;
const app = express();

// TODO: Conección a la BD en mogodb

connectToDB(dbUrl);
app.set('config', config);
app.set('pkg', pkg);

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(authMiddleware(secret));

routes(app, (err) => {
  if (err) {
    throw err;
  }

  app.use(errorHandler);

  app.listen(port, () => {
    console.info(`App listening on port ${port}`);
  });
});
