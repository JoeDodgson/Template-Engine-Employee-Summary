// Require in all necessary modules
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const render = require("./lib/htmlRenderer");

// Define the output directory
const OUTPUT_DIR = path.resolve(__dirname, "output")

// Move this declaration to within the user prompt, after the user has specified a file name
const outputPath = path.join(OUTPUT_DIR, "team.html");

const team = {
    manager : {},
    engineers : [],
    interns : []
};

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
        const { fileName } = await inquirer.prompt({
            message : "Enter a file name for your new team profile page (do not include the .html file extension in the file name): ",
            name : "fileName"
        });
        
        const filePath = `./output/${fileName}.html`;
        
        // Check if there is an existing template file which may be overwritten.
        if(fs.existsSync(filePath)) {
            // Tell user this will overwrite existing template file. Ask if they want to continue
            const { stillContinueYN } = await inquirer.prompt({
                type : "list",
                message : `A file named ${fileName}.html already exists in the output folder.\nThis will be overwritten when you run this script.\nDo you want to continue? `, 
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
            message : "Enter the manager's email address: ",
            name : "email"
        },
        {
            message : "Enter the manager's office phone number: ",
            name : "officeNumber"
        }]);
        
        // Use the data entered by the user to create a new manager object using the Manager class
        const manager = new Manager(managerData.name, managerData.id, managerData.email, managerData.officeNumber);
        
        // Set the 'manager' property of the 'team' object to the newly created manager object
        team.manager = manager;
        
        // Ask the user if they would like to add another team member or generate the HTML page
        let { addOrGenerate } = await inquirer.prompt({
            type : "list",
            message : "What would you like to do next?", 
            name : "addOrGenerate",
            choices : ["Add another team member","Generate team profile HTML page"]                
        });
        
        while (addOrGenerate === "Add another team member") {
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
                
                // Set the 'engineer' property of the 'team' object to the newly created engineer object
                team.engineers.push(engineer);
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
                
                // Set the 'intern' property of the 'team' object to the newly created intern object
                team.interns.push(intern);
            }
            
            addOrGenerate = { addOrGenerate } = await inquirer.prompt({
                type : "list",
                message : "What would you like to do next?", 
                name : "addOrGenerate",
                choices : ["Add another team member","Generate team profile HTML page"]                
            });
        }
        
        // After the user has input all employees desired, call the `render` function (required
        // above) and pass in an array containing all employee objects; the `render` function will
        // generate and return a block of HTML including templated divs for each employee!
        // ----------------​
        // After you have your html, you're now ready to create an HTML file using the HTML
        // returned from the `render` function. Now write it to a file named `team.html` in the
        // `output` folder. You can use the variable `outputPath` above target this location.
        // Hint: you may need to check if the `output` folder exists and create it if it
        // does not.
        
        // // Give a message to tell the user the file has been created.
        // console.log("Your team profile HTML file was created successfully!");

    } catch (error) {
        console.log(error);
    }
}

// Call the createTeamTemplate function
createTeamTemplate();


// // Create a team profile HTML file and write the content based on user input
// const htmlContent = 
// `# ${answers.title}\n\n## Table of contents:\n1. Description\n2. Installation\n3. Usage\n4. Author\n5. Contributing\n6. License\n7. Tests\n8. Contact\n\n## 1. Description:\n${answers.description}\n\n## 2. Installation:\n${answers.installation}\n\n## 3. Usage:\n${answers.usage}\n\n## 4. Author:\n${answers.name}\nGithub username: ${answers.username}\n<img src="${data.avatar_url}">\n\n## 5. Contributing:\n${answers.contributing}\n\n## 6. License:\n\n${licenseShieldMD}\n\n## 7. Tests:\nThe project passed the following tests:\n${answers.tests}\n\n## 8. Contact:\nFor any questions about this project, please contact ${answers.name} at the following email address:\n${email.address}`;

// const file = await writeFileAsync(filePath, htmlContent);