
class BankAccount {
    public String name;
    public String id;
    public double balance;

    public void deposit(double amount) {
        balance = balance + amount;
    }
    public void withdraw(double amount) {
        if (amount < balance)
            balance -= amount;
    }
}
public class TestBankAccount {
    public static void main(String[] args) {
        BankAccount accountR = new BankAccount();
        BankAccount accountK = new BankAccount();
        accountR.name = "Rashid";
        accountR.balance = 1000;
        accountK.name = "Kashem";
        accountK.balance = 1000;
        accountK.deposit(2000);
        System.out.println("Kashem's balance: " + accountK.balance);
        System.out.println("Rashid's balance: " + accountR.balance);
    }
}
