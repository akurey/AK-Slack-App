const { App, AwsLambdaReceiver } = require('@slack/bolt');
const { FORM_MODAL } = require('./components/slackForm')

// Initialize custom receiver
const awsLambdaReceiver = new AwsLambdaReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Initializes app with bot token and the AWS Lambda ready receiver
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    receiver: awsLambdaReceiver,
});

// Handles event for shortcut with callbackId: messageUpdateSSOT and triggers the modal
app.shortcut('messageUpdateSSOT', async ({ shortcut, ack, client, logger }) => {
    try {
        await ack();

        await client.views.open({
            trigger_id: shortcut.trigger_id,
            view: FORM_MODAL
        });

    } catch (error) {
        console.error(error);
    }
});

// Handles view submission request with the callback id from the modal/form
app.view({ callback_id: 'SSOTRequest', type: 'view_submission'}, async ({ ack, body, view, client, logger }) => {
    await ack();

    const [project, action, notes, conversations] = Object.values(view.state.values);

    console.log("Selected Project: " + project['projectSelect']['selected_option']['value']);
    console.log("Selected Action: " + action['actionSelect']['selected_option']['value']);
    console.log("Added Additional Notes: " + notes['notesAction']['value']);
    console.log("Selected Conversations id: " + conversations['conversationsAction']['selected_conversations']);
});

// Handle Lambda function event
module.exports.handler = async (event, context, callback) => {
    const handler = await awsLambdaReceiver.start();
    return handler(event, context, callback);
}