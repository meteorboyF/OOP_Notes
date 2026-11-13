public class Grader {
    String name, id; double payPerAssignment; private int count;
    public Grader(String name, String id, double payPerAssignment) { this.name = name; this.id = id; this.payPerAssignment = payPerAssignment; }
    public int getCount() { return count; } public void setCount(int count) { this.count = count; }
    void printEarnings() { System.out.println(name + " earned " + (count * payPerAssignment)); }
    public static void main(String[] args) { Grader g = new Grader("Rafi", "011201001", 50); g.setCount(12); g.printEarnings(); }
}
