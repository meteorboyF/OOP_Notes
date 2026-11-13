class A {
    int a = 3;
    static int cnt = 5;
    A() {
        this(6);
        a = a + cnt;
        System.out.println("A(): no-arg");
    }
    A(int a) {
        this.a = a;
        cnt++;
        System.out.println("A(int)");
    }
    {
        a = 9;
        System.out.println("A: instance block");
    }
    static {
        cnt = 10;
        System.out.println("A: static block");
    }
    void display() {
        System.out.println("A - a = " + a + ", cnt = " + cnt);
    }
}
public class B {
    static int cnt;
    static {
        System.out.println("B: static block");
    }
    B() {
        cnt++;
        System.out.println("B() - no arg");
    }
    void show() {
        System.out.println("B - cnt = " + cnt);
    }
    public static void main(String[] args) {
        System.out.println("--- main ---");
        B b1 = new B();
        A a1 = new A();
        a1.display();
        b1.show();
        A a2 = new A(5);
        a2.display();
    }
}
