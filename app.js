// Require in node modules
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");
const validator = require("validator");

// Require in local files
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const render = require("./lib/htmlRenderer");

// Promisify the writeFile function
const writeFileAsync = util.promisify(fs.writeFile);

// Define the output directory and CSS output filepath
const OUTPUT_DIR = path.resolve(__dirname, "output");
const cssOutputPath = path.join(OUTPUT_DIR, "style.css");

// Define the template directory and CSS template filepath
const TEMPLATE_DIR = path.resolve(__dirname, "templates");
const cssTemplatePath = path.join(TEMPLATE_DIR, "style.css");

// Define a blank employees array
const employees = [];

// Define an async await function which creates a team profile HTML file based on user input
async function createTeamTemplate() {
    try {
        // Ask the user if they would like to generate a team profile HTML?
        const { continueYN } = await inquirer.prompt({
            type : "list",
            message : "Welcome to the team profile HTML generator. Would you like to generate a team profile web page? ",
            name : "continueYN",
            choices : ["Yes", "No"]
        });
        
        if (continueYN === "No") {
            console.log("Ok, well if you change your mind you know where to find me...");
            return;
        };
        
        // Ask the user what file name they would like
        let { fileName } = await inquirer.prompt({
            message : "Enter a file name for your new team profile page (do not include the .html file extension in the file name): ",
            name : "fileName"
        });
        
        // Concatenate .html file extension onto the end of the file name
        fileName += ".html";

        // Join the output directory with the file name
        const htmlOutputPath = path.join(OUTPUT_DIR, fileName);
        
        // Check if the 'output' folder exists and create it if it does not
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR);
        }
        
        // Else, check if there is an existing template file which may be overwritten.
        else if (fs.existsSync(htmlOutputPath)) {
            // Tell user this will overwrite existing template file. Ask if they want to continue
            const { stillContinueYN } = await inquirer.prompt({
                type : "list",
                message : `A file named ${fileName} already exists in the output folder.\nThis will be overwritten when you run this script.\nDo you want to continue? `, 
                name : "stillContinueYN",
                choices : ["Yes", "No"]                
            });
                
            if (stillContinueYN === "No") {
                console.log("Come back once you have backed up your existing file.");
                return;
            };
        }
        
        // Prompt the user to enter a team name
        const { teamName } = await inquirer.prompt({
            message : "Enter the name of your team: ",
            name : "teamName"
        });

                
        // Prompt the user to enter information about the manager
        const managerData = await inquirer.prompt([{
            message : "Enter the name of the team manager: ",
            name : "name"
        },
        {
            message : "Enter the manager's ID number: ",
            name : "id"
        },
        {
            message : "Enter the manager's office phone number: ",
            name : "officeNumber"
        },
        {
            message : "Enter the manager's email address: ",
            name : "email"
        }]);
        
        // Use the data entered by the user to create a new manager object using the Manager class
        const manager = new Manager(managerData.name, managerData.id, managerData.email, managerData.officeNumber);

        // Check if the user has entered a valid email address
        let trueEmail = validator.isEmail(manager.email);

        // If user has not entered a valid email address, ask them to enter a different one
        while (!trueEmail) {
            alternativeEmail = await inquirer.prompt({
                message : "The email address you entered was invalid. Please enter another one: ",
                name : "email"
            });
            trueEmail = validator.isEmail(alternativeEmail.email);
            manager.email = alternativeEmail.email;
        }

        // Push the newly created 'manager' object into the 'employees' array
        employees.push(manager);
        
        // Ask the user if they would like to add another team member or generate the HTML page
        let nextAction = await inquirer.prompt({
            type : "list",
            message : "What would you like to do next?", 
            name : "addOrGenerate",
            choices : ["Add another team member","Generate team profile HTML page"]                
        });
        
        while (nextAction.addOrGenerate === "Add another team member") {
            // Ask the user whether they would like to add an Engineer or Intern to the team
            let { newMemberType } = await inquirer.prompt({
                type : "list",
                message : "Select a type of team member: ", 
                name : "newMemberType",
                choices : ["Engineer","Intern"]
            });

            if (newMemberType === "Engineer") {
                // Prompt the user to enter information about the engineer
                let engineerData = await inquirer.prompt([{
                    message : "Enter the name of the engineer: ",
                    name : "name"
                },
                {
                    message : "Enter the engineer's ID number: ",
                    name : "id"
                },
                {
                    message : "Enter the engineer's email address: ",
                    name : "email"
                },
                {
                    message : "Enter the engineer's Github username: ",
                    name : "github"
                }]);
                    
                // Use the data entered by the user to create a new engineer object using the engineer class
                let engineer = new Engineer(engineerData.name, engineerData.id, engineerData.email, engineerData.github);
                
                // Push the newly created 'engineer' object into the 'employees' array
                employees.push(engineer);
            }

            else if (newMemberType === "Intern") {
                // Prompt the user to enter information about the engineer
                let internData = await inquirer.prompt([{
                    message : "Enter the name of the intern: ",
                    name : "name"
                },
                {
                    message : "Enter the intern's ID number: ",
                    name : "id"
                },
                {
                    message : "Enter the intern's email address: ",
                    name : "email"
                },
                {
                    message : "Enter the intern's school: ",
                    name : "school"
                }]);
                    
                // Use the data entered by the user to create a new intern object using the intern class
                let intern = new Intern(internData.name, internData.id, internData.email, internData.school);
                
                // Push the newly created 'intern' object into the 'employees' array
                employees.push(intern);
            }
            
            nextAction = await inquirer.prompt({
                type : "list",
                message : "What would you like to do next?", 
                name : "addOrGenerate",
                choices : ["Add another team member","Generate team profile HTML page"]                
            });
        }

        // After the user has input all employees, pass the 'employees' array into the render function
        const htmlContent = render(employees,teamName);

        // Now write it to a file named `team.html` in the output folder. 
        const htmlFile = await writeFileAsync(htmlOutputPath, htmlContent);
        
        // Create a copy of the style.css file
        const cssFile = await fs.copyFileSync(cssTemplatePath, cssOutputPath);
        
        // Display a message to say the file has been created
        console.log("Your team profile HTML file and style.css file were created successfully!");

    } catch (error) {
        console.log(error);
    }
}

// Call the createTeamTemplate function
createTeamTemplate();