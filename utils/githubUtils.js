const { Octokit } = require("@octokit/rest");

const gitRepoHandle = (repoObj, messageInfoObj) => {
    const repoPath = repoObj['repoPath'];
    const branch = repoObj['fileInfo']['branchName'];
    const filePath = repoObj['fileInfo']['filePath'];
    const section = repoObj['section'];
    const owner = repoObj['owner'];
    const repoName = repoPath.slice(repoPath.lastIndexOf('/') + 1).replace('.git', '');
    const authToken = repoObj['token'];
    const octokit = new Octokit({
        auth: authToken,
        userAgent: 'AKUREY Source'
    });

    let ssotFile;

    getFileContent(octokit, owner, repoName, branch, filePath)
    .then(result => {
        ssotFile = result;
        return writeContent(ssotFile.content, section, messageInfoObj);
    }).then((content) => {
        return updateRepoFileContent(octokit, owner, repoName, branch, filePath, messageInfoObj.actionType, content, ssotFile.sha);
    });
};

// Uses Octokit to get the content and sha from the repository
const getFileContent = async (octokit, owner, repoName, branch, filePath) => {
    let content, sha;
    await octokit.repos.getContent({
        owner: owner,
        repo: repoName,
        ref: branch,
        path: filePath
    }).then(result => {
        content = Buffer.from(result.data.content, 'base64').toString();
        sha = result.data.sha;
    });
    return {content: content, sha: sha};
};

// Writes new update under a section on the md file
function writeContent(fileContent, section, messageInfoObj) {
    const ssotUpdate = getSSOTUpdate(messageInfoObj);
    // Get the position of the action type section and the position of next section
    const index = fileContent.indexOf(section);
    const nexTitleIdx = fileContent.indexOf('\n## ', index+1);

    if (nexTitleIdx < 0) { // Last Section
        return fileContent + ssotUpdate;
    } else {
        return fileContent.substring(0,nexTitleIdx) + ssotUpdate + fileContent.substring(nexTitleIdx);
    }
}

// Uses Octokit to update the ssotfile
const updateRepoFileContent = async (octokit, owner, repoName, branch, filePath, actionType, ssotUpdate, sha) => {
    const author = {name: "SSOT File Update", email: "kng@akurey.com"}
    await octokit.repos.createOrUpdateFileContents({
        owner: owner,
        repo: repoName,
        branch: branch,
        path: filePath,
        message: `Update to the SSOTFile ${actionType}`,
        content: Buffer.from(ssotUpdate).toString('base64'),
        committer: author,
        author: author,
        sha: sha
    })
};


// Formats the message structure for the md file
const getSSOTUpdate = (messageInfoObj)  => {
    const {user, message, notes, timestamp} = messageInfoObj;
    return `\n#### **${user} [${timestamp}]** \n${(message) ? `\nMessage: ${message}\n\n` : ""}${(notes) ? `Notes: ${notes}\n`: ""}`;
};

module.exports = { gitRepoHandle };