const express = require("express");

//create instance of express server and run it
const app = express();

app.get("/", (req, res) => {
	res.send({ hi: "there" });
});

const PORT = process.env.PORT || 5000;
//listen to http activity on port 5000
app.listen(PORT);
