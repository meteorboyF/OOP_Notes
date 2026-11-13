public class Area {
    private int length; private int width;
    { System.out.println("The area A of a rectangle is given by the formula, A=lw, where l is the length and w is the width."); }
    public Area(int length, int width) { this.length = length; this.width = width; }
    public int returnArea() { return length * width; }
    public static void main(String[] args) { Area a = new Area(5, 4); System.out.println("Area: " + a.returnArea()); }
}
