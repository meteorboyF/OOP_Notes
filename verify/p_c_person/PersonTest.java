
class Person {
    String name;
    int age;
    String address;

    Person(String name, int age, String address) {
        this.name = name;
        this.age = age;
        this.address = address;
    }
    void updateAddress(String newAddress) {
        address = newAddress;
    }
    void display() {
        System.out.println(name + ", " + age + ", lives in " + address);
    }
}
public class PersonTest {
    public static void main(String[] args) {
        Person p1 = new Person("Fardin", 22, "Dhanmondi");
        Person p2 = new Person("Mim", 21, "Mirpur");
        p1.display();
        p1.updateAddress("Badda");
        Person p3 = p1;
        p3.updateAddress("Notun Bazar");
        p1.display();
        p2.display();
    }
}
