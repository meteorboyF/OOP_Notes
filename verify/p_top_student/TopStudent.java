class Student {
    String name;
    double cgpa;
    Student(String name, double cgpa) {
        this.name = name;
        this.cgpa = cgpa;
    }
}

public class TopStudent {
    static Student topStudent(Student[] list) {
        Student best = list[0];
        for (Student s : list) {
            if (s.cgpa > best.cgpa) {
                best = s;
            }
        }
        return best;
    }

    public static void main(String[] args) {
        Student[] list = {
            new Student("Rafi", 3.45),
            new Student("Mitu", 3.92),
            new Student("Sami", 3.80)
        };
        Student top = topStudent(list);
        System.out.println(top.name + " " + top.cgpa);
    }
}
