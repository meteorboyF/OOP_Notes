
class BankAccount {
    String name;
    String id;
    double balance;

    BankAccount(String name, String id, double balance) {
        this.name = name;
        this.id = id;
        this.balance = balance;
    }
    void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }
    boolean withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            return true;
        }
        System.out.println("Insufficient balance for " + name);
        return false;
    }
    void display() {
        System.out.println(name + " (" + id + "): " + balance);
    }
}
public class BankAccountTest {
    public static void main(String[] args) {
        BankAccount a1 = new BankAccount("Rashid", "1000500", 1000);
        BankAccount a2 = new BankAccount("Kashem", "1000501", 500);
        a1.deposit(2000);
        a2.withdraw(700);
        a1.withdraw(1500);
        a1.display();
        a2.display();
    }
}
