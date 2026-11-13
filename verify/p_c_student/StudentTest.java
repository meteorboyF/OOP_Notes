
class Student {
    String name;
    String roll;
    double[] marks;

    Student(String name, String roll, double[] marks) {
        this.name = name;
        this.roll = roll;
        this.marks = marks;
    }
    double total() {
        double sum = 0;
        for (double m : marks) {
            sum += m;
        }
        return sum;
    }
    double average() {
        return total() / marks.length;
    }
}
public class StudentTest {
    public static void main(String[] args) {
        Student s1 = new Student("Ayan", "011221001", new double[]{78, 85.5, 92});
        Student s2 = new Student("Bristy", "011221002", new double[]{66, 74, 80, 90});
        System.out.println(s1.name + " total = " + s1.total() + ", average = " + s1.average());
        System.out.println(s2.name + " total = " + s2.total() + ", average = " + s2.average());
    }
}
