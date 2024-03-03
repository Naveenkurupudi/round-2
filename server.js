const express = require('express');
const cors=require('cors')
const bodyParser = require('body-parser');
const { createUsersTable, userApp } = require('./userApp');

const app = express();
app.use(bodyParser.json());
app.use(cors())

const PORT = 5000;

app.use(userApp);

app.listen(PORT, async () => {
  console.log(`Server is listening on port ${PORT}`);
});
