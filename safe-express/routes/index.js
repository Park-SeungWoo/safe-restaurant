const { Console } = require('console');
const { ENETUNREACH } = require('constants');
const express = require('express');
const mongoose =require('mongoose');
const { findOne } = require('../schemas/user');
const router = express.Router();
require('../schemas/restaurant');
var Restaurant= require('mongoose').model('restaurant');
require('../schemas/comment');
var Comment= require('mongoose').model('Comment');
require('../schemas/user');
var Users= require('mongoose').model('user');

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
  let senddata = [
    [],
  ];
  Restaurant.find({"latitude":{"$gte":(leti-wid), "$lte":(leti+wid)}, "longitude":{"$gte":(long-hei), "$lte":(long+hei)}}, (err, restaurant) => {
    // console.log("레스토랑: ", restaurant);
    // for(let i = 0; i< restaurant.length; ++i){
    //   console.log(i,". ", restaurant.latitude);
    //   console.log(i, ". ", restaurant.longitude);
    // }
    // console.log("레스토랑: ", restaurant);


    res.send(restaurant);
    // console.log(restaurant);
    // console.log(restaurant[0].restaurantname)

    // restaurant.forEach(rest => {
    //   console.log(rest.kraddr);
    // })
//     console.log("샌드데이타길이: ",senddata.length);
//     let a = [];
//     let arr = [];
//     console.log("데이타ㅏ아ㅏ: ", restaurant[0]);

// // 중복 처리 코드, 메모리 부족으로 연산이 안됨
//     for(let cnt =0; cnt<restaurant.length; ++cnt){
//         if(senddata.length == 0){
//           console.log("senddata가 비어있음");
//           senddata.push(restaurant[cnt]);
//           console.log(senddata[0].kraddr);
//         }else{
//         for(let i = 0; i < senddata.length; i ++){
//           if(restaurant[cnt].kraddr == senddata[i].kraddr){
//             console.
//             arr = senddata[i] + restaurant[cnt];
//             senddata[i] = arr;
//           }
//           senddata.push(restaurant[cnt]);
//         }
//       }
//     }
//     //console.log("샌드데이타: ",senddata);
//     //console.log("옛데이타", restaurant);
//     res.send(senddata)
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


router.get('/searchaddr', function(req, res, next)  {
  const query = require('url').parse(req.url, true).query;
  console.log("들어온거: ", query);
  let keyword = query.kaddrkeyword;
  console.log("키워드 확인중: ",keyword);
  Restaurant.find({"kraddr":{"$regex":keyword}}, (err, restaurant) => {
    console.log(restaurant)
    res.send(restaurant);
  })
})


router.post('/wreview', function(req, res, next)  {
  const reviewwrite = new Comment({
    restaurantid: req.body.rest_id,
    nickname: req.body.nickname,
    rating: req.body.rating,
    comment: req.body.comment,
    reviewId: req.body.reviewId
  });
  try{
    reviewwrite.save();

    console.log('저장 : ', reviewwrite);
    res.send("1");
  } catch (e) {
    console.log(e);
    res.send("0");
  }  

})

router.post('/rreview', function(req, res, next)  {
  Comment.find({"restaurantid":req.body.rest_id}, (err, restaurantreview) => {
    console.log("leng: ", restaurantreview.length)
      if(restaurantreview.length){
      Comment.find({"nickname": req.body.nickname, "restaurantid":req.body.rest_id}, (err, rest) => {
        console.log("d: ",rest);
        if(!rest.length){
          const reviewfirst = [{reviewId: '0'}];
          let result = reviewfirst.concat(restaurantreview);
          console.log('id: ', result);
          res.send(result);
        } else {
          res.send(restaurantreview);    
        }
      })
    }else{
      const reviewfirst = [{reviewId: '0'}];
      console.log("s: ", reviewfirst);
      res.send(reviewfirst);
    }
  }).sort({createdAt: 'desc'});
})

module.exports = router;
