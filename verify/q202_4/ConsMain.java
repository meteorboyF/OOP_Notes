class Currency {
    public String country;
    public double amount = 2000.0;
    public boolean isAvailable;
    public Currency() { }
    public Currency(boolean isAvailable) { this.isAvailable = isAvailable; }
    public Currency(double val) { amount = val; }
    public void addVal(double c) { amount += c; }
    public void addAmount(double c, double amount) { amount += c; }
    public double getAmount() { return amount; }
}
public class ConsMain {
    public static void main(String[] args) {
        Currency X = new Currency();
        Currency Y = new Currency(1000.0);
        Currency Z = new Currency(true);
        X.addVal(5000.0);
        Y.amount += 2000.0;
        Z.addAmount(3000.0, 1000.0);
        System.out.println(X.getAmount() + " " + X.isAvailable);
        System.out.println(Y.getAmount() + " " + Y.isAvailable);
        System.out.println(Z.getAmount() + " " + Z.isAvailable);
    }
}
