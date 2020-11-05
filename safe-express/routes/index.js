const { Console } = require('console');
const express = require('express');
const router = express.Router();
const Restaurant = require('../schemas/restaurant');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/coordi', function(req, res, next)  {
  
  const query = require('url').parse(req.url, true).query;

  let leti = Number(query.latitude);
  let long = Number(query.longitude);
  let wid = Number(query.latdelta);
  let hei = Number(query.longdelta);

  

  console.log("확인중: ",leti,"\n확인중: ",long,"\n확인중: ",wid,"\n확인중: ",hei)
  let sendcoordi;
  // Restaurant.find({$and:{"latitude":{"$gte":(leti-wid), "$lte":(leti+wid)}, "longitude":{"$gte":(long-hei), "$lte":(long+hei)}}}, (err, restaurant) => {
  //   console.log("레스토랑: ", restaurant);
  //   for(let i = 0; i< restaurant.length; ++i){
  //     console.log(i,". ", restaurant.latitude);
  //     console.log(i, ". ", restaurant.longitude);
  //   }
  // })

const rest= Restaurant.find().where("latitude").gte((leti-wid))
    console.log("레스토랑: ", rest);
    for(let i = 0; i< rest.length; ++i){
      console.log(i,". ", rest.latitude);
      console.log(i, ". ", rest.longitude);
  }
})

module.exports = router;
