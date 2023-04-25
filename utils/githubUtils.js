const nodeGit = require('nodegit');
const fse = require("fs-extra");
const tmpFolder = "./tmp/projectRepo"
let repository;

const opts = {
    fetchOpts: {
        callbacks: {
            credentials: function() {
                return nodeGit.Cred.userpassPlaintextNew(process.env.GITHUB_TOKEN, "x-oauth-basic");
            },
            certificateCheck: function() {
                return 1;
            }
        }
    }
};

// Deletes tmp folder and gets necessary data from the JSON
const gitRepoHandle = async (repoObj) => {
    const repoPath = repoObj['repoPath'];
    const branch = repoObj['fileInfo']['branchName'];
    const filePath = repoObj['fileInfo']['filePath'];
    fse.remove(tmpFolder).then(function () {
        getRepoFile(repoPath, branch, filePath);
    });
};

// Uses nodeGit asynchronous module to clone a repository from GitHub, checkout to a specific branch and get a specific file content
const getRepoFile = async (repoPath, branch, filePath) => {
    repository = await nodeGit.Clone(repoPath, tmpFolder, opts);
    const branchReference = await repository.getBranch('refs/remotes/origin/' + branch);
    await repository.checkoutRef(branchReference, opts);
    const commit = await repository.getHeadCommit();
    const entry = await commit.getEntry(filePath);
    const blob = await entry.getBlob();
    console.log("blob" + blob);
};

module.exports = { gitRepoHandle };