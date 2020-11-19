const { Console } = require('console');
const express = require('express');
const mongoose =require('mongoose')
const router = express.Router();
require('../schemas/restaurant');
var Restaurant= require('mongoose').model('restaurant');
require('mongoose-double')(mongoose);
const Double = mongoose.Schema.Types.Double;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/coordi', function(req, res, next)  {
  
  const query = require('url').parse(req.url, true).query;

  let leti = parseFloat(query.latitude);
  let long = parseFloat(query.longitude);
  let wid = parseFloat(query.latdelta);
  let hei = parseFloat(query.longdelta);

  

  console.log("확인중: ",leti,"\n확인중: ",long,"\n확인중: ",wid,"\n확인중: ",hei)
  let sendcoordi;
  Restaurant.find({"latitude":{"$gte":(leti-wid), "$lte":(leti+wid)}, "longitude":{"$gte":(long-hei), "$lte":(long+hei)}}, (err, restaurant) => {
    // console.log("레스토랑: ", restaurant);
    // for(let i = 0; i< restaurant.length; ++i){
    //   console.log(i,". ", restaurant.latitude);
    //   console.log(i, ". ", restaurant.longitude);
    // }
    // console.log("레스토랑: ", restaurant);
    res.send(restaurant);
  })

  // console.log("왜????");

  // Restaurant.findOne({"latitude": parseFloat(query.latitude), "longitude":parseFloat(query.longitude)}), (err ,rest) =>{
  //   console.log("들어는 감");
  //   if(rest) console.log(rest);
  //   else console.log("ㅋ");
  // }
//   let restaurant = new Restaurant({
//     restaurantid: 11,
//     restaurantname: "test",
//     latitude: leti,
//     longitude: long,
//     kraddr: "당정동",
//     enaddr: "dangjeong",
//     resGubun: "학교",
//     resGubunDetail: "대학교",
//     resTEL: "031-2205-0236",
//     isSaferes: 1,
// })
// try{
//     restaurant.save();
//     console.log('저장 : ', restaurant);
//     res.redirect('/');
// } catch (e) {
//     console.log(e);
// }   

// let test ="test";
//   Restaurant.findOne({"restaurantname": test}, (err ,rest) =>{
//     if(err){
//       console.log("err");
//     }
//     if(rest){
//       console.log("레스토랑: ", rest);
//       res.send(rest);
//       for(let i = 0; i< rest.length; ++i){
//         console.log(i,". ", rest.latitude);
//         console.log(i, ". ", rest.longitude);
//         }
//       }
//       console.log("끝");
//       res.send("결과없음");
//     })
//     console.log("놉");
//     res.send("ㅋ");
})

module.exports = router;
