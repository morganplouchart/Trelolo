const express = require('express'),
  router = express.Router(),
  mongo = require('mongodb').MongoClient,
  url = 'mongodb://localhost:27017/trelolo';

mongo.connect(url, (err, client) => {
  if (err) {
    console.error(err);
    return
  }
  const db = client.db('trelolo') ;

  router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });
  router.post('/login', (req, res, next) => {
    db.collection('users').findOne({
      $and:[
        {password : req.body.password},
        {$or:[
          {email : req.body.login},
          {username : req.body.login}
        ]}]}, (err, resp) => {
      if (err) throw err ;
      if(resp && resp._id) {

        req.session.user = resp ;
        console.log(req.session.user)
        res.cookie('loggedIn', req.session.user.username) ;
        res.send('OK') ;
      } else {
        req.session.destroy() ;
        res.cookie('loggedIn', '') ;
        res.send('NOK') ;
      }
    })
  });
  router.post('/create', (req, res, next) => {
    db.collection('users').insertOne(req.body, (err, resp) => {
      if(resp.insertedId) {
        req.session.user = req.body ;
        res.cookie('loggedIn', req.session.user.username) ;
        res.send('OK') ;
      } else {
        req.session.destroy();
        res.cookie('loggedIn', '') ;
        res.send('NOK');
      }
    })
  });
  router.delete('/logout', (req, res, next) => {
      req.session.destroy();
      res.cookie('loggedIn', '') ;
      res.send('OK');
  });
})

module.exports = router;
