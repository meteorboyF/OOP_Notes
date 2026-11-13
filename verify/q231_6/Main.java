class Cake {
    protected String name;
    protected double rate;
    public Cake(String n, double r) { name = n; rate = r; }
    public double calcPrice() { return 0; }
    public void printDetails() { System.out.println("Prints the detail."); }
}
class OrderCake extends Cake {
    double weight;
    public OrderCake(String n, double r, double w) { super(n, r); weight = w; }
    @Override
    public double calcPrice() { return rate * weight; }
    @Override
    public void printDetails() {
        System.out.println("Name: " + name);
        System.out.println("Rate: " + rate);
        System.out.println("Weight: " + weight);
        System.out.println("Total Price: " + calcPrice());
    }
}
class ReadymadeCake extends Cake {
    int quantity;
    public ReadymadeCake(String n, double r, int q) { super(n, r); quantity = q; }
    @Override
    public double calcPrice() { return rate * quantity; }
    @Override
    public void printDetails() {
        System.out.println("Name: " + name);
        System.out.println("Rate: " + rate);
        System.out.println("Quantity: " + quantity);
        System.out.println("Total Price: " + calcPrice());
    }
}
class Main {
    public static void main(String[] args) {
        Cake cake[];
        cake = new Cake[3];
        cake[0] = new OrderCake("OrderCake", 150, 3);
        cake[1] = new OrderCake("OrderCake", 120, 2.5);
        cake[2] = new ReadymadeCake("ReadymadeCake", 200, 2);
        for (int i = 0; i < cake.length; i++) {
            cake[i].printDetails();
        }
    }
}
