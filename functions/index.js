const functions = require('firebase-functions');

exports.renderAttachment = functions.https.onRequest((request, response) => {
  response.send(`<ac:image> <ri:attachment ri:filename="zenuml-${request.query.uuid}.png" /> </ac:image>`);
});

exports.installedEndpoint = functions.https.onRequest((request, response) => {
  console.log('request.body.baseUrl:', request.body.baseUrl);
  console.log('request.clientKey:', request.body.clientKey);
  response.status(200).send(`OK`);
});

exports.uninstalledEndpoint = functions.https.onRequest((request, response) => {
  console.log('request.body.baseUrl:', request.body.baseUrl);
  console.log('request.clientKey:', request.body.clientKey);
  response.status(200).send(`OK`);
});
