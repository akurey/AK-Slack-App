const { App, AwsLambdaReceiver } = require('@slack/bolt');
const { FORM_MODAL } = require('./handlers/slackFormHandler');
const { getMessageBlock } = require('./handlers/slackMessageHandler');
let userId, message;

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

         userId = shortcut.user.id;
         message = shortcut.message.text;
    } catch (error) {
        console.error(error);
    }
});

// Handles view submission request with the callback id from the modal/form
app.view({ callback_id: 'SSOTRequest', type: 'view_submission'}, async ({ ack, body, view, client, logger }) => {
    await ack();

    let [projectId, actionId, notes, conversations] = Object.values(view.state.values);
    projectId = projectId['projectSelect']['selected_option']['value'];
    actionId = actionId['actionSelect']['selected_option']['value'];
    notes = notes['notesAction']['value'];
    conversations =  conversations['conversationsAction']['selected_conversations'];
    const userName = await getUserName();
    await publishMessage(userName, projectId, actionId, notes, conversations, message);
});


// Request to SLACK PAI to publish a message to the list of channels selected
const publishMessage = async (username, project, action, notes, conversations, message) => {
    try {
        const messageBlock = getMessageBlock(username, project, action, notes, message);
        conversations.map( async channel => {
            await app.client.chat.postMessage({
                text: '',
                blocks: messageBlock,
                channel: channel
            });
        });
    } catch (error) {
        console.error(error);
    }
}
// Request to SLACK API to get the user complete name
const getUserName = async () => {
    const username = await app.client.users.info({user: userId});
    return username.user.real_name;
}

// Handle Lambda function event
module.exports.handler = async (event, context, callback) => {
    const handler = await awsLambdaReceiver.start();
    return handler(event, context, callback);
}