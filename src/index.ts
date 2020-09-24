

import express from 'express';
import { publicApi } from "./api/index";

const port = 3000;
const app = express();

console.log("starting server...");

app.use("/", publicApi);

app.listen(port, () => {
    console.log("running on port " + port);
});
