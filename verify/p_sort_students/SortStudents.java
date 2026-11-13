class Student {
    String name;
    double cgpa;
    Student(String name, double cgpa) {
        this.name = name;
        this.cgpa = cgpa;
    }
}

public class SortStudents {
    static void sortByCgpa(Student[] list) {
        for (int i = 0; i < list.length - 1; i++) {
            int maxIdx = i;
            for (int j = i + 1; j < list.length; j++) {
                if (list[j].cgpa > list[maxIdx].cgpa) {
                    maxIdx = j;
                }
            }
            Student temp = list[i];
            list[i] = list[maxIdx];
            list[maxIdx] = temp;
        }
    }

    public static void main(String[] args) {
        Student[] list = {
            new Student("Rafi", 3.45),
            new Student("Mitu", 3.92),
            new Student("Sami", 3.80),
            new Student("Tania", 3.10)
        };
        sortByCgpa(list);
        for (Student s : list) System.out.println(s.name + " " + s.cgpa);
    }
}
