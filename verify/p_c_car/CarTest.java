
class Car {
    String color;
    String model;
    String name;
    boolean engineOn;

    Car(String name, String model, String color) {
        this.name = name;
        this.model = model;
        this.color = color;
    }
    void startEngine() {
        if (engineOn) {
            System.out.println(name + ": engine is already running");
        } else {
            engineOn = true;
            System.out.println(name + ": engine started");
        }
    }
    void stopEngine() {
        if (engineOn) {
            engineOn = false;
            System.out.println(name + ": engine stopped");
        } else {
            System.out.println(name + ": engine is already off");
        }
    }
    void display() {
        System.out.println(name + " " + model + " (" + color + "), engine on: " + engineOn);
    }
}
public class CarTest {
    public static void main(String[] args) {
        Car c1 = new Car("Toyota", "Corolla", "White");
        Car c2 = new Car("Honda", "Civic", "Red");
        c1.startEngine();
        c1.startEngine();
        c2.stopEngine();
        c1.display();
        c2.display();
        c1.stopEngine();
    }
}
