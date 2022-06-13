const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')
const bodyParser = require('body-parser')
const fs = require('fs')
const product = require('../model/product.js');
const user = require("../model/user.js");


const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// DB Config

// mongodb+srv://user:user@cluster0.8lypi.mongodb.net/?retryWrites=true&w=majority

const db = require("../config/keys.cjs").mongoURI;
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => { 
    console.log('MongoDB Connected');
}
).catch((err) => {
    console.log(err);
}
);
// file upload api
const dir = './uploads/';
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
              }
            cb(null, dir);
        }
        , filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    }),
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg'
        ) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only images are allowed'));
        }
    }
}
);

app.use(express.static('uploads'));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use("/", (req, res, next) => {
    try {
      if (req.path == "/login" || req.path == "/register" || req.path == "/") {
        next();
      } else {
        /* decode jwt token if authorized*/
        jwt.verify(req.headers.token, 'shhhhh11111', function (err, decoded) {
          if (decoded && decoded.user) {
            req.user = decoded;
            next();
          } else {
            return res.status(401).json({
              errorMessage: 'User unauthorized!',
              status: false
            });
          }
        })
      }
    } catch (e) {
      res.status(400).json({
        errorMessage: 'Something went wrong!',
        status: false
      });
    }
  })

  app.get("/", (req, res) => {
    res.status(200).json({
      status: true,
      title: 'Apis'
    });
  });

//   login api
app.post("/login", (req, res) => {
    try {
        if (req.body && req.body.email && req.body.password) {
            user.find({ email: req.body.email }, (err, data) => {
           if(data.length > 0){
                if(bcrypt.compareSync(data[0].password, req.body.password)){
                    checkUserAndGeneratedToken(data[0],req, res);
                }
                else{
                    res.status(400).json({
                        errorMessage: 'Invalid email or password!',
                        status: false
                    });
                }
              }
                else{
                    res.status(400).json({
                        errorMessage: 'Invalid email or password!',
                        status: false
                    });
                }
            });
        }
        else{
            res.status(400).json({
                errorMessage: 'Add proper parameter first!',
                status: false
            });
        }     
    } catch (error) {
        res.status(400).json({
            errorMessage: 'Something went wrong!',
            status: false
        });
    }
        
    }
);

// register api
app.post("/register", (req, res) => {
    try {
        if (req.body && req.body.name && req.body.email && req.body.password) {
            user.find({ email: req.body.email }, (err, data) => {
                if(data.length == 0){
                    const User = new user({
                        name: req.body.name,
                        email: req.body.email,
                        password: bcrypt.hashSync(req.body.password, 10)
                    });
                    User.save((err, data) => {
                        if (err) {
                            res.status(400).json({
                                errorMessage: 'Something went wrong!' + err,
                                status: false
                            });
                        } else {
                            res.status(200).json({
                                message: 'User registered successfully!',
                                status: true
                            });
                        }
                    });
                }
                else{
                    res.status(400).json({
                        errorMessage: `User ${req.body.email} already exists!`,
                        status: false
                    });
                }
            });
        }
        else{
            res.status(400).json({
                errorMessage: 'Add proper parameter first!',
                status: false
            });
        }
    } catch (error) {
        res.status(400).json({
            errorMessage: 'Something went wrong!',
            status: false
        });
    }
});

function checkUserAndGeneratedToken(data, req, res){
    jwt.sign({ user: data.email, id: data._id }, 'shhhhh11111', { expiresIn: '1h' }, (err, token) => {
        if (err) {
            res.status(400).json({
                errorMessage: `Something went wrong! ${err}`,
                status: false
            });
        } else {
            res.status(200).json({
                message: 'User logged in successfully!',
                token: token,
                status: true
            });
        }
    });
}

// Api to add product
app.post("/add-product", (req, res) => {
    try {
        if (req.files && req.body && req.body.name && req.body.price && req.body.description && req.body.discount) {
            const product = new product({
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                discount: req.body.discount,
                image: req.files.image.name
            });
            product.save((err, data) => {
                if (err) {
                    res.status(400).json({
                        errorMessage: `Something went wrong! ${err}`,
                        status: false
                    });
                } else {
                    res.status(200).json({
                        message: 'Product added successfully!',
                        status: true
                    });
                }
            });
        }
        else{   
            res.status(400).json({
                errorMessage: 'Add proper parameter first!',
                status: false
            });
        }
    } catch (error) {
        res.status(400).json({
            errorMessage: 'Something went wrong!',
            status: false
        });
    }
});

// Api to update product
app.post("/update-product", (req, res) => {
    try {
        if (req.files && req.body && req.body.id && req.body.name && req.body.price && req.body.description && req.body.discount) {
            product.findById(req.body.id, (err, product) => {
                // if file is already exists then delete it
                if (req.files && req.files[0] && req.files[0].filename && product.image) {
                    const filePath = `./uploads/${product.image}`;
                    fs.unlinkSync(filePath);
                }
                
                if(req.files && req.files[0] && req.files[0].filename){
                    product.image = req.files[0].filename;
                }
                if(req.body.name){
                    product.name = req.body.name;
                }
                if(req.body.price){
                    product.price = req.body.price;
                }
                if(req.body.description){
                    product.description = req.body.description;
                }
                if(req.body.discount){
                    product.discount = req.body.discount;
                }
                product.save((err, data) => {
                    if (err) {
                        res.status(400).json({
                            errorMessage: `Something went wrong! ${err}`,
                            status: false
                        });
                    } else {
                        res.status(200).json({
                            message: 'Product updated successfully!',
                            status: true
                        });
                    }
                });
            });
        }
        else{
            res.status(400).json({
                errorMessage: 'Add proper parameter first!',
                status: false
            });
        }
    } catch (error) {
        res.status(400).json({
            errorMessage: 'Something went wrong!',
            status: false
        });
    }
}
);
    
// Api to delete product
app.post("/delete-product", (req, res) => { 
    try {
        if (req.body && req.body.id) {
            product.findByIdAndUpdate(req.body.id, { is_deleted : true }, { new: true }, (err, data) => {
                if (data.is_deleted) {
                    res.status(200).json({
                        message: 'Product deleted successfully!',
                        status: true
                    });
                }
                else{
                    res.status(400).json({
                        errorMessage: `Something went wrong! ${err}`,
                        status: false
                    });
                }
            });
        }
        else{
            res.status(400).json({
                errorMessage: 'Add proper parameter first!',
                status: false
            });
        }
    } catch (error) {
        res.status(400).json({
            errorMessage: 'Something went wrong!',
            status: false
        });
    }
}
);

/*Api to get and search product with pagination and search by name*/
app.post("/get-products", (req, res) => {
    try {
        var query = {};
        query["$and"] = [];
        query["$and"].push({
             is_deleted: false ,
             user_id: req.user.id
        
        });
        if (req.query && req.query.search) {
            query["$and"].push({
                name: { $regex: req.query.search }
            });
        }

        var perPage = 5;
        var page = req.query.page || 1;
        product.find(query , {date:1, name : 1,id : 1, price : 1, description : 1, discount : 1, image : 1})
        .skip((perPage * page) - perPage).limit(perPage)
        .then(data => {
            product.find(query).count()    // count() is a mongoose method to get the number of documents in a collection
            .then((count) => {

                if(data && data.length > 0){
                    res.status(200).json({
                        message: 'Products fetched successfully!',
                        products: data,
                        total: count,
                        current_page: page,
                        pages: Math.ceil(count / perPage),
                        status: true
                    });
                }
                else{
                    res.status(400).json({
                        errorMessage: 'No products found!',
                        status: false
                    });
                }
            });
        }).catch(err => {
            res.status(400).json({
                errorMessage: err.message || "Something went wrong!",
                status: false
            });
        }
        );
    } catch (error) {
        res.status(400).json({
            errorMessage: 'Something went wrong!',
            status: false
        });
    }
}
);

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });