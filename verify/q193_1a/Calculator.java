public class Calculator {
    int add(int a, int b) { return a + b; }
    double add(int a, double b) { return a + b; }
    double add(int a, double b, double c) { return a + b + c; }
    public static void main(String[] args) {
        Calculator c = new Calculator();
        System.out.println(c.add(2, 3)); System.out.println(c.add(2, 3.5)); System.out.println(c.add(2, 3.5, 4.5));
    }
}
