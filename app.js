const { App, AwsLambdaReceiver } = require('@slack/bolt');
const { FORM_MODAL } = require('./handlers/slackFormHandler');
const { getChannels, getRepoInfo, getEmails, getSpecificAction } = require('./handlers/jsonDataHanlder');
const { getMessageBlock } = require('./handlers/slackMessageHandler');
const { gitRepoHandle } = require('./utils/githubUtils');
let userId, message = '';

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
         if (shortcut.message.text !== undefined || shortcut.message.text !== null) {
             message = shortcut.message.text;
         }
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
    const messageInfo = {user: userName, message: message, notes: notes, timestamp: new Date().toISOString(), actionType: getSpecificAction(actionId)};
    await gitRepoHandle(getRepoInfo(projectId, actionId), messageInfo);
    conversations = await getConversations(conversations, projectId, actionId);
    await publishMessage(userName, projectId, actionId, notes, conversations, message);
});


// Request to SLACK PAI to publish a message to the list of channels selected
const publishMessage = async (username, project, action, notes, conversations, message) => {
    try {
        const messageBlock = getMessageBlock(username, project, action, notes, message);
        conversations.map( async conversation => {
            await app.client.chat.postMessage({
                text: '',
                blocks: messageBlock,
                channel: conversation
            });
        });
    } catch (error) {
        console.error(error);
    }
};

// Request to SLACK API to get the user complete name
const getUserName = async () => {
    const username = await app.client.users.info({user: userId});
    return username.user.real_name;
}

// Handles the conversations selected from the modal and the JSON data
const getConversations = async (conversations, projectId, actionId) => {
    let userEmails = getEmails(projectId, actionId);
    let channels = getChannels(projectId, actionId);

    const conversationList = [];
    for (const email of userEmails) {
        conversationList.push(await getUserIdByEmail(email));
    }
    conversations.map(conversation => {
        conversationList.push(conversation);
    });

    /**
     * This for was implemented this way since there is a known bug on the slack apy where
     * if the application has joined the channels, requesting the api
     * conversations.list with parameter: types = "private_channel,public_channel" only returns public channels
     * instead of both public and private channels
     */
    for (const channel of channels) {
        let channelId = await getPrivateChannelId(channel);
        if (channelId === undefined || channelId === null) {
            channelId = await getPublicChannelId(channel);
        }
        conversationList.push(channelId);
    }
    return removeDuplicates(conversationList);
};

// Request to SLACK API to get user id from an email
const getUserIdByEmail =  async (email) => {
    try {
        const userData = await app.client.users.lookupByEmail({email: email});
        return userData['user']['id'];
    } catch (error) {
        /**
         * This console.error will be constantly thrown because of the slack private and public channels listing bug
         */
        console.error(error);
    }
};

// Request to SLACK API to get private channel id with the input name
const getPrivateChannelId = async (channelName) => {
    try {
        const channelList = await app.client.conversations.list({types: "private_channel"});
        const filtered = channelList.channels.filter(item => item.name === channelName)[0];
        return filtered['id'];
    } catch (error) {
        /**
         * This console.error will be constantly thrown because of the slack private and public channels listing bug
         */
        console.log(error);
    }
};

// Request to SLACK API to get public channel id with the input name
const getPublicChannelId = async (channelName) => {
    try {
        const channelList = await app.client.conversations.list({types: "public_channel"});
        const filtered = channelList.channels.filter(item => item.name === channelName)[0];
        return filtered['id'];
    } catch (error) {
        console.log(error);
    }
};

const removeDuplicates = (arr) => {
    return arr.filter((item, index) => arr.indexOf(item) === index);
}

// Handle Lambda function event
module.exports.handler = async (event, context, callback) => {
    const handler = await awsLambdaReceiver.start();
    return handler(event, context, callback);
}