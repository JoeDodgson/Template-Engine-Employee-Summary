// TODO: Write code to define and export the Employee class

class Employee {
    constructor (name = "Anon", id = "N/A", email = "N/A") {
        this.name = name;
        this.id = id;
        this.email = email;
    }

    getName() {
        return this.name;
    }
    
    getId() {
        return this.id;
    }
    
    getEmail() {
        return this.email;
    }

    getRole() {
        return "Employee";
    }
}

// Export the Employee class so that it can be required in by other files
module.exports = Employee;