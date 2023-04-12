const getMessageBlock = (username, project, actionType, notes, message) => {
    const messageBlock = [
        {
            type: "header",
            text: {
                type: "plain_text",
                text: "New SSOT update",
                emoji: true
            }
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: `*UPDATE FROM:* ${username}\n*PROJECT:* ${project}\n*ACTION TYPE:* ${actionType}\n*MESSAGE:*\n${message}\n*ADDITIONAL NOTES:*\n${notes}`
            },
            accessory: {
                type: "image",
                image_url: "https://api.slack.com/img/blocks/bkb_template_images/approvalsNewDevice.png",
                alt_text: "computer thumbnail"
            }
        }
    ];
    return messageBlock;
}

module.exports = { getMessageBlock }