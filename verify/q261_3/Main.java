class Test {
    static int count = 0;
    int id = 1;
    static {
        count += 2;
        System.out.println("Static Block");
    }
    {
        count += 3;
        id += count;
        System.out.println("Instance Block");
    }
    Test() {
        count += 5;
        id += 2;
        System.out.println("Constructor");
    }
}
class Main {
    public static void main(String[] args) {
        Test t1 = new Test();
        Test t2 = new Test();
        Test t3 = t1;
        t2.count += 10;
        t3.id += 5;
        System.out.println("t1-count = " + t1.count + ", t1-id = " + t1.id);
        System.out.println("t2-count = " + t2.count + ", t2-id = " + t2.id);
        System.out.println("t3-count = " + t3.count + ", t3-id = " + t3.id);
    }
}
