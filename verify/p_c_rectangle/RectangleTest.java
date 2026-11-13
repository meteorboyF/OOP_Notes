
class Rectangle {
    double length;
    double width;

    Rectangle(double length, double width) {
        this.length = length;
        this.width = width;
    }
    double area() {
        return length * width;
    }
    double perimeter() {
        return 2 * (length + width);
    }
}
public class RectangleTest {
    public static void main(String[] args) {
        Rectangle r1 = new Rectangle(5, 3);
        Rectangle r2 = new Rectangle(2.5, 4);
        System.out.println("r1: area = " + r1.area() + ", perimeter = " + r1.perimeter());
        System.out.println("r2: area = " + r2.area() + ", perimeter = " + r2.perimeter());
    }
}
