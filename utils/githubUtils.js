const nodeGit = require('nodegit');
const tmpFolder = "./tmp/projectRepo/"
const path = require('path');
const fs = require('fs');

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
const gitRepoHandle = (repoObj, messageInfoObj) => {
    const repoPath = repoObj['repoPath'];
    const branch = repoObj['fileInfo']['branchName'];
    const filePath = repoObj['fileInfo']['filePath'];
    const section = repoObj['section'];
    const repoName = repoPath.slice(repoPath.lastIndexOf('/') + 1);
    const ssotFilePath = tmpFolder + repoName + '/' + filePath;
    let repository;
    getRepoInstance(repoName, repoPath, ssotFilePath)
        .then((repo) => {
            repository = repo;
            return checkoutRepo(branch, repo, repoName);
        })
        .then(() => {
            return writeReadFile(repository, filePath, section, ssotFilePath, messageInfoObj);
        })
};

// Uses nodeGit asynchronous module to clone a repository from GitHub or opens it if it wasn't cloned previously
const getRepoInstance = async (repoName, repoPath, ssotFilePath) => {
    let repo;
    if (fs.existsSync(ssotFilePath)) {
        repo = nodeGit.Repository.open(path.resolve(tmpFolder+repoName), "/.git");
    } else {
        repo = nodeGit.Clone(repoPath, tmpFolder+repoName, opts);
    }
    return repo;
};

// Uses nodegit to check out to a specific branch and returns head commit of branch
const checkoutRepo = async (branch, repo) => {
    repo.fetchAll(opts).then(() =>
        createMasterBranch(repo, branch).then(succeeded =>
            succeeded ?
                repo.mergeBranches(branch, 'origin/'+branch, null, nodeGit.Merge.PREFERENCE.FASTFORWARD_ONLY).then(() => true)
                : false
        )
    )
};

const writeReadFile = async (repo, filePath, section, ssotFilePath, messageInfoObj) => {
    getFileContents(repo, filePath).then((ssotFile) => {
        writeFile(ssotFile, section, ssotFilePath, messageInfoObj);
    });
};

// Uses nodegit to get the head commit and gets the ssot file contents
const getFileContents = async (repo, filePath) => {
    const commit = await repo.getHeadCommit();
    const entry = await commit.getEntry(filePath);
    const blob = await entry.getBlob();
    return blob.toString();
};

// Uses fs to writes the update message into the content from md file
const writeFile = async (fileContent, section, ssotFilePath, messageInfoObj) => {
    // Get the position of the action type section and the position of next section
    const index = fileContent.indexOf(section);
    const nextTitleIdx = fileContent.indexOf('##', index+1);

    const ssotUpdate = getSSOTUpdate(messageInfoObj);

    let bufferedText;
    if (nextTitleIdx > 0) {
        fileContent = fileContent.substring(nextTitleIdx);
        bufferedText = new Buffer.from(ssotUpdate + fileContent);
    } else {
        bufferedText = new Buffer.from(fileContent+ssotUpdate);
    }

    const file = fs.openSync(ssotFilePath, 'r+');
    fs.writeSync(file, bufferedText, 0, bufferedText.length, nextTitleIdx);
    fs.close(file);
};

// This method ensures that there is a master branch to pull into
function createMasterBranch(repository, branch) {
    const remoteMasterRefName = 'refs/remotes/origin/'+branch;
    return repository.getBranch(branch).then(ref => true)
        .catch(() =>
            nodeGit.Reference.symbolicCreate(repository, 'refs/remotes/origin/HEAD', remoteMasterRefName, 1, 'Set origin head')
                .then(() =>
                    repository.getReference(remoteMasterRefName)
                        .then(remoteMasterRef => {
                            const commitOid = remoteMasterRef.target();
                            return repository.createBranch(branch, commitOid) // create master to point to origin/master
                                .then(masterRef => repository.checkoutBranch(masterRef)) // checkout branch to update working directory
                                .then(() => {
                                    nodeGit.Reset.reset(repository, commitOid, 3, opts);
                                })
                                .then(() => true);
                        })
                        .catch(() => false) // if getting the remote ref fails, continue as usual
                )
        );
}

// Formats the message structure for the md file
const getSSOTUpdate = (messageInfoObj)  => {
    const {user, message, notes, timestamp} = messageInfoObj;
    return `* ${user} [${timestamp}]\n${(message) ? `\nMessage: ${message}\n\n` : ""}${(notes) ? `Notes: ${notes}\n\n`: ""}`;
};


module.exports = { gitRepoHandle };