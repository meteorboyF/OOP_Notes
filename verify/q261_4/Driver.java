class Employee {
    String problem;
    void assignProblem(String problem) { this.problem = problem; }
}
class Manager extends Employee {
    void solveProblem() { System.out.println("Manager is solving " + this.problem); }
}
class Engineer extends Employee {
    void solveProblem() { System.out.println("Engineer is solving " + this.problem); }
}
public class Driver {
    static void solveProblem(Employee[] employeeList) {
        for (Employee emp : employeeList) {
            if (emp instanceof Manager) {
                ((Manager) emp).solveProblem();
            } else if (emp instanceof Engineer) {
                ((Engineer) emp).solveProblem();
            }
        }
    }
    public static void main(String[] args) {
        Manager m = new Manager();
        m.assignProblem("Budget planning issue");
        Engineer e = new Engineer();
        e.assignProblem("Server bug");
        Employee[] employeeList = {m, e};
        solveProblem(employeeList);
    }
}
