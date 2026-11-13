class Marks {
    String id; double quizMark, midMark, finalMark;
    Marks(String id, double quizMark, double midMark, double finalMark) { this.id = id; this.quizMark = quizMark; this.midMark = midMark; this.finalMark = finalMark; }
    void passedOrNot() { double total = quizMark + midMark + finalMark; if (total >= 55) System.out.println("passed"); else System.out.println("failed"); }
}
public class Run {
    public static void main(String[] args) {
        Marks m1 = new Marks("011221001", 15, 20, 30);
        Marks m2 = new Marks("011221002", 5, 10, 20);
        m1.passedOrNot(); m2.passedOrNot();
    }
}
