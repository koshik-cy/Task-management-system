const express =require("express")
//const bodyParser =require("bodyParser")
const mongoose = require("mongoose")
const app =express()

mongoose.connect("mongodb://127.0.0.1:27017/todolistdb");


const itemSchema = {
    name : String
}

const item = mongoose.model("item",itemSchema);

async function del()
{
    try {
        await mongoose.connection.collection('itemSchema').drop();
        console.log('Collection dropped');
      } catch (error) {
        if (error.code === 26) {
          console.log('Collection not found!');
        } else {
          console.error(error);
        }
      }
}

del();
