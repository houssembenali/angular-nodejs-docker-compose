const express = require('express');
const app = express(),
      bodyParser = require("body-parser");
      port = 3080;

const users = ["HOOS"];

app.use(bodyParser.json());
app.use(express.static(process.cwd()+"/my-app/dist/angular-nodejs-docker-compose/"));

app.get('/api/users', (req, res) => {
  console.log('dfsdfsd')
  res.json("ZABOORA");
});

app.post('/api/user', (req, res) => {
  const user = req.body.user;
  users.push(user);
  res.json("YAZEBI post");
});

app.get('/', (req,res) => {
  res.sendFile(process.cwd()+"/app-ui/dist/angular-nodejs-docker-compose/index.html")
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});
