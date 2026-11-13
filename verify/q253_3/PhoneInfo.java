class Phone {
    final String company;
    final int launch_year;
    private String chip;
    double price;
    private String imei_no;
    public Phone(String company, int launch_year, double price) {
        this.company = company; this.launch_year = launch_year; this.price = price;
    }
    public void setCompany(String company) { }
    public void setChip(String chip) { this.chip = chip; }
    public String getChip() { return chip; }
    public void setImei_no(String imei_no) { this.imei_no = imei_no; }
    public String getImei_no() { return imei_no; }
}
public class PhoneInfo {
    public static void main(String[] args) {
        Phone phone = new Phone("Samsung", 2024, 35000);
        phone.setCompany("Apple");
        phone.setChip("Qualcom snapdragon");
        phone.price = 45000;
        phone.setImei_no("54654684");
        System.out.println(phone.company + " " + phone.launch_year + " " + phone.getChip()
                + " " + phone.price + " " + phone.getImei_no());
    }
}
