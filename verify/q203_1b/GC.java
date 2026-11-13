class Garbage {
    int val;
    Garbage(int a) { val = a; }
    void update(Garbage a) { this.val = a.val; }
}
public class GC {
    public static void main(String[] args) {
        Garbage g1 = new Garbage(1);
        new Garbage(2);
        g1.update(new Garbage(3));
        System.out.println(g1.val);
    }
}
