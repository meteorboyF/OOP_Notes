
class Box {
    int v;
}
public class Main {
    static void change(int n, Box b) {
        n = 99;
        b.v = 99;
        b = new Box();
        b.v = -1;
    }
    public static void main(String[] args) {
        int n = 1;
        Box box = new Box();
        box.v = 1;
        change(n, box);
        System.out.println(n + " " + box.v);
    }
}
