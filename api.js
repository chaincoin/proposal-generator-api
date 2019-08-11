require('dotenv').config();
var bitcoin_rpc = require('node-bitcoin-rpc');

bitcoin_rpc.init(process.env.RPC_HOST, process.env.RPC_PORT, process.env.RPC_USER, process.env.RPC_PASS);

exports.count = new Promise(
  function(resolve, reject) {
    bitcoin_rpc.call('masternode', ['count'], function (err, res) {
      if (err != null)
        reject(err);
      else if (res.error != null)
        reject(res.error.message);
      else {
        resolve(res.result);
      }
    })
  }
).catch(function(e){
  console.log('error: ' + e);
});

exports.validateaddress = function(address) {
  return new Promise(
    function(resolve, reject) {
      bitcoin_rpc.call('validateaddress', [address], function (err, res) {
        if (err != null)
          reject(err);
        else if (res.error != null)
          reject(res.error.message);
        else {
          resolve(res.result);
        }
      })
    }
  ).catch(function(e){
    console.log('error: ' + e);
  });
}

exports.confirmations = function(txid) {
  return new Promise(
    function(resolve, reject) {
      bitcoin_rpc.call('getrawtransaction', [txid, 1], function (err, res) {
        if (err != null)
          reject(err);
        else if (res.error != null)
          reject(res.error.message);
        else {
          resolve(res.result);
        }
      })
    }
  ).catch(function(e){
    console.log('error: ' + e);
  });
}

exports.submit = function(proposal, txid) {
  return new Promise(
    function(resolve, reject) {
      bitcoin_rpc.call('gobject', ['submit', proposal.split(' ')[0], proposal.split(' ')[1], proposal.split(' ')[2], proposal.split(' ')[3], txid], function(err, res) {
        if (err != null)
          reject(err);
        else if (res.error != null)
          reject(res.error.message);
        else
          resolve(res.result);
      })
    }
  );
}

exports.governanceinfo = function(reason) {
  return new Promise(
    function(resolve, reject) {
      bitcoin_rpc.call('getgovernanceinfo', [], function (err, res) {
        if (res.error.code == -32601) {
          bitcoin_rpc.call('getfundinginfo', [], function (err, res) {
            if (err != null)
              reject(err);
            else if (res.error != null)
              reject(res.error.message);
            else {
              if (reason == 'fee')
                resolve(res.result);
              else {

                bitcoin_rpc.call('getblockchaininfo', [], function(errB, resB) {
                  if (errB != null)
                    reject(errB);
                  else if (resB.error != null)
                    reject(resB.error.message);
                  else {
                    let chain = resB.result.chain;
                    let blocks = resB.result.blocks;

                    let max = (chain == 'test') ? 100 : 26;
                    var paymentsDate = [];

                    for (let i = 0; i < max; i++) {
                      let valor = (((res.result.nextsuperblock) + res.result.superblockcycle * i) - blocks) * 90;
                      let currentDate = new Date();
                      currentDate.setSeconds("+" + valor);
                      if (chain == 'test')
                        paymentsDate.push(currentDate.toLocaleDateString().replace(/-/g, '/') + ' ' + currentDate.toLocaleTimeString());
                      else
                        paymentsDate.push(currentDate.toLocaleDateString().replace(/-/g, '/'));
                    }
                    resolve(JSON.stringify(paymentsDate));
                  }
                })
              }
            }
          })
        } else {
          if (err != null)
            reject(err);
          else if (res.error != null)
            reject(res.error.message);
          else {
            resolve(res.result);
          }
        }
      })
    }
  ).catch(function(e){
    console.log('error: ' + e);
  });
}
