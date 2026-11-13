class Test {
    static int a = 1;
    int b = 2;
    int c;
    void update(Test obj) {
        this.a++;
        b++;
        obj.c++;
    }
}
public class TestMain {
    public static void main(String[] args) {
        Test obj1 = new Test();
        System.out.println("obj1.a:" + obj1.a);
        System.out.println("obj1.b:" + obj1.b);
        System.out.println("obj1.c:" + obj1.c);
        Test obj2 = new Test();
        obj2.update(obj1);
        System.out.println("obj1.a:" + obj1.a);
        System.out.println("obj1.b:" + obj1.b);
        System.out.println("obj1.c:" + obj1.c);
        obj2 = obj1;
        obj2.update(obj1);
        System.out.println("obj2.a:" + obj2.a);
        System.out.println("obj2.b:" + obj2.b);
        System.out.println("obj2.c:" + obj2.c);
    }
}
