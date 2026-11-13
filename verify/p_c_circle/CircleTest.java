
class Circle {
    double radius;

    Circle(double radius) {
        this.radius = radius;
    }
    double area() {
        return Math.PI * radius * radius;
    }
    double circumference() {
        return 2 * Math.PI * radius;
    }
}
public class CircleTest {
    public static void main(String[] args) {
        Circle c1 = new Circle(7);
        Circle c2 = new Circle(2.5);
        System.out.printf("r = %.1f: area = %.2f, circumference = %.2f%n", c1.radius, c1.area(), c1.circumference());
        System.out.printf("r = %.1f: area = %.2f, circumference = %.2f%n", c2.radius, c2.area(), c2.circumference());
    }
}
