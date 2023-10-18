const fs = require('fs');
const inputData = require('./issue.json');
var extractedData = {};

if (inputData["repository-configuration"] &&
  inputData["repository-configuration"].content &&
  inputData["repository-configuration"].content[0] !== undefined) {
  ExtractDataFromJson();
}
else {
  // Extract the content of the "organization-name" and "repository-name" fields
  ExtractDataFromIssueTemplate();
}
fs.writeFileSync('./extracted-data.json', JSON.stringify(extractedData, null, 2));

function ExtractDataFromIssueTemplate() {
  // Extract the content of the "organization-name" and "repository-name" fields
  extractedData = {
    "org_name": inputData["organization-name"]["text"],
    "repo_name": inputData["repository-name"]["text"]
  };

  // Organization properties  
  const billingEmail = inputData["billing-email"]["text"]?.replace(/</g, "").replace(/>/g, "");
  const defaultRepositoryPermission = inputData["default-repository-permissions"]["content"][0];
  const defaultRepositoryVisibility = inputData["default-repository-visibility"]["content"][0];
  const membersCanCreateRepositories = inputData["members-can-create-repositories"]["content"][0];

  // Extract the content of the "enable-issues", "enable-wiki", and "enable-projects" fields
  const enableIssuesContent = inputData["enable-issues"]["content"][0];
  const enableWIKIContent = inputData["enable-wiki"]["content"][0];
  const enableProjectsContent = inputData["enable-projects"]["content"][0];
  const enableDiscussions = inputData["enable-discussions"]["content"][0];
  const issueassignee = inputData["issue-assignee"]["text"];
  const homepage = inputData["homepage"]["text"]?.replace(/</g, "").replace(/>/g, "");
  const description = inputData["description"]["text"];
  const labelName = inputData["issue-labels"]["text"];
  const topics = inputData["topics"]["text"];

  // Add the extracted content to the extractedData object
  if (enableIssuesContent !== "None") {
    extractedData["has_issues"] = enableIssuesContent.toLowerCase();
  }
  if (enableWIKIContent !== "None") {
    extractedData["has_wiki"] = enableWIKIContent.toLowerCase();
  }
  if (enableProjectsContent !== "None") {
    extractedData["has_projects"] = enableProjectsContent.toLowerCase();
  }
  if (enableDiscussions !== "None") {
    extractedData["has_discussions"] = enableDiscussions.toLowerCase();
  }
  if (issueassignee !== "*No response*") {
    const assigneesArray = issueassignee.split(',').map(item => item.trim());
    const assigneesJSON = JSON.stringify(assigneesArray);
    extractedData["assignees"] = assigneesJSON;
  }
  if (homepage !== "*No response*") {
    extractedData["homepage"] = homepage;
  }
  if (description !== "*No response*") {
    extractedData["description"] = description;
  }
  if (topics !== "*No response*") {
    extractedData["topics"] = topics;
  }
  if (labelName !== "*No response*") {
    extractedData["labelName"] = labelName;
  }
  // Binding Organization properties  
  if (billingEmail !== "*No response*") {
    extractedData["billing_email"] = billingEmail;
  }
  if (defaultRepositoryPermission !== "None") {
    extractedData["default_repository_permission"] = defaultRepositoryPermission.toLowerCase();
  }
  if (defaultRepositoryVisibility !== "None") {
    extractedData["default_repository_visibility"] = defaultRepositoryVisibility.toLowerCase();
  }
  if (membersCanCreateRepositories !== "None") {
    extractedData["members_can_create_repositories"] = membersCanCreateRepositories.toLowerCase();
  }
}

function ExtractDataFromJson() {
  extractedData = inputData["repository-configuration"].content[0];
  extractedData = extractedData.replace(/\\+/g, '');
  extractedData = extractedData.replace('"[', '');
  extractedData = extractedData.replace(']"', '');
  extractedData = JSON.parse(extractedData);
  //Bind the data to the extractedData object
  extractedData["org_name"] = extractedData.org_name;
  extractedData["repo_name"] = extractedData.repo_name;
  extractedData["has_issues"] = extractedData.has_issues;
  extractedData["has_wiki"] = extractedData.has_wiki;
  extractedData["has_projects"] = extractedData.has_projects;
  extractedData["has_discussions"] = extractedData.has_discussions;
  extractedData["homepage"] = extractedData.homepage;
  extractedData["description"] = extractedData.description;
  extractedData["labelName"] = extractedData.labelName;
  if (extractedData.topics !== undefined && extractedData.topics !== null) {
    extractedData["topics"] = extractedData.topics;
  }
  if (extractedData.assignees !== undefined && extractedData.assignees !== null) {
    const assigneesArray = extractedData.assignees.split(',').map(item => item.trim());
    const assigneesJSON = JSON.stringify(assigneesArray);
    extractedData["assignees"] = assigneesJSON;
  }
  extractedData["allow_squash_merge"] = extractedData.allow_squash_merge;
  extractedData["allow_merge_commit"] = extractedData.allow_merge_commit;
  extractedData["allow_rebase_merge"] = extractedData.allow_rebase_merge;
  extractedData["delete_branch_on_merge"] = extractedData.delete_branch_on_merge;
  extractedData["allow_auto_merge"] = extractedData.allow_auto_merge;
  console.log(extractedData);
}

