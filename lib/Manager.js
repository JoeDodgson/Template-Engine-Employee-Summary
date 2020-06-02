// TODO: Write code to define and export the Manager class. HINT: This class should inherit from Employee.


class Manager extends Employee {
    constructor () {

    }

    getRole() {
        return "Manager";
    }

}

// Export the Manager class so that it can be required in by other files
module.exports = Manager;