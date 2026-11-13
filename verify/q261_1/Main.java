class Asset {
    private static int nextId = 1001;
    String assetType; private float price; int id; String tradersName = "";
    Asset(String assetType, float price) { this.assetType = assetType; this.price = price; this.id = nextId++; }
    public float getPrice() { return price; } public void setPrice(float price) { this.price = price; }
}
class Trader {
    String name; String department; float aum = 0.0f;
    Trader(String name) { this(name, "Bond"); }
    Trader(String name, String department) { this.name = name; this.department = department; }
    void assign(Asset asset) {
        if (department.equals(asset.assetType)) { aum += asset.getPrice(); asset.tradersName = name; }
        else System.out.println("Department Mismatch");
    }
}
class Main {
    public static void main(String[] args) {
        Trader bond_trader = new Trader("Borsha");
        Trader stock_trader = new Trader("Shondha", "Stock");
        Asset stock = new Asset("Stock", 7000);
        bond_trader.assign(stock); stock_trader.assign(stock);
        System.out.println("Name: " + stock_trader.name + ", AUM: " + stock_trader.aum);
        System.out.println("Asset ID: " + stock.id + ", Trader: " + stock.tradersName);
    }
}
