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
                options: [
                    {
                        text: {
                            type: "plain_text",
                            emoji: true,
                            text: "Project 1"
                        },
                        value: "value-0"
                    },
                    {
                        text: {
                            type: "plain_text",
                            emoji: true,
                            text: "Project 2"
                        },
                        value: "value-1"
                    },
                    {
                        text: {
                            type: "plain_text",
                            emoji: true,
                            text: "Project 3"
                        },
                        value: "value-2"
                    }
                ]
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
                options: [
                    {
                        text: {
                            type: "plain_text",
                            emoji: true,
                            text: "Requirement"
                        },
                        value: "value-0"
                    },
                    {
                        text: {
                            type: "plain_text",
                            emoji: true,
                            text: "Technical"
                        },
                        value: "value-1"
                    },
                    {
                        text: {
                            type: "plain_text",
                            emoji: true,
                            text: "Scope"
                        },
                        value: "value-2"
                    },
                    {
                        text: {
                            type: "plain_text",
                            emoji: true,
                            text: "Additional notes"
                        },
                        value: "value-3"
                    }
                ]
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