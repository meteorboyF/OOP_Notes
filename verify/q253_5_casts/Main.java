class Demon {
    public String name;
    public int rank;
    public String category = "Demon";
    public Demon(String name) { this.name = name; }
    public void summon() { System.out.println("Muzan summoned " + category + " " + rank); }
}
class LowerMoon extends Demon {
    public LowerMoon(String name, int rank) { super(name); this.rank = rank; this.category = "Lower"; }
}
class UpperMoon extends LowerMoon {
    public UpperMoon(String name, int rank) { super(name, rank); this.category = "Upper"; }
    public void summon() { super.summon(); System.out.println("twanggg"); }
    public void summon(String enemy) { System.out.println("Muzan summoned " + name + " to beat " + enemy); }
    public void summon(Demon other, String enemy) { System.out.println(name + " was replaced by " + other.name + " to beat " + enemy); }
}
class Main {
    public static void main(String[] args) {
        Demon[] demon = new Demon[4];
        demon[0] = new Demon("Slasher");
        demon[1] = new LowerMoon("Rui", 5);
        demon[2] = new UpperMoon("Akaza", 3);
        demon[3] = new UpperMoon("Kokushibo", 1);
        for (Demon d : demon)
            d.summon();
        ((UpperMoon) demon[2]).summon("Gyomei");
        ((UpperMoon) demon[2]).summon(demon[3], "Gyomei");
    }
}
