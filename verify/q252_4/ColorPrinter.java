class Printer {
    private String brand;
    public Printer(String brand) { this.brand = brand; }
    public void print(String doc) { System.out.println("Printing document: " + doc); }
    public void print(String doc, int copies) {
        System.out.println("Printing " + copies + " copies of the document: " + doc);
        for (int i = 1; i <= copies; i++) System.out.println("Printing copy " + i);
    }
}
public class ColorPrinter extends Printer {
    private String color;
    public ColorPrinter(String brand, String color) { super(brand); this.color = color; }
    @Override
    public void print(String doc) { super.print(doc); System.out.println(color + " Color mode enabled"); }
    public static void main(String[] args) {
        Printer p = new Printer("Epson");
        p.print("Assignment.pdf", 3);
        ColorPrinter cp = new ColorPrinter("Canon", "Red");
        cp.print("Report.pdf");
    }
}
