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

  router.get("/list", (req,res) => {
    db.collection('saves').find().toArray(function(err, data) {
      if (err) {
        throw err;
      }
      res.render('saves', {saves: data});
    })
  });

  router.post('/', (req, res) => {
    db.collection('saves')
      .insertOne({
        name : req.body.table,
        id : req.session.user._id,
        username : req.session.user.username,
        date:new Date()},
        (err, result) => {
        if(err) throw err ;
        sockets.sendAll(req.session.user._id, 'saves', result.insertedId)
        res.redirect('/tables')
      })
  })

  router.get('/:id', (req, res) => {
    db.collection('saves').remove({_id : new ObjectId(req.params.id)}, (err, data) => {
      if (!err) {
            return res.redirect("/saves/list")
        } else {
            return res.send('Error deleting table!');
        }
    })
  });

})


module.exports = router;
