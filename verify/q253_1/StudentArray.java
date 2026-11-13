import java.util.Scanner;
class Student {
    String name;
    int id;
    double cgpa;
    Student(String name, int id, double cgpa) {
        this.name = name;
        this.id = id;
        this.cgpa = cgpa;
    }
}
public class StudentArray {
    public static void main(String[] args) {
        Scanner scn = new Scanner(System.in);
        Student[][] students = new Student[3][];
        students[0] = new Student[2];
        students[1] = new Student[1];
        students[2] = new Student[3];
        for (int i = 0; i < students.length; i++) {
            for (int j = 0; j < students[i].length; j++) {
                String name = scn.next();
                int id = scn.nextInt();
                double cgpa = scn.nextDouble();
                students[i][j] = new Student(name, id, cgpa);
            }
        }
        scn.close();
        for (Student[] row : students) {
            for (Student s : row) System.out.print(s.name + "(" + s.id + ", " + s.cgpa + ") ");
            System.out.println();
        }
    }
}
