class Myobject {
    private double r;
    Myobject(double r) { this.r = r; }
    public double getR() { return r; }
    public double findVolume() { return -1.0; }
}
class Sphere extends Myobject {
    Sphere(double r) { super(r); }
    public double findVolume() { return 4.0 / 3.0 * Math.PI * Math.pow(getR(), 3); }
}
class Cylinder extends Myobject {
    private double h;
    Cylinder(double r, double h) { super(r); this.h = h; }
    public double getH() { return h; }
    public double findVolume() { return Math.PI * getR() * getR() * h; }
}
class Cone extends Cylinder {
    Cone(double r, double h) { super(r, h); }
    public double findVolume() { return Math.PI * getR() * getR() * getH() / 3.0; }
}
public class Main {
    public static void main(String[] args) {
        Myobject[] shapes = new Myobject[5];
        shapes[0] = new Sphere(2.5);
        shapes[1] = new Cone(1.9, 8.9);
        shapes[2] = new Cylinder(1.5, 6.5);
        shapes[3] = new Cone(2.7, 5.7);
        shapes[4] = new Sphere(3.5);
        double total = 0;
        for (Myobject m : shapes) {
            double v = m.findVolume();
            System.out.printf("%.2f%n", v);
            total += v;
        }
        System.out.printf("Total volume = %.2f%n", total);
    }
}
