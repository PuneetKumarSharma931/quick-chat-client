
const express = require('express');
const path = require('path');
const port = process.env.PORT || 8000;

const app = express();

app.use('/static', express.static('static'));

app.get('/', (req, res)=>{

    res.status(200).sendFile(path.join(__dirname, '/index.html'));
});

app.listen(port, ()=>{

    console.log(`Website is running at port: ${port}`);
});

