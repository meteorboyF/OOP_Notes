class Item {
    String name;
    double price;
    public double getPrice() {
        return price;
    }
}
class DiscountedItem extends Item {
    double discount;
    DiscountedItem(String name, double price, double discount) {
        this.name = name;
        this.price = price;
        this.discount = discount;
    }
    public double getPrice() {
        return price - price * discount / 100;
    }
}
class Shop {
    public static void main(String[] args) {
        Item[] items = new Item[5];
        items[0] = new DiscountedItem("Pen", 100, 5);
        items[1] = new DiscountedItem("Bag", 1500, 10);
        items[2] = new DiscountedItem("Shoe", 2000, 20);
        items[3] = new DiscountedItem("Cap", 400, 0);
        items[4] = new DiscountedItem("Book", 600, 50);
        double total = 0;
        for (Item it : items) {
            total += it.getPrice();
        }
        System.out.println("Total sales: " + total);
    }
}
