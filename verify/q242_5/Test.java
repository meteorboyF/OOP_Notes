class Shape { void draw() { System.out.println("drawing..."); } }
class Rectangle extends Shape { void draw() { System.out.println("drawing rectangle..."); } }
class Circle extends Shape { void draw() { System.out.println("drawing circle..."); } }
class Triangle extends Shape { void draw() { System.out.println("drawing triangle..."); } }
public class Test {
    public static void main(String[] args) {
        Shape[] s = new Shape[3];
        s[0] = new Rectangle();
        s[1] = new Circle();
        s[2] = new Triangle();
        for (int i = 0; i < s.length; i++) {
            s[i].draw();
        }
    }
}
