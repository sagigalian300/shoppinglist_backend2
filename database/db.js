const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require("dotenv").config();

const uri = process.env.MONGODB_KEY;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });  
const collection = client.db("shopping-list").collection("lists");

const changeNotificated = async (listId) => {
    const response = await collection.updateOne({_id: new ObjectId(listId)}, { $set: { notificated: true } });
    return response;
}

const checkPremium = async (listId) => {
    const response = await collection.findOne({_id: new ObjectId(listId)})
    return response;
}

const addList = async (listName, listPassword, listEmail, listPhone) => {
    const response = await collection.insertOne({
        listName: listName,
        listPassword: listPassword,
        listEmail: listEmail,
        listPhone: listPhone,
        notificated: false,
        date: new Date(),
        premium: false,
        food: Array()
    })
    return response;
}

const getList = async (listName, listPassword) => {
    const response = await collection.findOne({
        listName: listName ,
        listPassword: listPassword
    })
    return response;
}

const getListById = async (_id) => {
    const response = await collection.findOne({
        _id: ObjectId(_id)
    })
    return response;
}

const getUpdates = async () => {
    const response = await collection.findOne({
        type: 'manager'
    })
    return response;
}

const addFood = async (_id, foodName, foodAmount, foodSection) => {
    const response = await collection.updateOne({_id: ObjectId(_id)}, {
        $push:{
            food:{
                $each:[{
                    name: foodName,
                    amount: foodAmount,
                    section: foodSection,
                    foodId: new ObjectId()
                }],
                $position:0
            }
        }
    })
    return response;
}

const replaceFoodArray = async (_id, newArr) => {
    console.log(newArr)
    const response = await collection.updateOne({_id: ObjectId(_id)}, {
        $set: {food: newArr}
    })
    console.log(response);
    return response
}

const removeFood = async (listId, foodId) => {
    const response = await collection.updateOne({_id: ObjectId(listId)}, {
        $pull: { 'food': { foodId: ObjectId(foodId) } }
    })
    return response;
}

const removeAllItems = async (listId) => {
    const response = await collection.updateOne({_id: ObjectId(listId)}, {
        $set: { 'food': Array() }
    })
    return response;
}

const changeFoodAmount = async (listId, foodId, amount) => {
    const response = await collection.updateOne({_id: ObjectId(listId)}, {
        $set: { 
            'food.$[elem].amount': Number(amount)
        }},
        { arrayFilters: [ { "elem.foodId": ObjectId(foodId) } ] })
    return response;
}

module.exports = {
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
    replaceFoodArray
};