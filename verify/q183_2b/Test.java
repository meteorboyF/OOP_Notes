class Simple {
    static int a = 5; static int b = 6; private int x = 5; private int data = 100;
    static void sum() { System.out.println(a + b); }
    public int getData() { return data; }
}
class Test {
    public static void main(String[] args) { Simple s = new Simple(); Simple.sum(); System.out.println(s.getData()); }
}
