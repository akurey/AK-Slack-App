const fs = require('fs');
const rawData = fs.readFileSync('./data.json');
const config= JSON.parse(rawData);

// Handle the list from the JSON data and returns the object for the modal
function addOptions(property) {
    const options = [];
    for (let i = 0; i < property.length; i++) {
        options.push({text: {type: 'plain_text', emoji: true, text: property[i]}, value: `value-${i}`});
    }
    return options;
}

const FORM_MODAL = JSON.stringify({
    type: 'modal',
    title: {
        type: 'plain_text',
        text: 'Project Update Form'
    },
    callback_id: 'SSOTRequest',
    submit: {
        type: 'plain_text',
        text: 'Submit'
    },
    blocks: [
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: ":memo: Single source of truth update"
            }
        },
        {
            type: "divider"
        },
        {
            type: "section",
            block_id: "projectSelectionSection",
            text: {
                type: "mrkdwn",
                text: "*Project name*"
            },
            accessory: {
                type: "static_select",
                action_id: "projectSelect",
                placeholder: {
                    type: "plain_text",
                    emoji: true,
                    text: "Projects"
                },
                options: addOptions(config['projectList'])
            }
        },
        {
            type: "section",
            block_id: "actionTypeSection",
            text: {
                type: "mrkdwn",
                text: "*Action type*"
            },
            accessory: {
                type: "static_select",
                action_id: "actionSelect",
                placeholder: {
                    type: "plain_text",
                    emoji: true,
                    text: "Actions"
                },
                options: addOptions(config['actions'])
            }
        },
        {
            type: "input",
            block_id: "additionalNotesSection",
            element: {
                type: "plain_text_input",
                action_id: "notesAction",
                multiline: true
            },
            label: {
                type: "plain_text",
                text: "Description (optional)",
                emoji: true
            },
            optional: true
        },
        {
            type: "divider"
        },
        {
            type: "section",
            block_id: "conversationsSection",
            text: {
                type: "mrkdwn",
                text: "Additional notification to: "
            },
            accessory: {
                type: "multi_conversations_select",
                placeholder: {
                    type: "plain_text",
                    text: "Select conversations",
                    emoji: true
                },
                action_id: "conversationsAction"
            }
        }
    ]
});

exports.FORM_MODAL = FORM_MODAL;