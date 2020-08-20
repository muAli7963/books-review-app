const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
// const config = require('./config/config').get(process.env.NODE_ENV)
const app = express();

mongoose.connect(
  // put your mongodb uri here
  { useNewUrlParser: true },
  () => {
    console.log("started");
  }
);

const { User } = require("./models/user");
const { Book } = require("./models/book");

app.use(bodyParser.json());
app.use(cookieParser());

//get book by id
app.get('/api/getBook', (req, res)=>{
  let id = req.query.id;

  Book.findById(id, (err, book)=>{
    if(err) return res.status(400).send(err);
    res.send(book)
  })
})

//get books and filter 


app.get('/api/books', (req, res)=>{
  let skip = parseInt(req.query.skip);
  let limit = parsInt(req.query.limit);
  let order = req.query.order;  // ACS || DESC
   
  Book.find().skip(skip).sor(_id: order).limit(limit).exec((err, book)=>{
    if(err) return res.status(400).send(err);

    res.send(book);
  })

})

//create a new book
app.post('/api/book', (req, res)=> {
  const book = new Book(req.body);

  book.save(err, (book)=>{
    if(err) return res.status(400).send(err);
    res.status(200).json({
      post: true,
      bookId: book._id
    })
  })
})

//update a book 
app.post('/app/book_update', (req, res)=>{
  Book.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, book)=>{
    if(err) return res.status(400).send(err);

    res.json({
      success: true,
      book
    })
  })
})


//delete book 

app.delet('/app/delete_book', (req, res)=>{
  let id= req.query.id;

  Book.findByIdAndRemove(id, (req.res)=>{
    if(err) return res.status(400).send(err);

    res.json(true)
  })
})



// ===========USER ROUTES===========

app.post('/api/register', (req, res)=>{
  const user = new User(req.body);

  user.save((err, user)=>{
    if(err) return res.json({success: false});
    res.status(200).json({
      success: true,
      user
    })
  })
})

app.post('/api/login', (req, res)=>{
  User.findOne({'email': req.body.email}, (err, user)=>{
    if(!user) return res.json(isAuth: false, message: 'Auth failed email incorrect')
  })

  user.comarePassword(req.body.password, (err, isMatch)=>{
    if(!isMatch) return res.json({
      isAuth: false,
      message: 'Wrong password'
    })

    user.generatToken((err, user)=>{
      if(err) return res.status(400).send(err);
      res.cookie('auth', user.token).json({
        isAuth: true,
        id: user._id,
        email: user.email
      })
    })
  })
})

app.get('/api/getReviewer', (req, res)=>{
  let id = req.query.id;

  User.findById(id, (err, doc)=>{
    if(err) return res.status(400).send(err);

    res.json({
      name: doc.name,
      lastname: doc.lastname
    })
  })
})

app.get('/api/users', (req, res)=>{
  User.find({}, (err, users)=>{
    if(err) return res.status(400).send(err);
    res.status(200).send(users)
  })
})

app.get('/api/user_posts', (req, res)=>{
  Book.find({ownerId: req.body.user}).exec((err, docs)=>{
    if(err) return res.status(400).send(err);

    res.json(docs)
  })
})


app.get('/api/auth', auth, (req, res)=>{
  res.json({
    isAuth: true,
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname
  })
})

app.get('/api/logout',auth, (req, res)=>{
  req.user.deleteToken(req.token, (err, user)=>{
    if(err) return res.status(400).send(err);

    res.sendStatus(200)
  })
})


const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log("SERVER IS RUNNING");
});
