class Logarithm {
    int b; double x;
    Logarithm() { }
    Logarithm(int b, double x) { this.b = b; this.x = x; }
    Logarithm(Logarithm other) { this(other.b, other.x); }
    double myfunc() { if (b == 0) return 0.0; return Math.log(x) / Math.log(b); }
}
public class Main {
    public static void main(String[] args) {
        Logarithm log1 = new Logarithm(2, 9);
        Logarithm log2 = new Logarithm(log1);
        Logarithm log3 = new Logarithm();
        System.out.println(log1.b + " " + log1.x + " " + log1.myfunc());
        System.out.println(log2.b + " " + log2.x + " " + log2.myfunc());
        System.out.println(log3.b + " " + log3.x + " " + log3.myfunc());
        System.out.println(Math.log(0) / Math.log(0));
    }
}
