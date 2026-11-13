class TV {
    int id;
    String brandName;
    double marketValue;
    TV(int id, String brandName, double marketValue) {
        this.id = id;
        this.brandName = brandName;
        this.marketValue = marketValue;
    }
    void updatePrice(double value) { marketValue = value; }
}
class Refrigerator extends TV {
    Refrigerator(int id, String brandName, double marketValue) { super(id, brandName, marketValue); }
}
public class Main {
    public static void main(String[] args) {
        TV rA = new Refrigerator(1, "Samsung", 40000.0);
        TV rB = new Refrigerator(2, "Sony", 38000.0);
        TV rC;
        rC = rB;
        rB = new TV(5, "Walton", 30000.0);
        rC = rA;
        rA = new TV(2, "LG", 42000.0);
        rB.updatePrice(rC.marketValue);
        System.out.println(rA.id + " " + rB.id + " " + rC.id);
        rA = rB;
    }
}
