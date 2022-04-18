
const express = require('express');
const app = express();

app.use(express.json())


const port = process.env.Port || 4000;

app.listen(port,()=>
console.log(`app listening on port ${port}`)
)