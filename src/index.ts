

import express from 'express';

const port = 3000;
const app = express();

console.log("starting server...");


app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(port, () => {
    console.log("running on port " + port);
});
