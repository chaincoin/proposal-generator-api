var express = require('express');
const chaincoin = require('./api');

var router = express.Router();

router.get('/', function(req, res) {
    res.send({
      methods: {
        "/count": "return masternode count",
        "/validate/:address": 'return true if address is valid',
        "/confirmations/:txid": 'return the number of confirmations to specific txid'
      }
    });
});

router.get('/count', function(req, res) {
  chaincoin.count
    .then(function(result, error){
      res.status(200).send(result);
    })
    .catch(function(error) {
      res.status(500).send(error);
    });
});

router.get('/validate/:address', function(req, res) {
  chaincoin.validateaddress(req.params.address)
    .then(function(result, error){
      res.status(200).json({result: result.isvalid});
    })
    .catch(function(error) {
      res.status(500).send(error);
    });
});

router.get('/confirmations/:txid', function(req, res) {
  chaincoin.confirmations(req.params.txid)
    .then(function(result, error){
      res.status(200).json({confirmations: result.confirmations});
    })
    .catch(function(error) {
      res.status(500).send(error);
    });
});

router.get('/payments-date/', function(req, res) {
  chaincoin.governanceinfo('funding')
    .then(function(result, error){
      res.status(200).send(result);
    })
    .catch(function(error) {
      res.status(500).send(error);
    });
});

router.get('/proposal-fee/', function(req, res) {
  chaincoin.governanceinfo('fee')
    .then(function(result, error){
      res.status(200).json({fee: result.proposalfee});
    })
    .catch(function(error) {
      res.status(500).send(error);
    });
});

router.get('/submit/:proposal/:txid', function(req, res) {
  chaincoin.submit(req.params.proposal, req.params.txid)
    .then(function(result, error){
      res.status(200).json(result);
    })
    .catch(function(error) {
      res.status(500).send(error);
    });
});


module.exports = router;
