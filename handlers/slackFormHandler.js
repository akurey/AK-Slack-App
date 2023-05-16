const { getProjectList, getActions } = require('./jsonDataHanlder');

// Handle the list from the JSON data and returns the object for the modal
const addOptions = (property) => {
    const options = [];
    for (let i = 0; i < property.length; i++) {
        options.push({text: {type: 'plain_text', emoji: true, text: property[i]}, value: `${i}`});
    }
    return options;
}

const FORM_MODAL = JSON.stringify({
    type: 'modal',
    title: {
        type: 'plain_text',
        text: 'PUF'
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
            type: "input",
            element: {
                type: "static_select",
                placeholder: {
                    type: "plain_text",
                    text: "Projects",
                    emoji: true
                },
                options: addOptions(getProjectList()),
                action_id: "projectSelect"
            },
            label: {
                type: "plain_text",
                text: "Project name",
                emoji: true
            }
        },
        {
            type: "input",
            element: {
                type: "static_select",
                placeholder: {
                    type: "plain_text",
                    text: "Actions",
                    emoji: true
                },
                options: addOptions(getActions()),
                action_id: "actionSelect"
            },
            label: {
                type: "plain_text",
                text: "Action type",
                emoji: true
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