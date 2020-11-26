const express = require('express');
const mongoose =require('mongoose')
const router = express.Router();
require('../schemas/user');
var Users= require('mongoose').model('user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/account', function(req, res, next) {
  console.log("들어옴 확인aa", req.body._email);
  Users.findOne({"email": req.body._email}, (err, user) => {
    console.log("user: ", user);
    if(user){
      console.log("user 존재");
      res.send("1");  
    }
    else{
      console.log("user 없음");
      res.send("0");
    }
  });
});

router.post('/tokenupdate', function(req, res, next) {
  Users.findOne({"email": req.body._email}, (err, user) => {
    console.log("user: ", user);
    if(user){
      console.log("tokenupdate user 존재");
      user.update({token:req.body._token}, ()=> res.send("1"));
      
    }
    else{
      console.log("tokenupdate user 없음");
      res.send("0");
    }
  });
});

router.post('/signup', function(req, res, next) {
  console.log("계정 생성 진행중");
  let user = new Users({
    token:req.body._token,
    name:req.body._name,
    email:req.body._email,
    age_range:req.body._age_range,
    nickname:req.body._nickname,
  })
  try{
    user.save();
    console.log('저장 : ', user);
    res.send("1")
  } catch (e) {
    console.log(e);
    res.send("0")
  }
});

module.exports = router;
