class Fruit {
    private String name; private double weight; private double pricePerKG;
    Fruit(String name, double weight, double pricePerKG) { this.name = name; this.weight = weight; this.pricePerKG = pricePerKG; }
    void reducePricePerKG(double amount) { pricePerKG -= amount; }
    void increasePricePerKG(double amount) { pricePerKG += amount; }
    void printDetails() {
        System.out.println("Fruit Details:"); System.out.println("Name: " + name);
        System.out.println("Weight: " + weight + "kg"); System.out.println("Price per kg: " + pricePerKG);
        System.out.println("Total price: " + (weight * pricePerKG));
    }
}
public class FruitShop {
    public static void main(String[] args) {
        Fruit fruit1 = new Fruit("Apple", 3.5, 110); Fruit fruit2 = new Fruit("Mango", 5, 90);
        fruit1.reducePricePerKG(10); fruit2.increasePricePerKG(20);
        fruit1.printDetails(); fruit2.printDetails();
    }
}
