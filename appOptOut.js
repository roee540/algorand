const algosdk = require("algosdk");
const baseServer = "https://node.algoexplorerapi.io/";

let algodClient = new algosdk.Algodv2("", baseServer, "");

(async () => {
  const account = algosdk.mnemonicToSecretKey(
    "xxxx xxxxx xxxxx xxxxxx ...." // mnemonic
  );

  const sp = await algodClient.getTransactionParams().do();

  let txn = algosdk.makeApplicationClearStateTxnFromObject({
    from: account.addr,
    suggestedParams: sp,
    appIndex: 350338509, // APP ID
  });

  let signedTxn = txn.signTxn(account.sk);
  let txId = txn.txID().toString();
  console.log("Signed transaction with txID: %s", txId);

  await algodClient.sendRawTransaction(signedTxn).do();

  let confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);

  console.log(
    `Transaction ${txId} confirmed in round ${confirmedTxn["confirmed-round"]}`
  );

  accountInfo = await algodClient.accountInformation(account.addr).do();
  console.log(confirmedTxn.txn.txn);
  console.log(accountInfo);
})();
