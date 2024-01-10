require('dotenv').config();
var express = require("express"),
  path = require("path"),
  bodyParser = require("body-parser"),
  cons = require("consolidate"),
  app = express();
const { Pool } = require("pg");
//DB connect string
const pool = new Pool({
  connectionString: process.env.CONNECTOR_POSTGRES,
});

//Assign Dust Engine to .dust files
app.engine("dust", cons.dust);

//set default
app.set("view engine", "dust");

app.set("views", __dirname + "/views");

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  pool.connect((err, client, done) => {
    if (err) {
      return console.error("error fetching client from pool", err);
    }
    client.query("SELECT * FROM recipes", (err, result) => {
      if (err) {
        return console.error("error running query", err);
      }
      res.render("index", { recipes: result.rows });
      done(); // release client back to the pool
    });
  });
});

app.post("/add", function (req, res) {
  pool.connect((err, client, done) => {
    if (err) {
      return console.error("error fetching client from pool", err);
    }
    client.query(
      "INSERT INTO recipes(name,ingredients, directions) VALUES($1,$2,$3)",
      [req.body.name, req.body.ingredients, req.body.directions]
    );
    done();
    res.redirect("/");
  });
});

app.post("/edit", function (req, res) {
  pool.connect((err, client, done) => {
    if (err) {
      return console.error("error fetching client from pool", err);
    }
    client.query(
      "UPDATE recipes SET name=$1, ingredients=$2, directions=$3 WHERE id=$4",
      [req.body.name, req.body.ingredients, req.body.directions, req.body.id]
    );
    done();
    res.redirect("/");
  });
});

app.delete("/delete/:id", function (req, res) {
  pool.connect((err, client, done) => {
    if (err) {
      return console.error("error fetching client from pool", err);
    }
    client.query("DELETE FROM recipes WHERE id=$1", [req.params.id]);
    done();
    res.send("200");
  });
});

app.listen(3000, function () {
  console.log("server started on port 3000");
});
