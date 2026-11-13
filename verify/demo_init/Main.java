
class Demo {
    static int count = 0;
    int x = 1;
    static {
        System.out.println("static block, count = " + count);
    }
    {
        x = x + 10;
        System.out.println("instance block, x = " + x);
    }
    Demo() {
        this(5);
        System.out.println("Demo(), x = " + x);
    }
    Demo(int v) {
        x = x + v;
        count++;
        System.out.println("Demo(int), x = " + x);
    }
}
public class Main {
    public static void main(String[] args) {
        System.out.println("main starts");
        Demo d = new Demo();
        Demo e = new Demo(100);
    }
}
