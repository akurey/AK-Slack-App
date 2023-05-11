const { getProjectList, getActions } = require('./jsonDataHanlder');

const getMessageBlock = (username, projectId, actionId, notes, message) => {
    const project = getProjectList()[projectId];
    const actionType = getActions()[actionId];
    const messageBlock = [
        {
            type: "header",
            text: {
                type: "plain_text",
                text: ":triangular_flag_on_post:New SSOT update",
                emoji: true
            }
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                "text": `:mega:*UPDATE FROM:* ${username}\n:desktop_computer:*PROJECT:* ${project}\n:rocket:*ACTION TYPE:* ${actionType}\n:mag_right:*MESSAGE:*\n${message}\n:crystal_ball:*ADDITIONAL NOTES:*\n${notes}`
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