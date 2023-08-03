// const AUTHINFO = {
//    username:"test",
//    password:"test"
// };

const express = require('express');

// File upload function
// const fs = require('fs');

// const basicAuth = require('basic-auth-connect');

const cors = require('cors');
require('dotenv').config({ debug:true });

const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

if (typeof process.env.API_KEY == 'undefined') {
   console.error('Error: "API_KEY" is not set.');
   console.error('Please consider adding a .env file with API_KEY.');
   process.exit(1);
}

const nluAuthenticator = new IamAuthenticator({
   apikey: process.env.API_KEY,
});

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2022-04-07',
  authenticator: nluAuthenticator,
  serviceUrl: process.env.API_BASE_URL,
});

var server = express();
server
   .use(express.urlencoded({extended: false}))
   .use(express.json())

   // CORS
   .use(cors())

   // Basic Auth
   // .use(basicAuth(
   //    AUTHINFO.username,
   //    AUTHINFO.password 
   // ))
   .use(express.static('public'))

// Analyze
   .post('/analyze', function (req, res) {
      let param = req.body;
      // Check Params
      if (!(param && param.features)) {
         res.status(500).send({"error": "Invalid params!"});
         return;
      }

      // const analyzeParams = {
      //    'url': 'https://en.wikipedia.org/wiki/Emmanuel_Macron',
      //    'features': {
      //       'sentiment': {
      //          'targets': [
      //             'France'
      //          ]
      //       }
      //    }
      // };

      naturalLanguageUnderstanding.analyze(param)
      .then(analysisResults => {
         console.log(JSON.stringify(analysisResults, null, 2));
         res.json(analysisResults.result);
      })
      .catch(err => {
         console.log('error:', err);
         res.status(500).send({"error": err});
      });
   })

const port = process.env.PORT || 3000;
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log('Watson NLU Bridge Server running on port: %d', port);
//   console.log('process.env: ', process.env);
});