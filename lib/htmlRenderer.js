// Require in all necessary modules
const path = require("path");
const fs = require("fs");

// Store templates directory as a variable
const templatesDir = path.resolve(__dirname, "../templates");


// Render function returns a string of HTML content using the employees array and teamName variables
const render = (employees, teamName) => {
  // Define an empty HTML array
  const html = [];
  const managers = [];
  const engineers = [];
  const interns = [];

  employees.forEach(employee => {
    switch (employee.getRole()) {
      case "Manager":
        managers.push(employee);
        break;
      case "Engineer":
        engineers.push(employee);
        break;
      case "Intern":
        interns.push(employee);
        break;
      default:
        console.log("Error with the sort Employees function");
    } 
  })
  const sortedEmployees = managers.concat(engineers, interns);

  // Filter by manager in employees array, map using the renderManager function and push into HTML array
  html.push(renderManager(managers[0]));
  
  // Read in the opening, closing and joining HTML script for Engineers
  const engineersOpeningHTML = fs.readFileSync(path.resolve(templatesDir, "engineers-opening.html"), "utf8");
  const engineersClosingHTML = fs.readFileSync(path.resolve(templatesDir, "engineers-closing.html"), "utf8");
  const joiningHTML = fs.readFileSync(path.resolve(templatesDir, "joining.html"), "utf8");
  
  html.push(engineersOpeningHTML);
  
  // Loop through each engineer
  for (let i = 0; i < engineers.length; i++) {
    html.push(renderEngineer(engineers[i]));
    // If the last engineer, then add the joining HTML between engineers and interns 
    if (i === engineers.length - 1) {
      html.push(engineersClosingHTML);
    }
    // Start a new container after every 3 engineers
    else if ((i + 1) % 3 === 0) {
      html.push(joiningHTML);
    }
  }

  // Read in the closing HTML script for Interns
  const internsClosingHTML = fs.readFileSync(path.resolve(templatesDir, "interns-closing.html"), "utf8");
  
  // Loop through each intern
  for (let i = 0; i < interns.length; i++) {
    html.push(renderIntern(interns[i]));
    // If the last intern, then add the closing HTML 
    if (i === interns.length - 1) {
      html.push(internsClosingHTML);
    }
    // Start a new container after every 3 interns
    else if ((i + 1) % 3 === 0) {
      html.push(joiningHTML);
    }
  }
    
  // Join HTML array elements into a string, feed into renderMain function with teamName and return the value
  return renderMain(html.join(""), teamName);

};

// renderManager returns a string of HTML content read from manager.html, replacing placeholders with values
const renderManager = manager => {
  // Read in manager.html file and store in template variable
  let template = fs.readFileSync(path.resolve(templatesDir, "manager.html"), "utf8");
  // Replace all placeholders in the template string using replacePlaceholders function
  template = replacePlaceholders(template, "name", manager.getName());
  template = replacePlaceholders(template, "role", manager.getRole());
  template = replacePlaceholders(template, "email", manager.getEmail());
  template = replacePlaceholders(template, "id", manager.getId());
  template = replacePlaceholders(template, "officeNumber", manager.getOfficeNumber());
  return template;
};

// renderEngineer returns a string of HTML content read from engineer.html, replacing placeholders with values
const renderEngineer = engineer => {
  // Read in engineer.html file and store in template variable
  let template = fs.readFileSync(path.resolve(templatesDir, "engineer.html"), "utf8");
  // Replace all placeholders in the template string using replacePlaceholders function
  template = replacePlaceholders(template, "name", engineer.getName());
  template = replacePlaceholders(template, "role", engineer.getRole());
  template = replacePlaceholders(template, "email", engineer.getEmail());
  template = replacePlaceholders(template, "id", engineer.getId());
  template = replacePlaceholders(template, "github", engineer.getGithub());
  return template;
};

// renderIntern returns a string of HTML content read from intern.html, replacing placeholders with values
const renderIntern = intern => {
  // Read in intern.html file and store in template variable
  let template = fs.readFileSync(path.resolve(templatesDir, "intern.html"), "utf8");
  // Replace all placeholders in the template string using replacePlaceholders function
  template = replacePlaceholders(template, "name", intern.getName());
  template = replacePlaceholders(template, "role", intern.getRole());
  template = replacePlaceholders(template, "email", intern.getEmail());
  template = replacePlaceholders(template, "id", intern.getId());
  template = replacePlaceholders(template, "school", intern.getSchool());
  return template;
};

// renderMain reads in main.html, replaces 'team name' placeholder with the value of teamName,
// replaces 'team' placeholder with the provided html and returns the result
const renderMain = (html, teamName) => {
  // Read in main.html file and store in template variable
  let template = fs.readFileSync(path.resolve(templatesDir, "main.html"), "utf8");
  // Replace placeholders in the template string using replacePlaceholders function
  template = replacePlaceholders(template, "team name", teamName);
  return replacePlaceholders(template, "team", html);
};

// replacePlaceholders replaces every occurrence of a placeholder with a value
const replacePlaceholders = (template, placeholder, value) => {
  const pattern = new RegExp("{{ " + placeholder + " }}", "gm");
  return template.replace(pattern, value);
};

// Export the render function for use in other files
module.exports = render;