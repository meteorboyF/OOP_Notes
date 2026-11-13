
class Employee {
    int id;
    String name;
    double salary;

    Employee(int id, String name, double salary) {
        this.id = id;
        this.name = name;
        this.salary = salary;
    }
    void raiseSalary(double percent) {
        salary += salary * percent / 100;
    }
    void display() {
        System.out.println(id + " " + name + ": " + salary);
    }
}
public class EmployeeTest {
    public static void main(String[] args) {
        Employee e1 = new Employee(101, "Nadia", 50000);
        Employee e2 = new Employee(102, "Tamim", 40000);
        e1.raiseSalary(10);
        e2.raiseSalary(5);
        e2.raiseSalary(5);
        e1.display();
        e2.display();
    }
}
