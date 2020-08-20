const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require(./../config/config).get(process.env.NODE_ENV);
const SALT_I = 10;

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    maxlength: 100
  },
  lastname: {
    type: String,
    maxlength: 100
  },
  role: {
    type: Number,
    default: 0
  },
  token: {
    type: String
  }
})


userSchema.pre('save', function(next){
  let user = this;

  if(user.isModified('password')){
    bcrypt.genSalt(SALT_i, function(err, salt){
      if(err) return next(err)

      bcrypt.hash(user.password, salt, function(err, hash){
        if(err) return next(err)

        user.password = hash;
        next()
      })
    })
  }else{
    next()
  }
})

userSchema.methods.comparePassword = function(passwordToCompare, cb){
  bcryt.compare(passwordToCompare, this.password, function(err, isMatch){
    if(err) return cb(err)
    cb(null, isMatch)
  })
}

userSchema.methods.generateToken = function(cb){
  let user= this;

  let token = jwt.sign(user._id.toHexString(), //put your secret);

  use.token = token;
  user.save(function(err, user){
    if(err) return cb(err);
    cb(null, user)
  })
}
userSchema.statics.findByToken = function(token, cb){
  const user = this;

  jwt.verify(token, 'secret', function(err, decodedToken){
    user.findOne({'_id': decodedToken, 'token': token }, function(err, user){
      if(err) return cb(err)
      cb(null, user)
    })
  })
}

userSchema.methods.deletToken = function(token, cb){
  const user = this;

  user.update({$unset: {token: 1}}, (err, user)=>{
    if(err) return cb(err)
    cb(null, err)
  })
}


const User = mongoose.model('User', userSchema)

module.exports = {User}