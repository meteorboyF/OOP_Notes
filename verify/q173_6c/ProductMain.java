class Product { String name; float price; Product(String name, float price) { this.name = name; this.price = price; } }
public class ProductMain { public static void main(String[] args) { Product p = new Product("F", 1000); System.out.println(p.name + " " + p.price); } }
