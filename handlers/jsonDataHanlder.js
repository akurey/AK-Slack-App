const fs = require('fs');
const rawData = fs.readFileSync('./data.json');
const config= JSON.parse(rawData);

const getProjectList = () => {
    return config['projectList'];
};

const getActions = () => {
    return config['actions'];
};

const getSpecificAction = (actionId) => {
    return config['actions'][actionId];
};

const getEmails = (projectId, actionId) => {
    const projectName = getProjectList()[projectId].toLowerCase();
    const actionType = getActions()[actionId].toLowerCase();
    const notifications = config['projects'][projectName]['notifications'][actionType];
    return notifications['people'];
};

const getChannels = (projectId, actionId) => {
    const projectName = getProjectList()[projectId].toLowerCase();
    const actionType = getActions()[actionId].toLowerCase();
    const notifications = config['projects'][projectName]['notifications'][actionType];
    return notifications['channels'];
}

const getRepoInfo = (projectId, actionId) => {
    const projectName = getProjectList()[projectId].toLowerCase();
    const actionType = getActions()[actionId].toLowerCase();
    const extension = config['projects'][projectName]['extensions']['github'];
    const path = extension['repository'];
    const projectFile = extension['projectFile'];
    const section = extension[actionType]['section'];
    const owner = path.split('/').slice(-2)[0];
    return {repoPath: path, fileInfo: getRepoFileInfo(projectFile), section: section, owner: owner, token: token};
};

const getRepoFileInfo = (filePath) => {
    const branchFileInfo = filePath.slice(filePath.indexOf('/blob/')+6);
    const pathDividerIdx = branchFileInfo.indexOf('/');
    const branchName =  branchFileInfo.slice(0,pathDividerIdx);
    const fileDir = branchFileInfo.slice(pathDividerIdx+1);
    return {branchName: branchName, filePath: fileDir};
};

module.exports = {
    getProjectList,
    getActions,
    getEmails,
    getChannels,
    getRepoInfo,
    getSpecificAction
}