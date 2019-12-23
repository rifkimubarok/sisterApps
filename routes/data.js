var express = require('express');
var router = express.Router();
var service = require("../service/peopleService")
var fetch = require("node-fetch")

/* GET home page. */
router.get('/', function(req, res, next) {
  service.findAll()
  .then(data => {
      res.send(data).json().status(200)
  })
});

router.post('/insert',function(req,res,next){
    let people = {
      nama : req.body.nama,
      tempat_lahir : req.body.tempat_lahir,
      tgl_lahir : req.body.tgl_lahir
    }

    service.create(people,function(result){
      res.send(result).json().status(200)
    })
})

router.get("/:limit/:page",function(req,res,next) {
  service.count()
  .then(function(count) {
    let limit = parseInt(req.params.limit)
    let page = parseInt(req.params.page)
    let offset = parseInt(((page - 1) * limit))
    service.getLimit(offset,limit,function(result) {
      res.send({data:result,count:count.count,server:"192.168.43.43"}).status(200)
    })
  })
})

router.get("/:userid",function(req,res,next){
  let key = req.params.userid
  service.findByKey(key)
  .then((result)=>{
    res.send(result).status(200).json()
  })
})

router.post("/update",function(req,res,next){
  let people = {
    nama : req.body.nama,
    tempat_lahir : req.body.tempat_lahir,
    tgl_lahir : req.body.tgl_lahir,
    _key : req.body.key
  }
  // let result = {"hi":"tayo"}
  service.update(people,function(result){
    res.send(result).status(200).json()
  })
})

router.post("/delete/:key",function(req,res,next){
  let key = req.params.key;
  service.delete(key)
  .then(function(result){
    res.send(result).status(200)
  })
})

router.post("/generate/:number",function(req,res,next){
  let number = req.params.number
  for(let i = 0; i < parseInt(number); i++){
    fetch("https://randomuser.me/api/?format=json")
    .then(result=>result.json())
    .then(data=>{
      // res.send(data);
      service.create(data.results[0],function(params) {
      })
    })
  }
  res.send(["ok"]).status(200) 

})

module.exports = router;
