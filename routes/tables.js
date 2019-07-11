const express = require('express'),
  router = express.Router(),
  mongo = require('mongodb').MongoClient,
  ObjectId = require('mongodb').ObjectId,
  url = 'mongodb://localhost:27017/trelolo',
  sockets = require('../lib/sockets')
;

mongo.connect(url, (err, client) => {
  if (err) {
    console.error(err);
    return
  }
  const db = client.db('trelolo');


  router.get("/", (req,res) => {
    db.collection('tables').find().sort({ date: -1 }).toArray(function(err, data) {
      if (err) {
        throw err;
      }
      res.render('tables', {tables: data});
    })
  });

  router.get('/:id', (req, res) => {
    db.collection('tables')
      .findOne({id : {$ne : req.session.user._id}, _id : new ObjectId(req.params.id)}, (err, table) => {
        res.render('tables', {tables : [table]}, (err, html) => {
          res.json({response : html})
        })
    })
  });

  router.post('/', (req, res) => {
    db.collection('tables')
      .insertOne({
        name : req.body.table,
        id : req.session.user._id,
        username : req.session.user.username,
        date:new Date()}, (err, result) => {
        if(err) throw err ;
        sockets.sendAll(req.session.user._id, 'table', result.insertedId)
        res.send('ADDED')
      })
  })

})


module.exports = router;
