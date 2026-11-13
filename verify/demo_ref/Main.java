
class Student {
    String name;
    double cgpa;
    Student(String name, double cgpa) {
        this.name = name;
        this.cgpa = cgpa;
    }
}
public class Main {
    public static void main(String[] args) {
        Student s1 = new Student("Sam", 3.5);
        Student s2 = new Student("Rina", 3.9);
        Student s3 = s1;
        s3.cgpa = 4.0;
        System.out.println(s1.cgpa);
        s1 = null;
        s2 = s3;
    }
}
