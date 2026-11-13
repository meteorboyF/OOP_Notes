class Shape {
    protected String className = "Shape";
    String getClassName() { return this.className; }
}
class Rectangle extends Shape {
    double width, height;
    Rectangle(double width, double height) {
        this.className = "Rectangle";
        this.width = width;
        this.height = height;
    }
    protected double getArea() { return width * height; }
}
class Square extends Rectangle {
    Square(double side) { super(side, side); }
    @Override
    String getClassName() { return "Square"; }
}
public class Main {
    public static void main(String[] args) {
        Shape godel = new Shape();
        Shape escher = new Rectangle(2, 3);
        Rectangle bach = new Square(4);
        System.out.println("1: " + godel.getClassName());
        System.out.println("2: " + escher.getClassName());
        System.out.println("3: " + bach.getClassName());
        System.out.println("4: " + ((Shape) escher).getClassName());
        try {
            System.out.println("5: " + ((Square) escher).getClassName());
        } catch (ClassCastException e) {
            System.out.println("5: ERROR, ClassCastException");
        }
        System.out.println("6: " + ((Square) bach).getClassName());
        Shape[] shapeArray = {godel, escher, bach};
        printTotalArea(shapeArray);
    }
    static void printTotalArea(Shape[] shapesArray) {
        double totalArea = 0;
        for (Shape s : shapesArray) {
            if (s instanceof Rectangle) {
                totalArea += ((Rectangle) s).getArea();
            }
        }
        System.out.println("Total Area is: " + totalArea);
    }
}
