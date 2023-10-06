const fs = require('fs');
const axios = require('axios');
const docusign = require('docusign-esign');

const API_CLIENT = new docusign.ApiClient();

//Add from docu sign dashboard
const userId = '';
const accountId = '';
const integrationKey = '';
const projectSecret = '';

//Generated after loging in on getAuthUri() URL
const code =
  'eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQoAAAABAAYABwCAP-l5tcDbSAgAgMtvwbXA20gCAA4UtBuR1HVLrCpqQnF1wkAVAAEAAAAYAAEAAAAFAAAADQAkAAAAMTYyMzNjMTQtY2Q5MS00NmFhLTljODktNzIxYjA1YzQxNTE3IgAkAAAAMTYyMzNjMTQtY2Q5MS00NmFhLTljODktNzIxYjA1YzQxNTE3NwBwTf_aQlKnQL43_6iSa5klMAAAc76DtMDbSA.xxLFeLiuLvyhjunUfxnquOI27WRVFNwS0b9ghTRvo_RvMJxy1BLu9AL-f1gVwSw9Laq-hf6pvCHqhA-Go84_5AZSPk583jzpNw-d2Si7DckjGiU6CCv4BfcLvo-yoDwXY29ncW42usTDn46tg3HDo2RJGJqY88AGv5JBrRyTQPoqNpcR1t2273HC2sJ2nQvsvPCaaARNSIvRkW7-ul-VBuI4KfHcu6NlbK1sImLaJ5ZsZOoECRBD_cEtFM0tEDYRiARPTliC5ksejlVbXnmxlwUQIIDAQ3W8jsbsb04KZ6VT1komllI-lptVzn0zJ5W1G3nzyVYC8Lk_9Dh5BftgMQ';

//Generated after calling getAccessToken() function
const ACCESS_TOKEN =
  'eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQoAAAABAAUABwAArkO9tcDbSAgAAO5my_jA20gCAA4UtBuR1HVLrCpqQnF1wkAVAAEAAAAYAAEAAAAFAAAADQAkAAAAMTYyMzNjMTQtY2Q5MS00NmFhLTljODktNzIxYjA1YzQxNTE3IgAkAAAAMTYyMzNjMTQtY2Q5MS00NmFhLTljODktNzIxYjA1YzQxNTE3MAAAc76DtMDbSDcAcE3_2kJSp0C-N_-okmuZJQ.tccfZCb6Ev-mlrgBhLNa0KClOrwFwEJP5cavTKkDsBlw-sHdfOU8ua9wu4fHcKU9qf6S75AWm8Qg-NGG7G5rgOWNh3zJMUIjIP7T_eUrUeRt9VIlI50-1qKBfjmkxyoEIddbjHJJzyQnobCJ6VdMitURuIxb5OUzajMLwwXex88wJ8brhszvc90GjUpu1CmXUI_Jd9Xiy5u7rjETSycj5UxxlLO0q0gtel7fTt-WHz_7bsQrLEphZytI7BQNSvil9Nc1LXb9tL20ER5EoLuGSXWY9nQuPopv_ySkhINaLSmDCA0EDnVlzyovE0ksDUaPzfGSDqFcoE3R5ZFlAeQIkA';

//Only for development
API_CLIENT.setOAuthBasePath('account-d.docusign.com');
API_CLIENT.setBasePath('https://demo.docusign.net/restapi');
API_CLIENT.addDefaultHeader('Authorization', 'Bearer ' + ACCESS_TOKEN);

//Generated after generateEnvelope() function
const ENVELOPE = {
  envelopeId: 'aa1c5e39-8170-4d84-8d4f-b7dcbb4cb812',
  status: 'sent',
  statusDateTime: '2023-09-29T07:48:03.1700000Z',
  uri: '/envelopes/aa1c5e39-8170-4d84-8d4f-b7dcbb4cb812',
};

const main = async () => {
  try {
    // const authUri = await getAuthUri();
    // console.log("👉 - authUri:", authUri);
    // const {
    //   accessToken: ACCESS_TOKEN,
    //   refreshToken,
    //   userInfo,
    // } = await getAccessToken();
    // console.log("👉 - ACCESS_TOKEN:", ACCESS_TOKEN);
    // console.log("👉 - userInfo:", userInfo);
    // const sentEnvelop = await generateEnvelope();
    // console.log('👉 - envelope:', sentEnvelop);

    const view = await generateView();
    console.log('👉 - view:', view);
  } catch (error) {
    console.log('👉 - error:', error.response.error);
  }
};

const makeEnvelope = () => {
  let docPdfBytes;
  docPdfBytes = fs.readFileSync('./signFile.pdf');

  let env = new docusign.EnvelopeDefinition();
  env.emailSubject = 'Please sign this document';

  let doc1 = new docusign.Document(),
    doc1b64 = Buffer.from(docPdfBytes).toString('base64');
  doc1.documentBase64 = doc1b64;

  doc1.name = 'Lorem Ipsum';
  doc1.fileExtension = 'pdf';
  doc1.documentId = '3';

  env.documents = [doc1];

  let signer1 = docusign.Signer.constructFromObject({
    email: 'prasanth.v@deltasoft.in',
    name: 'Prasanth V',
    clientUserId: '<>',
    recipientId: 1,
  });

  let signHere1 = docusign.SignHere.constructFromObject({
    anchorString: '/sn1/',
    anchorYOffset: '10',
    anchorUnits: 'pixels',
    anchorXOffset: '20',
  });

  let signer1Tabs = docusign.Tabs.constructFromObject({
    signHereTabs: [signHere1],
  });
  signer1.tabs = signer1Tabs;

  let recipients = docusign.Recipients.constructFromObject({
    signers: [signer1],
  });
  env.recipients = recipients;
  env.status = 'sent';

  return env;
};

const generateEnvelope = async () => {
  let envelopesApi = new docusign.EnvelopesApi(API_CLIENT),
    results = null;
  let envelope = makeEnvelope();
  results = await envelopesApi.createEnvelope(accountId, { envelopeDefinition: envelope });
  return results;
};

const generateView = async () => {
  let viewRequest = new docusign.RecipientViewRequest();
  viewRequest.returnUrl = 'http://localhost';
  viewRequest.authenticationMethod = 'none';
  viewRequest.email = 'prasanth.v@deltasoft.in';
  viewRequest.userName = 'Prasanth V';
  viewRequest.clientUserId = '';
  // viewRequest.pingFrequency = 600;

  let envelopesApi = new docusign.EnvelopesApi(API_CLIENT);

  results = await envelopesApi.createRecipientView(accountId, ENVELOPE.envelopeId, {
    recipientViewRequest: viewRequest,
  });

  return { envelopeId: ENVELOPE.envelopeId, redirectUrl: results.url };
};

const getAuthUri = async () => {
  const scopes = ['signature', 'impersonation', 'extended'];
  const responseType = API_CLIENT.OAuth.ResponseType.CODE;
  const redirectUrl = 'http://localhost';

  return API_CLIENT.getAuthorizationUri(integrationKey, scopes, redirectUrl, responseType);
};

const getAccessToken = async () => {
  const { accessToken, refreshToken } = await API_CLIENT.generateAccessToken(integrationKey, projectSecret, code);

  const userInfo = await API_CLIENT.getUserInfo(accessToken);
  return { accessToken, refreshToken, userInfo };

  // const tokenUrl = "https://account-d.docusign.com/oauth/token";
  // const authorizationHeader = `Basic ${Buffer.from(
  //   `${integrationKey}:${projectSecret}`
  // ).toString("base64")}`;

  // const data = {
  //   grant_type: "authorization_code",
  //   code: tokenFromAuthUri,
  // };

  // const headers = {
  //   Authorization: authorizationHeader,
  //   "Content-Type": "application/json",
  // };

  // return axios
  //   .post(tokenUrl, data, { headers })
  //   .then((response) => {
  //     console.log("Token request successful:", response.data);
  //     return response.data;
  //   })
  //   .catch((error) => {
  //     console.error("Error making token request:", error.response.data);
  //   });
};

main();
