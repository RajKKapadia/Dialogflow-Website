const dialogflow = require('@google-cloud/dialogflow');
const fs = require('fs');

const CREDENTIALS = JSON.parse(fs.readFileSync('./testingaog-wlgdsq-f6e2adaf866c.json', 'utf-8'));

const PROJECID = CREDENTIALS.project_id;

const CONFIGURATION = {
    credentials: {
        private_key: CREDENTIALS.private_key,
        client_email: CREDENTIALS.client_email
    }
}

const sessionClient = new dialogflow.SessionsClient(CONFIGURATION);

const detectIntent = async (languageCode, queryText, sessionId) => {

    let sessionPath = sessionClient.projectAgentSessionPath(PROJECID, sessionId);

    let request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: queryText,
                languageCode: languageCode,
            },
        },
    };

    try {
        const responses = await sessionClient.detectIntent(request);
        const result = responses[0].queryResult;
        return {
            status: 1,
            text: result.fulfillmentText
        };
    } catch (error) {
        console.log(`Error at dialogflow-api.js detectIntent --> ${error}`);
        return {
            status: 0,
            text: 'Error at dialogflow detect intent.'
        };
    }
};

module.exports = {
    detectIntent
};