const express = require("express");
const { getProducts, calculateCartPrice } = require("../services/ai");
const router = express.Router();
const {
  changeNotificated,
  checkPremium,
  addList,
  getList,
  getListById,
  getUpdates,
  addFood,
  removeFood,
  removeAllItems,
  changeFoodAmount,
  replaceFoodArray,
} = require("../database/db");
const { ObjectId } = require("mongodb");

// -----    AI SECTION    ----- //
router.get("/getProductsAi", (req, res) => {
  const numberOfProducts = req.query.numberOfProducts;
  const desc = req.query.desc;

  getProducts(numberOfProducts, desc)
    .then((result) => {
      let jsonString = result.substring(
        result.indexOf("["),
        result.lastIndexOf("]") + 1
      );
      const products = JSON.parse(jsonString);
      console.log("As json:", products);
      //converting the products array to an array of objects
      const objArr = [];
      for (let i = 0; i < products.length; i++) {
        objArr.push({
          name: products[i].name,
          amount: 1,
          section: products[i].section,
          foodId: new ObjectId(),
        });
      }
      res.send(objArr);
    })
    .catch((err) => {
      console.log(err);
      res.send("Error in ai");
    });
});

router.post("/calculateCartPrice", (req, res) => {
  const { cart } = req.body;
  calculateCartPrice(cart)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send("could not calculate the price of the cart");
    });
});

router.post("/changenotificated", (req, res) => {
  const listId = req.query.listId;
  changeNotificated(listId)
    .then(() => {
      res.send("Success in changing notificated");
    })
    .catch((err) => {
      res.send("Error in changing notificated");
    });
});

router.post("/checkPremium", (req, res) => {
  const listId = req.query.listId;

  checkPremium(listId)
    .then(() => {
      res.send("Success in checking primium");
    })
    .catch((err) => {
      res.send("Error in checking primium");
    });
});

router.post("/addlist", (req, res) => {
  const listName = req.query.listName;
  const listPassword = req.query.listPassword;
  const listEmail = req.query.listEmail;
  const listPhone = req.query.listPhone;

  addList(listName, listPassword, listEmail, listPhone)
    .then(() => {
      res.send("Success in adding list");
    })
    .catch((err) => {
      res.send("Error in adding list");
    });
});

router.get("/getlist", (req, res) => {
  const listName = req.query.listName;
  const listPassword = req.query.listPassword;
  getList(listName, listPassword)
    .then((result) => {
      res.send(result);
      console.log(result);
    })
    .catch((err) => {
      res.send("No user found");
    });
});

router.get("/getlistbyid", (req, res) => {
  const _id = req.query._id;

  getListById(_id)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send("Could not check for a user !");
    });
});

router.get("/getupdates", (req, res) => {
  getUpdates().then((result) => {
    res.send(result.updates);
  });
});

router.post("/addfood", (req, res) => {
  console.log("adding food ");
  const _id = req.query._id;
  const foodName = req.query.foodName;
  const foodAmount = req.query.foodAmount;
  const foodSection = req.query.foodSection;

  addFood(_id, foodName, foodAmount, foodSection)
    .then((result) => {
      console.log(`added ${foodName} => ${foodAmount} for id: ${_id}`);

      console.log(result.value);
      res.send("successfuly added !");
    })
    .catch((err) => {
      console.log("Could not add !");
      res.send("Could not add !");
    });
});

router.post("/replaceFoodArray", (req, res) => {
  const { _id, arr } = req.body;
  for (let i = 0; i < arr.length; i++) {
    arr[i].foodId = new ObjectId();
  }
  replaceFoodArray(_id, arr);
});

router.post("/removefood", (req, res) => {
  const listId = req.query.listId;
  const foodId = req.query.foodId;

  removeFood(listId, foodId)
    .then((result) => {
      console.log(result);
      res.send("item deleted !");
    })
    .catch((err) => {
      console.error(err);
      res.send("Could not remove item !");
    });
});

router.post("/removeall", (req, res) => {
  const listId = req.query.listId;

  removeAllItems(listId)
    .then((result) => {
      console.log(result);
      res.send("All items deleted !");
    })
    .catch((err) => {
      console.error(err);
      res.send("Could not remove items !");
    });
});

router.post("/changefoodamount", (req, res) => {
  const listId = req.query.listId;
  const foodId = req.query.foodId;
  const amount = req.query.foodAmount;

  changeFoodAmount(listId, foodId, amount)
    .then((result) => {
      console.log(result);
      res.send("Amount changed successfuly");
    })
    .catch((err) => {
      console.error(err);
      res.send("Could not change the amount of the item !");
    });
});

module.exports = { listRouter: router };
