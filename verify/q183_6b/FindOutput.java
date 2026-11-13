class Example {
    static int a = 5;
    int b = 10;
}
public class FindOutput {
    public static void main(String[] args) {
        Example e1 = new Example();
        Example e2 = new Example();
        e1.a = 10;
        e1.b = 30;
        System.out.println(e2.a);
        System.out.println(e2.b);
        System.out.println("Sum: " + 2 + 3);
        System.out.println('a' + 2);
    }
}
