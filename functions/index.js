const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const https = require("https");
const fetch = require("node-fetch");

admin.initializeApp();
const app = express();
var token =
  "gAAAAEvhErgz_sZCTSNBXWO3VCSNCylwdw_S7prdMpJundK02SZKFNGm4ju1tpcumdykbFKQ0FCcsGxsdRyI3LQ2emGDobNV3h4jbh315VcLh2NAf5F6vWdGBLM-udDAA3nRhof7-f2Yt4-w-Dn_Gj8T0SJfaLL5erhegsxuKJfx29N59AAAAIAAAACBJBspm4XDWBzO_viWT14rFZd0Uv6mzW6EoFRAlp-k8WTWRe4oKKafkqVnmGd3gPLh7qpRW6N54bXMypNgoVQCHliFbFpUyNiSSr9Ic9Aht2uLEjP0F_v-sE8Et11av6PELzXrV_U4v-iK-Q33d6B4V8CwBmbR8ewcQuqHwaNrI0IizSB9wcvohmjtKktW8rXvTq2g01WD_ObFtp4-tN0o7suFUR7g2h7t1HoVhA_GLJN9L9UOUK1ZDsvKPb3bBHKWHNdy8G84apNc4j0nRJMTiK0WlGhKcz5uVX0dsp4QoDO-qxl2gzZoCbZ3uxhTGPQ";

app.use(cors({ origin: true }));

app.get("/api/genCart", (request, response) => {
  var identifier = request.query["id"];
  var cartnum = "cart" + identifier;
  ref.child(cartnum).set({
    id: identifier,
    totalprice: "0.0",
    items: {
      name: "",
      price: "0.0"
    }
  });
  response.send("cart made");
});

app.get("/api/addToCart", (request, response) => {
  var updated;
  var id = request.query["id"];
  var price = parseFloat(request.query["price"]);
  var item = request.query["name"];
  var cartnum = "cart" + id;
  var itemref = ref.child(cartnum);
  var price = request.query["price"];
  var newPrice;
  var newName;
  var newTotal;
  itemref.on("value", function(snapshot) {
    newName = snapshot.val()["items"]["name"] + "," + item;
    newPrice = snapshot.val()["items"]["price"] + "," + price;
    newTotal = parseFloat(snapshot.val()["totalprice"]) + parseFloat(price);
  });
  update(newName, newPrice, cartnum, newTotal);
  response.send("item added");
});

function update(name, price, cartnum, totalprice) {
  var itemref = ref.child(cartnum);
  itemref.update({
    totalprice: totalprice,
    items: {
      name: name,
      price: price
    }
  });
}

app.get("/api/checkout", (request, response) => {
  var id = request.query["id"];
  let cartnum = "cart" + id;
  ref.update({
    [cartnum]: {
      totalprice: "0",
      items: {
        name: "",
        price: "0.0"
      }
    }
  });
  response.send("checked out!");
});

var db = admin.database();
var ref = db.ref("shop");

app.get("/api/findCart", (request, response) => {
  var uwu;
  var id = request.query["id"];
  ref
    .orderByChild("id")
    .equalTo(id)
    .on("value", function(snapshot) {
      uwu = snapshot.val();
    });
  response.send(uwu);
});

app.get("/api/findAllCarts", (request, response) => {
  var uwu = "";
  var final;
  ref.on("value", function(snapshot) {
    uwu = JSON.stringify(snapshot.val(), null, 3);
    uwu = JSON.parse(uwu);
  });
  // uwu = uwu.substring(1, uwu.length);
  // uwu = uwu.substring(0, uwu.length - 1);
  // uwu = '{"uwu":[' + uwu + "]}";
  response.send(uwu);
});

exports.app = functions.https.onRequest(app);

// var usersRef = ref.child("/4782441449");

//creating

// usersRef.set({
//   "4782441449": {
//     code: "123456"
//   }
// });

//updating

// usersRef.update({
//   "4782441449/code": "121212"
// });

//generates new key

// usersRef.push({
//   "1234567890": {
//     code: "123124"
//   }
// });

//read db value

// usersRef.on(
//   "value",
//   function(snapshot) {
//     console.log(snapshot.val());
//   },
//   function(errorObject) {
//     console.log("The read failed: " + errorObject.code);
//   }
// );
