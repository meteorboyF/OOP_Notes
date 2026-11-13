public class Student {
    private String name, id; private double cgpa;
    public Student(String id, String name, double cgpa) { this.id = id; this.name = name; this.cgpa = cgpa; }
    public String toString() { return id + " " + name + " " + cgpa; }
    static void swap(Student a, Student b) {
        String tId = a.id, tName = a.name; double tCgpa = a.cgpa;
        a.id = b.id; a.name = b.name; a.cgpa = b.cgpa; b.id = tId; b.name = tName; b.cgpa = tCgpa;
    }
    public static void main(String[] args) {
        Student s1 = new Student("011162101", "Kratos", 3.0); Student s2 = new Student("011162102", "Thanos", 4.0);
        System.out.println("Before swap"); System.out.println(s1); System.out.println(s2);
        swap(s1, s2);
        System.out.println("After swap"); System.out.println(s1); System.out.println(s2);
    }
}
