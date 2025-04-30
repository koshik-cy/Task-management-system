//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//mongoose.connect("mongodb://127.0.0.1:27017/todolistdb");
mongoose.connect("mongodb+srv://ravikanth9166:h9H8tToOXnslbXpZ@cluster0.spcs4b5.mongodb.net/todolistdb");

const itemSchema = {
  name: String,
};
const item = mongoose.model("item", itemSchema);

// const item1 = new item({
//   name: "Welcome to Todo List",
// });

// const item2 = new item({
//   name: "Hit + button to add new Item",
// });

// const item3 = new item({
//   name: "<--hit delete to delete an item>",
// });

//const defaultArray = [item1, item2, item3];
// item.insertMany(defaultArray);

// const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];
let x = [];

// x.push(item1); x.push(item2); x.push(item3);

async function main() {
  x = await item.find({});
  x.forEach((obj) => {
  // console.log(obj.name);
 });
 //console.log(x);
}

main();


app.get("/", function (req, res) {
  const day = date.getDate();
  //console.log("entered");
  //console.log(x);
  res.render("list", { listTitle: "Today", newListItems: x });
});

const listSchema = {
  name: String,
  items: [itemSchema],
};

const list = mongoose.model("list", listSchema);

app.get("/:customeRoute", async function (req, res) {
  const customeListName = _.capitalize(req.params.customeRoute);
  const found = await list.findOne({ name: customeListName });
  if (found) {
    res.render("list", {
      listTitle: customeListName,
      newListItems: found.items,
    });
  } else {
    let listt = new list({
      name: customeListName,
      items: [],
    });
    await listt.save();
    res.redirect("/" + customeListName);
  }
});

app.post("/", async function (req, res) {
  const listname = req.body.list;
  //console.log("listName is : ", listname);
  const itemt2 = new item({
    name: req.body.newItem,
  });
  if (listname === "Today") {
    // console.log("x---");
    x.push(itemt2);
    //console.log("x---");
    await itemt2.save();
    res.redirect("/");
  } else {
    //console.log("list---");
    let fnd = await list.findOne({ name: listname });
    if (fnd) {
      // console.log(fnd);
      // console.log("list---");
      await list.findByIdAndUpdate(fnd._id,{items:[...fnd.items,itemt2]});
    } else {
      let listt3 = new list({
        name: listname,
        items: [],
      });
      //console.log(listt3);
      listt3.items.push(itemt2);
      await listt3.save();
    }
    res.redirect("/" + listname);
  }
});

app.post("/delete", function (req, res) {
  const del = req.body.checkbox;
  const listName = req.body.listName;
  //console.log(req.body.checkbox);
  if (listName === "Today") {
    item
      .deleteOne({ _id: del })
      .then((result) => {
      //  console.log(result);
        x = x.filter((item) =>  (String(item._id) !==  del));
        // console.log(x);
        // console.log(new mongoose.Types.ObjectId(del))
        // console.log("exit");
        res.redirect("/");
      })
      .catch((error) => {
      //  console.error("Error deleting item:", error);
      });
  } else {
    list
      .findOneAndUpdate({ name: listName }, { $pull: { items: { _id: del } } })
      .then((result) => {
        x = x.filter((item) => String(item._id) !==  del);
        // console.log(x);
        // console.log("exit");
        res.redirect("/" + listName);
      })
      .catch((error) => {
        //console.error("Error deleting item from custom list:", error);
      });
  }
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(PORT, function () {
  console.log("Server started on port 3000");
});
