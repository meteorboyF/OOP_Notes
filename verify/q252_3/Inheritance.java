class Person {
    protected String name;
    private int age;
    public Person(String name, int age) { this.name = name; setAge(age); }
    public int getAge() { return age; }
    public void setAge(int age) { if (age >= 0) this.age = age; else System.out.println("Age cannot be negative"); }
}
class Student extends Person {
    private String studentId;
    public Student(String name, int age, String studentId) { super(name, age); this.studentId = studentId; }
    public String getStudentId() { return studentId; }
}
class GraduateStudent extends Student {
    private String thesisTitle;
    public GraduateStudent(String name, int age, String studentId, String thesisTitle) { super(name, age, studentId); this.thesisTitle = thesisTitle; }
    public String getThesisTitle() { return thesisTitle; }
    public void setThesisTitle(String t) { thesisTitle = t; }
}
public class Inheritance {
    public static void main(String[] args) {
        Student student = new Student("Harun", 17, "S102");
        GraduateStudent graduateStudent = new GraduateStudent("Alif", 23, "S123", "AI in Healthcare");
        graduateStudent.setAge(25);
        graduateStudent.setThesisTitle("AI in Cybersecurity");
        System.out.println(graduateStudent.getAge());
        System.out.println(graduateStudent.getStudentId());
        System.out.println(graduateStudent.getThesisTitle());
    }
}
