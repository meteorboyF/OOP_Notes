public class E {
    int a;
    public int getA() { return a; }
    public void setA(int a) { a = a; }
    E show() { return this; }
    public static void main(String[] args) {
        E obj = new E();
        obj.setA(10);
        System.out.println(obj.getA());
        E obj2 = obj.show();
        System.out.println(obj2.getA());
        // OR part
        int a = 10;
        double b = 5;
        String c = "Bazinga";
        System.out.println(a + b + c);
        System.out.println(c + a + b);
        System.out.println(b + a + c);
    }
}
