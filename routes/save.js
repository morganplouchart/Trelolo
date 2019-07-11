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

  router.post('/', (req, res) => {
    db.collection('save')
      .insertOne({
        name : req.body.table,
        id : req.session.user._id,
        username : req.session.user.username,
        date:new Date(),
        content: req.body.content},
        (err, result) => {
        if(err) throw err ;
        sockets.sendAll(req.session.user._id, 'save', result.insertedId)
        res.redirect('/tables')
      })
  })

})


module.exports = router;
