const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path'); 

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// define Schema Class
const Schema = mongoose.Schema;

// Create a Schema object
const itemSchema = new Schema({
    itemid: { type: Number, unique: true, required: true },
    itemName: { type: String, required: true },
    itemStartingPrice: { type: Number, required: true },
    itemDescription: { type: String, required: true },
    itemImg: { type: String },
    itemBidPrice: { type: Number },
    itemStartTime: { type: Date, required: true },
    itemEndTime: { type: Date, required: true },
    SellerName: { type: String, required: true },
    BuyerName: { type: String }
});

const Item = mongoose.model("Item", itemSchema);

mongoose.connect('mongodb://localhost:27017/3380itemdb')
    .then(() => {
        console.log('Connected to MongoDB');
        //Check and create dummy items
        Item.countDocuments({}).exec()
            .then(count => {
                if (count === 0) {
                    // No items found, insert data from data.json
                    const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
                    console.log('Items successfully inserted');
                    return Item.insertMany(data);
                } else {
                    console.log('Items already exist in the database, skipping insertion.');
                    return Promise.resolve(); // Return a resolved promise to continue
                }
            })
            .then(() => {
                // Start your Express server once connected to MongoDB
                app.listen(port, () => {
                    console.log(`Backend is running on port ${port}`);
                });
            })
            .catch(err => {
                console.error('Error:', err);
                mongoose.disconnect();
            });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

const router = express.Router();

app.use('/api', router);

//get all item
router.route("/getitems")
    .get((req, res) => {
        Item.find()
            .then((items) => res.json(items))
            .catch((err) => res.status(400).json("Error: " + err));
    });

//get item by itemid
router.route("/getitem/:itemid")
    .get((req, res) => {
        Item.findOne({ itemid: req.params.itemid })
            .then((item) => res.json(item))
            .catch((err) => res.status(400).json("Error: " + err));
    });

//get item image by itemid
router.route("/image/:itemid")
.get((req, res) => {
    Item.findOne({ itemid: req.params.itemid })
    .then((item) => 
    {
        const imgPath = path.join(__dirname, 'public/images', item.itemImg)
        res.sendFile(imgPath, (err) => {
            if (err) {
                res.status(404).send('Image not found');
            }
        });
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

//post new item
router.route("/additem")
    .post((req, res) => {
        const itemid = req.body.itemid;
        const itemName = req.body.itemName;
        const itemStartingPrice = req.body.itemStartingPrice;
        const itemDescription = req.body.itemDescription;
        const itemImg = req.body.itemImg;
        const itemBidPrice = req.body.itemStartingPrice;
        const itemStartTime = req.body.itemStartTime;
        const itemEndTime = req.body.itemEndTime;
        const SellerName = req.body.SellerName;
        const BuyerName = req.body.BuyerName;

        const newItem = new Item({
            itemid,
            itemName,
            itemStartingPrice,
            itemDescription,
            itemImg,
            itemBidPrice,
            itemStartTime,
            itemEndTime,
            SellerName,
            BuyerName
        });

        newItem
            .save()
            .then(() => res.json("Item added!"))
            .catch((err) => res.status(400).json("Error: " + err));
    });

//update item details by itemid
router.route("/updateitem/:itemid")
    .put((req, res) => {
        Item.findOne({ itemid: req.params.itemid })
            .then((item) => {
                item.itemid = req.body.itemid;
                item.itemName = req.body.itemName;
                item.itemStartingPrice = req.body.itemStartingPrice;
                item.itemDescription = req.body.itemDescription;
                item.itemImg = req.body.itemImg;
                item.itemBidPrice = req.body.itemBidPrice;
                item.itemStartTime = req.body.itemStartTime;
                item.itemEndTime = req.body.itemEndTime;
                item.SellerName = req.body.SellerName;
                item.BuyerName = req.body.BuyerName;
                item
                    .save()
                    .then(() => res.json("Item updated!"))
                    .catch((err) => res.status(400).json("Error: " + err));
            })
            .catch((err) => res.status(400).json("Error: " + err));
    });

//Update bid
router.route("/updatebid/:itemid")
    .put((req, res) => {
        Item.findOne({ itemid: req.params.itemid })
            .then((item) => {
                item.itemBidPrice = req.body.itemBidPrice;
                item.BuyerName = req.body.BuyerName;
                item
                    .save()
                    .then(() => res.json("Bid updated!"))
                    .catch((err) => res.status(400).json("Error: " + err));
            })
            .catch((err) => res.status(400).json("Error: " + err));
    });

//Delete item by itemid
router.route("/item/:itemid")
    .delete((req, res) => {
        Item.findOneAndDelete({ itemid: req.params.itemid })
            .then(() => res.json("Item deleted."))
            .catch((err) => res.status(400).json("Error: " + err));
    });

