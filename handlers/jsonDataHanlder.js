const fs = require('fs');
const rawData = fs.readFileSync('./data.json');
const config= JSON.parse(rawData);

const getProjectList = () => {
  return config['projectList'];
};

const getActions = () => {
    return config['actions'];
};

const getChannels = (projectId, actionId) => {
    const projectName = getProjectList()[projectId].toLowerCase();
    const actionType = getActions()[actionId].toLowerCase();
    const notifications = config['projects'][projectName]['notifications'][actionType];
    let channels = [];
    channels.push(notifications['channels']);
    channels.push(notifications['people']);
    return channels
};

module.exports = {
    getProjectList,
    getActions,
    getChannels
}