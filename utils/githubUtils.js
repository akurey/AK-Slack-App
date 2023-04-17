const nodeGit = require('nodegit');
const path = require("path");
const fse = require("fs-extra");
const tmpFolder = "./tmp/projectRepo"
const token = "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";

const opts = {
    fetchOpts: {
        callbacks: {
            credentials: function() {
                return nodeGit.Cred.userpassPlaintextNew(token, "x-oauth-basic");
            },
            certificateCheck: function() {
                return 1;
            }
        }
    }
};
const handleGithub = async (repoObj) => {
    const repoPath = repoObj['repoPath']; //https://github.com/akurey/AK-Projects-Single-Source.git
    const branch = repoObj['fileInfo']['branchName']; // main
    const filePath = repoObj['fileInfo']['filePath']; //Slack-Application/project-slack-ssot.md
    fse.remove(tmpFolder).then(function() {
        nodeGit.Clone(repoPath, tmpFolder, opts).then(function(repo) {
            repo.getBranch('refs/remotes/origin/' + 'feature/ASA-29')
                .then(function (reference) {
                    return repo.checkoutRef(reference, opts);
                });
        });
    });
    // await checkoutBranch(repository, repoPath, branch);
    // await getFileData(repository, filePath);
};

const removeRepoClone = async (dir) => {
    fse.remove(dir);
}
const checkoutBranch = async (repo, branch) => {
    repo.getBranch('refs/remotes/origin/' + 'feature/ASA-29')
        .then(function (reference) {
            return repo.checkoutRef(reference, opts);
        });
};

const getFileData = async (repo, filePath) => {
    const commit = await repo.getHeadCommit();
    const entry = await commit.getEntry(filePath);
    const blob = await entry.getBlob();
    console.log(entry.name(), entry.sha(), blob.rawsize() + "b");
    console.log("========================================================\n\n");
    const firstTenLines = blob.toString().split("\n").slice(0, 10).join("\n");
    console.log(firstTenLines);
    console.log("...");
};

module.exports = { handleGithub };