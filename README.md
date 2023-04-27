# AK-Slack-App

Single source of truth application which connects Slack with GitHub currently and sends update messages through Slack API and also connects to public GitHub repositories and modifies the SSOT md file.  


## Getting started.

### Install AWS CLI
https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html


### Configure an AWS profile
Run aws configure to configure the profile:
```
aws configure
# AWS Access Key ID [None]: <your-aws-access-key>
# AWS Secret Access Key [None]: <your-aws-secret>
# Default region name [None]: us-east-2
# Default output format [None]: json
```
Note: contact Soledad Kopper or Jose Barboza for the access key and secret acess key file.

### Install Serverless Framework CLI
Run:
```
npm install -g serverless
```
Test that the installation is complete by running:
```
serverless help
```
Check out the Serverless [Getting Started documentation](https://www.serverless.com/framework/docs/getting-started) for instructions on how to install.

### Data Structure

AK-Slack-App currently works by reading from the `data.json` file which has the following structure:
```
{
  "projectList": ["Project1"],
  "actions" : ["Requirement", "Technical", "Scope", "Notes"],
  "projects": {
    "Project1" : {
      "active" : true,
      "notifications" : {
        "requirement": {
          "channels": [ ... List of channels ],
          "people": [ ... List of people]
        },
        "technical": {
          "channels": [ ... List of channels ],
          "people": [ ... List of people]
        },
        "scope": {
          "channels": [ ... List of channels ],
          "people": [ ... List of people]
        },
        "notes": {
          "channels": [ ... List of channels ],
          "people": [ ... List of people]
        }
      },
      "extensions" : {
        "github": {
          "repository": "repositoryLink.git",
          "projectFile" : "linkToFile.md",
          "requirement": {
            "section" : "Title of section"
          },
          "technical": {
            "section" : "Title of section"
          },
          "scope": {
            "section" : "Title of section"
          },
          "notes": {
            "section" : "Title of section"
          }
        }
      }
    }
  }
}
```


### Adding a new project

Add to the `projectList` the new project name separated with commas:
```
"projectList": ["Project1", "NewProject"]
```

Define the project values inside `projects` and set active to `true`:
```
"projects": {
    "NewProject" : {
      "active" : true,
      "notifications" : {
        "requirement": {
          "channels": ["ak-website-design", "akurey-ssot"],
          "people": ["skopper@akurey.com", "jabarboza@akurey.com"]
        },
        "technical": {
          "channels": ["akurey-ssot"],
          "people": ["kafay.ng@akurey.com"]
        },
        "scope": {
          "channels": ["akurey-ssot"],
          "people": ["jabarboza@akurey.com", "kafay.ng@akurey.com"]
        },
        "notes": {
          "channels": ["akurey-ssot"],
          "people": ["skopper@akurey.com", "kafay.ng@akurey.com"]
        }
      },
      "extensions" : {
        "github": {
          "repository": "https://github.com/akurey/AK-Projects-Single-Source.git",
          "projectFile" : "https://github.com/akurey/AK-Projects-Single-Source/blob/main/Slack-Application/project-slack-ssot.md",
          "requirement": {
            "section" : "## Requirement"
          },
          "technical": {
            "section" : "## Technical"
          },
          "scope": {
            "section" : "## Scope"
          },
          "notes": {
            "section" : "## Notes"
          }
        }
      }
    }
  }
```

Notes:

* The name of the channels should be the exact name on the slack application and the AKUREY SOURCE application must be integrated to the channels in order to be able to post messages
* If AKUREY Source must send a direct message to someone on the workspace, the email must be provided under the `"people": []` section under notifications.


### Adding new action type

Add to the `actions` the new action name separated with commas:
```
"actions" : ["Requirement", "Technical", "Scope", "Notes", "NewActionName"]
```

This action must be added to all the projects notifications: (it's not cap sensitive)
```
"NewProject" : {
      "active" : true,
      "notifications" : {
        "requirement": {
          "channels": ["ak-website-design", "akurey-ssot"],
          "people": ["skopper@akurey.com", "jabarboza@akurey.com"]
        },
        "technical": {
          "channels": ["akurey-ssot"],
          "people": ["kafay.ng@akurey.com"]
        },
        "scope": {
          "channels": ["akurey-ssot"],
          "people": ["jabarboza@akurey.com", "kafay.ng@akurey.com"]
        },
        "notes": {
          "channels": ["akurey-ssot"],
          "people": ["skopper@akurey.com", "kafay.ng@akurey.com"]
        },
        "newActionName": {
          "channels": [],
          "people": []
        }
      },
```

And it also needs to be added inside the projects GitHub extensions and the md file title for each section must be defined: (it's not cap sensitive)

```
"extensions" : {
        "github": {
          "repository": "https://github.com/akurey/AK-Projects-Single-Source.git",
          "projectFile" : "https://github.com/akurey/AK-Projects-Single-Source/blob/main/Slack-Application/project-slack-ssot.md",
          "requirement": {
            "section" : "## Requirement"
          },
          "technical": {
            "section" : "## Technical"
          },
          "scope": {
            "section" : "## Scope"
          },
          "notes": {
            "section" : "## Notes"
          }
        }
```
Note: The md file which is being reference must exist, and it should already have the titles written.


### Define github extension

Under the project extension add `github` and define the repository link with .git gotten from GitHub HTTPS
![Screenshot 2023-04-27 at 11.11.59 AM.png](..%2F..%2F..%2F..%2F..%2F..%2Fvar%2Ffolders%2F_x%2F70_0g6s513l10xhb5tkc22pr0000gn%2FT%2FTemporaryItems%2FNSIRD_screencaptureui_6yjD27%2FScreenshot%202023-04-27%20at%2011.11.59%20AM.png)
And set the md file to be modified under `projectFile`:
```
"extensions" : {
        "github": {
          "repository": "https://github.com/akurey/AK-Projects-Single-Source.git",
          "projectFile" : "https://github.com/akurey/AK-Projects-Single-Source/blob/main/Slack-Application/project-slack-ssot.md",
```

### Add AKUREY Source application to the channels on Slack

1. Go to the desired channel (private or public) and go to the channels settings by clicking on the dropdown menu:
![Screenshot 2023-04-27 at 11.19.39 AM.png](..%2F..%2F..%2F..%2FDesktop%2FScreenshot%202023-04-27%20at%2011.19.39%20AM.png)

2. Go to `Integrations` tab and click on `Add an App`:
![Screenshot 2023-04-27 at 11.21.58 AM.png](..%2F..%2F..%2F..%2FDesktop%2FScreenshot%202023-04-27%20at%2011.21.58%20AM.png)
3. Search for AKUREY Source app and click on `Add`


### Deploying changes to AWS
As of the current version of the project, the secret tokens are managed locally instead of using another service so export the following tokens on the terminal:
```
export SLACK_BOT_TOKEN={token}
export GITHUB_TOKEN={token}
export SLACK_SIGNING_SECRET={token}
```
Note: contact Soledad Kopper or Jose Barboza for the tokens file.

After exporting the tokens, run:
```
serverless deploy
```