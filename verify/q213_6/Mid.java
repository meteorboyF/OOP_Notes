abstract class Item {
    String name;
    double unit_price;
    Item(String name, double unit_price) {
        this.name = name;
        this.unit_price = unit_price;
    }
    void printItemDetails() {
        System.out.println("Itemname: " + name + " Unit-price: " + unit_price);
    }
    abstract double calculatePrice();
}
class WeightedItem extends Item {
    double weight;
    WeightedItem(String name, double weight, double unit_price) {
        super(name, unit_price);
        this.weight = weight;
    }
    double calculatePrice() {
        return weight * unit_price;
    }
}
class CountableItem extends Item {
    int quantity;
    CountableItem(String name, int quantity, double unit_price) {
        super(name, unit_price);
        this.quantity = quantity;
    }
    double calculatePrice() {
        return quantity * unit_price;
    }
}
public class Mid {
    public static double calculateTotalPrice(Item[] items) {
        double total = 0.0;
        for (Item item : items) {
            total += item.calculatePrice();
        }
        return total;
    }
    public static void main(String[] args) {
        Item[] items = new Item[3];
        items[0] = new WeightedItem("Rice", 10.0, 70.0);
        items[1] = new CountableItem("Egg", 12, 11.0);
        items[2] = new WeightedItem("Chicken", 0.7, 250.0);
        System.out.println("Total Price: " + calculateTotalPrice(items));
    }
}
