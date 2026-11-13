class PizzaShop {
    private int pizza_price = 320, drink_price = 40, fries_price = 100;
    PizzaShop() { System.out.println("Welcome to pizza shop"); }
    void order(int pizzas) {
        System.out.println("You ordered " + pizzas + " pizzas");
        System.out.println("Total bill: " + (pizzas * pizza_price) + " taka");
    }
    void order(int pizzas, int drinks) {
        System.out.println("You ordered " + pizzas + " pizzas, " + drinks + " drinks");
        System.out.println("Total bill: " + (pizzas * pizza_price + drinks * drink_price) + " taka");
    }
    void order(int pizzas, int drinks, int fries) {
        System.out.println("You ordered " + pizzas + " pizzas, " + drinks + " drinks, " + fries + " fries");
        System.out.println("Total bill: " + (pizzas * pizza_price + drinks * drink_price + fries * fries_price) + " taka");
    }
}
class Order {
    public static void main(String[] args) {
        PizzaShop p = new PizzaShop();
        p.order(2, 4); p.order(1, 2, 1); p.order(3);
    }
}
