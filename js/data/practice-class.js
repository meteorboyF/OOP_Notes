// Class & Object practice set (from the course's "Practice Problem on Class and Objects" sheet).
// Each solution is a full program; the visualiser replays its main and must print exactly what Java prints.
(function () {
  const { code } = OOP;
  const fmt = x => (Number.isInteger(x) ? x + '.0' : String(x));
  function prob(o) {
    o.level = 'class';
    o.full = o.code;
    o.input = { fields: [], build: o.build };
    OOP.P(o);
  }

  // ---------------------------------------------------------------- 1. BankAccount
  prob({
    id: 'c-bank', title: 'Bank Account class', short: 'deposit / withdraw with a balance check', cls: 'BankAccountTest',
    prompt: '<p>Create a <code>BankAccount</code> class with the account holder’s name (String), account id (String) and balance (double). Implement methods for depositing and withdrawing funds. Test it by creating bank accounts and performing transactions.</p>',
    idea: '<p>Fields hold the state; methods change it. <code>withdraw</code> must refuse to take more than the balance, so the object protects its own rules. A constructor with <code>this.x = x</code> sets all three fields in one line of main.</p>',
    code: code`
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
}`,
    output: 'Insufficient balance for Kashem\nRashid (1000500): 1500.0\nKashem (1000501): 500.0',
    tips: ['Making the fields <code>private</code> and adding getters is even better: then nobody can write <code>a1.balance = -5</code> from outside (encapsulation).', '1000 is an int literal; passed to a double parameter it becomes 1000.0, which is why it prints with .0.'],
    build(inp, t) {
      t.s('BankAccount a1 = new BankAccount("Rashid", "1000500", 1000);', '<code>new</code> allocates the object (defaults), then the constructor runs.', ['call', 'main()'], ['new', 'a', 'BankAccount', { name: 'null', id: 'null', balance: '0.0' }], ['call', 'BankAccount(String name, String id, double balance)', { this: '@a', name: '"Rashid"', id: '"1000500"', balance: '1000.0' }]);
      t.s('this.balance = balance;', '<code>this.field = parameter</code> for all three fields.', ['f', 'a', 'name', '"Rashid"'], ['f', 'a', 'id', '"1000500"'], ['f', 'a', 'balance', '1000.0']);
      t.s('BankAccount a1 = new BankAccount("Rashid", "1000500", 1000);', '', ['ret'], ['v', 'a1', '@a']);
      t.s('BankAccount a2 = new BankAccount("Kashem", "1000501", 500);', 'A second, independent object.', ['new', 'b', 'BankAccount', { name: '"Kashem"', id: '"1000501"', balance: '500.0' }], ['v', 'a2', '@b']);
      t.s('a1.deposit(2000);', '', ['call', 'deposit(double amount)', { this: '@a', amount: '2000.0' }]);
      t.s('balance += amount;', 'Only a1’s balance changes.', ['f', 'a', 'balance', '3000.0']);
      t.s('a2.withdraw(700);', '', ['ret'], ['call', 'withdraw(double amount)', { this: '@b', amount: '700.0' }]);
      t.s('if (amount > 0 && amount <= balance) {', '700 ≤ 500? No → refuse.');
      t.s('System.out.println("Insufficient balance for " + name);', '', ['p', 'Insufficient balance for Kashem']);
      t.s('a1.withdraw(1500);', 'The returned false is ignored by main, which is allowed.', ['ret'], ['call', 'withdraw(double amount)', { this: '@a', amount: '1500.0' }]);
      t.s('balance -= amount;', '1500 ≤ 3000 → 3000 − 1500', ['f', 'a', 'balance', '1500.0']);
      t.s('a1.display();', '', ['ret'], ['p', 'Rashid (1000500): 1500.0']);
      t.s('a2.display();', '', ['p', 'Kashem (1000501): 500.0']);
    }
  });

  // ---------------------------------------------------------------- 2. Student with marks[]
  prob({
    id: 'c-student', title: 'Student class with a marks array', short: 'An array as a field; total() and average()', cls: 'StudentTest',
    prompt: '<p>Design a <code>Student</code> class with name (String), roll number (String) and marks (an array of double) in different subjects. Include methods to calculate the total marks and the average. Create student objects and compute their totals and averages.</p>',
    idea: '<p>A field can be an array. The field holds a <b>reference</b> to the array object. <code>average()</code> reuses <code>total()</code> instead of repeating the loop, and divides by <code>marks.length</code>, so it works for any number of subjects.</p>',
    code: code`
class Student {
    String name;
    String roll;
    double[] marks;

    Student(String name, String roll, double[] marks) {
        this.name = name;
        this.roll = roll;
        this.marks = marks;
    }
    double total() {
        double sum = 0;
        for (double m : marks) {
            sum += m;
        }
        return sum;
    }
    double average() {
        return total() / marks.length;
    }
}
public class StudentTest {
    public static void main(String[] args) {
        Student s1 = new Student("Ayan", "011221001", new double[]{78, 85.5, 92});
        Student s2 = new Student("Bristy", "011221002", new double[]{66, 74, 80, 90});
        System.out.println(s1.name + " total = " + s1.total() + ", average = " + s1.average());
        System.out.println(s2.name + " total = " + s2.total() + ", average = " + s2.average());
    }
}`,
    output: 'Ayan total = 255.5, average = 85.16666666666667\nBristy total = 310.0, average = 77.5',
    tips: ['<code>new double[]{78, 85.5, 92}</code> is an anonymous array, created right in the argument list.', 'If marks were <code>int[]</code> and sum an int, <code>sum / marks.length</code> would be integer division. Use a double sum, or cast.'],
    build(inp, t) {
      t.s('Student s1 = new Student("Ayan"', 'First the anonymous array object is created, then the Student. Its marks field stores a reference to that array.', ['call', 'main()'], ['arr', 'm1', 'double', ['78.0', '85.5', '92.0']], ['new', 's1', 'Student', { name: '"Ayan"', roll: '"011221001"', marks: '@m1' }], ['v', 's1', '@s1']);
      t.s('Student s2 = new Student("Bristy"', 'Each student has its own marks array.', ['arr', 'm2', 'double', ['66.0', '74.0', '80.0', '90.0']], ['new', 's2', 'Student', { name: '"Bristy"', roll: '"011221002"', marks: '@m2' }], ['v', 's2', '@s2']);
      const run = (sid, mid, vals, name) => {
        t.s('double sum = 0;', name + '.total(): start at 0', ['call', 'total()', { this: '@' + sid }], ['v', 'sum', '0.0']);
        let sum = 0;
        vals.forEach((x, i) => {
          sum += x;
          t.s('sum += m;', 'm = marks[' + i + '] = ' + fmt(x) + ' → sum = ' + fmt(sum), ['v', 'm', fmt(x)], ['ptr', mid, 'm', i], ['v', 'sum', fmt(sum)]);
        });
        t.s('return sum;', '', ['vd', 'm'], ['ptr', mid, 'm', null]);
        t.s('return total() / marks.length;', name + '.average() calls total() again (same loop), then divides by marks.length = ' + vals.length, ['ret'], ['call', 'average()', { this: '@' + sid }]);
        t.s('return total() / marks.length;', fmt(sum) + ' / ' + vals.length + ' = ' + fmt(sum / vals.length), ['ret']);
        return sum;
      };
      const t1 = run('s1', 'm1', [78, 85.5, 92], 's1');
      t.s('System.out.println(s1.name', '', ['p', 'Ayan total = ' + fmt(t1) + ', average = ' + fmt(t1 / 3)]);
      const t2 = run('s2', 'm2', [66, 74, 80, 90], 's2');
      t.s('System.out.println(s2.name', '', ['p', 'Bristy total = ' + fmt(t2) + ', average = ' + fmt(t2 / 4)]);
    }
  });

  // ---------------------------------------------------------------- 3. Rectangle
  prob({
    id: 'c-rectangle', title: 'Rectangle class', short: 'area() and perimeter() return values', cls: 'RectangleTest',
    prompt: '<p>Define a <code>Rectangle</code> class with attributes length and width. Implement methods to calculate the area and perimeter. Create rectangles and compute their area and perimeter.</p>',
    idea: '<p>Methods that <b>compute</b> something should <b>return</b> it (not print it), so the caller decides what to do with the result. Each object uses its own length and width.</p>',
    code: code`
class Rectangle {
    double length;
    double width;

    Rectangle(double length, double width) {
        this.length = length;
        this.width = width;
    }
    double area() {
        return length * width;
    }
    double perimeter() {
        return 2 * (length + width);
    }
}
public class RectangleTest {
    public static void main(String[] args) {
        Rectangle r1 = new Rectangle(5, 3);
        Rectangle r2 = new Rectangle(2.5, 4);
        System.out.println("r1: area = " + r1.area() + ", perimeter = " + r1.perimeter());
        System.out.println("r2: area = " + r2.area() + ", perimeter = " + r2.perimeter());
    }
}`,
    output: 'r1: area = 15.0, perimeter = 16.0\nr2: area = 10.0, perimeter = 13.0',
    build(inp, t) {
      t.s('Rectangle r1 = new Rectangle(5, 3);', 'The ints 5 and 3 are widened to double.', ['call', 'main()'], ['new', 'r1', 'Rectangle', { length: '5.0', width: '3.0' }], ['v', 'r1', '@r1']);
      t.s('Rectangle r2 = new Rectangle(2.5, 4);', '', ['new', 'r2', 'Rectangle', { length: '2.5', width: '4.0' }], ['v', 'r2', '@r2']);
      t.s('return length * width;', 'r1.area(): this = r1 → 5.0 × 3.0', ['call', 'area()', { this: '@r1' }]);
      t.s('return 2 * (length + width);', 'r1.perimeter() → 2 × 8.0', ['ret'], ['call', 'perimeter()', { this: '@r1' }]);
      t.s('System.out.println("r1:', '', ['ret'], ['p', 'r1: area = 15.0, perimeter = 16.0']);
      t.s('return length * width;', 'r2.area(): same method, different object → 2.5 × 4.0', ['call', 'area()', { this: '@r2' }]);
      t.s('return 2 * (length + width);', '2 × 6.5', ['ret'], ['call', 'perimeter()', { this: '@r2' }]);
      t.s('System.out.println("r2:', '', ['ret'], ['p', 'r2: area = 10.0, perimeter = 13.0']);
    }
  });

  // ---------------------------------------------------------------- 4. Car
  prob({
    id: 'c-car', title: 'Car class', short: 'Object state: engineOn changes behaviour', cls: 'CarTest',
    prompt: '<p>Create a <code>Car</code> class with color, model and name. Include methods to start the engine, stop the engine, and display the car’s details. Create car objects and test the methods.</p>',
    idea: '<p>Add one more field, <code>boolean engineOn</code> (default <code>false</code>), to remember the engine state. Then start/stop can react sensibly when the engine is already running or already off.</p>',
    code: code`
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
}`,
    output: 'Toyota: engine started\nToyota: engine is already running\nHonda: engine is already off\nToyota Corolla (White), engine on: true\nHonda Civic (Red), engine on: false\nToyota: engine stopped',
    tips: ['The boolean field starts as <code>false</code> by default. The constructor doesn’t need to set it.'],
    build(inp, t) {
      t.s('Car c1 = new Car("Toyota", "Corolla", "White");', 'engineOn is not set by the constructor, so it keeps its default: false.', ['call', 'main()'], ['new', 'c1', 'Car', { color: '"White"', model: '"Corolla"', name: '"Toyota"', engineOn: 'false' }], ['v', 'c1', '@c1']);
      t.s('Car c2 = new Car("Honda", "Civic", "Red");', '', ['new', 'c2', 'Car', { color: '"Red"', model: '"Civic"', name: '"Honda"', engineOn: 'false' }], ['v', 'c2', '@c2']);
      t.s('engineOn = true;', 'c1.startEngine(): engine was off → turn it on.', ['call', 'startEngine()', { this: '@c1' }], ['f', 'c1', 'engineOn', 'true']);
      t.s('System.out.println(name + ": engine started");', '', ['p', 'Toyota: engine started']);
      t.s('System.out.println(name + ": engine is already running");', 'Second call: the object REMEMBERS its state.', ['ret'], ['call', 'startEngine()', { this: '@c1' }], ['p', 'Toyota: engine is already running']);
      t.s('System.out.println(name + ": engine is already off");', 'c2 is a different object; its engine was never started.', ['ret'], ['call', 'stopEngine()', { this: '@c2' }], ['p', 'Honda: engine is already off']);
      t.s('c1.display();', '', ['ret'], ['p', 'Toyota Corolla (White), engine on: true']);
      t.s('c2.display();', '', ['p', 'Honda Civic (Red), engine on: false']);
      t.s('engineOn = false;', 'c1.stopEngine()', ['call', 'stopEngine()', { this: '@c1' }], ['f', 'c1', 'engineOn', 'false']);
      t.s('System.out.println(name + ": engine stopped");', '', ['p', 'Toyota: engine stopped'], ['ret']);
    }
  });

  // ---------------------------------------------------------------- 5. Employee
  prob({
    id: 'c-employee', title: 'Employee class with a salary raise', short: 'A method that updates a field by a percentage', cls: 'EmployeeTest',
    prompt: '<p>Design an <code>Employee</code> class with employee ID, name and salary. Implement a method to give a salary raise. Create employee objects and apply raises.</p>',
    idea: '<p><code>raiseSalary(double percent)</code> increases the salary by <code>salary × percent / 100</code>. Calling it twice compounds: the second raise is on the already-raised salary.</p>',
    code: code`
class Employee {
    int id;
    String name;
    double salary;

    Employee(int id, String name, double salary) {
        this.id = id;
        this.name = name;
        this.salary = salary;
    }
    void raiseSalary(double percent) {
        salary += salary * percent / 100;
    }
    void display() {
        System.out.println(id + " " + name + ": " + salary);
    }
}
public class EmployeeTest {
    public static void main(String[] args) {
        Employee e1 = new Employee(101, "Nadia", 50000);
        Employee e2 = new Employee(102, "Tamim", 40000);
        e1.raiseSalary(10);
        e2.raiseSalary(5);
        e2.raiseSalary(5);
        e1.display();
        e2.display();
    }
}`,
    output: '101 Nadia: 55000.0\n102 Tamim: 44100.0',
    tips: ['Integer-percentage trap: if salary were an <code>int</code>, <code>salary * 5 / 100</code> would truncate. Using double avoids it.'],
    build(inp, t) {
      t.s('Employee e1 = new Employee(101, "Nadia", 50000);', '', ['call', 'main()'], ['new', 'e1', 'Employee', { id: '101', name: '"Nadia"', salary: '50000.0' }], ['v', 'e1', '@e1']);
      t.s('Employee e2 = new Employee(102, "Tamim", 40000);', '', ['new', 'e2', 'Employee', { id: '102', name: '"Tamim"', salary: '40000.0' }], ['v', 'e2', '@e2']);
      t.s('salary += salary * percent / 100;', 'e1: 50000 + 50000 × 10 / 100 = 55000', ['call', 'raiseSalary(double percent)', { this: '@e1', percent: '10.0' }], ['f', 'e1', 'salary', '55000.0']);
      t.s('salary += salary * percent / 100;', 'e2: 40000 + 2000 = 42000', ['ret'], ['call', 'raiseSalary(double percent)', { this: '@e2', percent: '5.0' }], ['f', 'e2', 'salary', '42000.0']);
      t.s('salary += salary * percent / 100;', 'e2 again: 42000 + 5% of 42000 (2100) = 44100. The raises compound.', ['ret'], ['call', 'raiseSalary(double percent)', { this: '@e2', percent: '5.0' }], ['f', 'e2', 'salary', '44100.0']);
      t.s('e1.display();', '', ['ret'], ['p', '101 Nadia: 55000.0']);
      t.s('e2.display();', '', ['p', '102 Tamim: 44100.0']);
    }
  });

  // ---------------------------------------------------------------- 6. LibraryBook
  prob({
    id: 'c-library', title: 'Library Book class', short: 'borrow / return using an availability flag', cls: 'LibraryTest',
    prompt: '<p>Build a <code>LibraryBook</code> class with the book title, author and availability status. Include methods to borrow and return books. Simulate borrowing and returning with instances of this class.</p>',
    idea: '<p>Initialise <code>available = true</code> with <b>direct assignment</b>: every new book starts on the shelf. <code>borrowBook()</code> succeeds only if the book is available; <code>returnBook()</code> only if it was borrowed.</p>',
    code: code`
class LibraryBook {
    String title;
    String author;
    boolean available = true;

    LibraryBook(String title, String author) {
        this.title = title;
        this.author = author;
    }
    void borrowBook() {
        if (available) {
            available = false;
            System.out.println("You borrowed \"" + title + "\"");
        } else {
            System.out.println("Sorry, \"" + title + "\" is already borrowed");
        }
    }
    void returnBook() {
        if (!available) {
            available = true;
            System.out.println("\"" + title + "\" returned");
        } else {
            System.out.println("\"" + title + "\" was not borrowed");
        }
    }
}
public class LibraryTest {
    public static void main(String[] args) {
        LibraryBook b1 = new LibraryBook("Java: The Complete Reference", "Herbert Schildt");
        LibraryBook b2 = new LibraryBook("Clean Code", "Robert C. Martin");
        b1.borrowBook();
        b1.borrowBook();
        b1.returnBook();
        b2.returnBook();
        b1.borrowBook();
    }
}`,
    output: 'You borrowed "Java: The Complete Reference"\nSorry, "Java: The Complete Reference" is already borrowed\n"Java: The Complete Reference" returned\n"Clean Code" was not borrowed\nYou borrowed "Java: The Complete Reference"',
    tips: ['<code>\\"</code> inside a String prints a double-quote character.'],
    build(inp, t) {
      const T1 = 'Java: The Complete Reference';
      t.s('LibraryBook b1 = new LibraryBook(', 'available = true comes from the direct assignment, before the constructor body.', ['call', 'main()'], ['new', 'b1', 'LibraryBook', { title: '"' + T1 + '"', author: '"Herbert Schildt"', available: 'true' }], ['v', 'b1', '@b1']);
      t.s('LibraryBook b2 = new LibraryBook(', '', ['new', 'b2', 'LibraryBook', { title: '"Clean Code"', author: '"Robert C. Martin"', available: 'true' }], ['v', 'b2', '@b2']);
      t.s('available = false;', 'b1.borrowBook(): it was available.', ['call', 'borrowBook()', { this: '@b1' }], ['f', 'b1', 'available', 'false']);
      t.s('System.out.println("You borrowed', '', ['p', 'You borrowed "' + T1 + '"']);
      t.s('System.out.println("Sorry, \\"', 'Second borrow: available is false now.', ['ret'], ['call', 'borrowBook()', { this: '@b1' }], ['p', 'Sorry, "' + T1 + '" is already borrowed']);
      t.s('available = true;', 'b1.returnBook()', ['ret'], ['call', 'returnBook()', { this: '@b1' }], ['f', 'b1', 'available', 'true']);
      t.s('System.out.println("\\"" + title + "\\" returned");', '', ['p', '"' + T1 + '" returned']);
      t.s('System.out.println("\\"" + title + "\\" was not borrowed");', 'b2 was never borrowed.', ['ret'], ['call', 'returnBook()', { this: '@b2' }], ['p', '"Clean Code" was not borrowed']);
      t.s('available = false;', 'b1 can be borrowed again.', ['ret'], ['call', 'borrowBook()', { this: '@b1' }], ['f', 'b1', 'available', 'false']);
      t.s('System.out.println("You borrowed', '', ['p', 'You borrowed "' + T1 + '"'], ['ret']);
    }
  });

  // ---------------------------------------------------------------- 7. Circle
  prob({
    id: 'c-circle', title: 'Circle class', short: 'Math.PI and printf("%.2f")', cls: 'CircleTest',
    prompt: '<p>Define a <code>Circle</code> class with a radius. Implement methods to calculate the circumference and area. Create circles and compute both.</p>',
    idea: '<p>Use <code>Math.PI</code> (don’t type 3.14). Area = πr², circumference = 2πr. Print with <code>printf("%.2f", …)</code> to round to 2 decimals.</p>',
    code: code`
class Circle {
    double radius;

    Circle(double radius) {
        this.radius = radius;
    }
    double area() {
        return Math.PI * radius * radius;
    }
    double circumference() {
        return 2 * Math.PI * radius;
    }
}
public class CircleTest {
    public static void main(String[] args) {
        Circle c1 = new Circle(7);
        Circle c2 = new Circle(2.5);
        System.out.printf("r = %.1f: area = %.2f, circumference = %.2f%n", c1.radius, c1.area(), c1.circumference());
        System.out.printf("r = %.1f: area = %.2f, circumference = %.2f%n", c2.radius, c2.area(), c2.circumference());
    }
}`,
    output: 'r = 7.0: area = 153.94, circumference = 43.98\nr = 2.5: area = 19.63, circumference = 15.71',
    tips: ['<code>%n</code> in printf is a newline. Without it, the next output continues on the same line.', '<code>Math.pow(radius, 2)</code> works too, but <code>radius * radius</code> is simpler.'],
    build(inp, t) {
      t.s('Circle c1 = new Circle(7);', '', ['call', 'main()'], ['new', 'c1', 'Circle', { radius: '7.0' }], ['v', 'c1', '@c1']);
      t.s('Circle c2 = new Circle(2.5);', '', ['new', 'c2', 'Circle', { radius: '2.5' }], ['v', 'c2', '@c2']);
      t.s('return Math.PI * radius * radius;', 'c1.area() = π × 49 ≈ 153.938…', ['call', 'area()', { this: '@c1' }]);
      t.s('return 2 * Math.PI * radius;', 'c1.circumference() = 14π ≈ 43.982…', ['ret'], ['call', 'circumference()', { this: '@c1' }]);
      t.s('System.out.printf("r = %.1f: area = %.2f, circumference = %.2f%n", c1.radius', '%.2f rounds to 2 decimal places.', ['ret'], ['p', 'r = 7.0: area = 153.94, circumference = 43.98']);
      t.s('return Math.PI * radius * radius;', 'c2.area() = π × 6.25 ≈ 19.634…', ['call', 'area()', { this: '@c2' }]);
      t.s('return 2 * Math.PI * radius;', 'c2.circumference() = 5π ≈ 15.707…', ['ret'], ['call', 'circumference()', { this: '@c2' }]);
      t.s('System.out.printf("r = %.1f: area = %.2f, circumference = %.2f%n", c2.radius', '', ['ret'], ['p', 'r = 2.5: area = 19.63, circumference = 15.71']);
    }
  });

  // ---------------------------------------------------------------- 8. Person
  prob({
    id: 'c-person', title: 'Person class: update address', short: 'A setter-style method + shared reference', cls: 'PersonTest',
    prompt: '<p>Create a <code>Person</code> class with name, age and address. Implement methods to update the address and display the person’s details. Create person objects and test the methods.</p>',
    idea: '<p><code>updateAddress(String newAddress)</code> changes one field of one object. The test also shows a reference twist: <code>Person p3 = p1;</code> is the <b>same</b> person, so updating through p3 changes what p1 sees.</p>',
    code: code`
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
}`,
    output: 'Fardin, 22, lives in Dhanmondi\nFardin, 22, lives in Notun Bazar\nMim, 21, lives in Mirpur',
    tips: ['<code>Person p3 = p1;</code> copies the reference, not the person. This is exactly the trick in many mid “write the output” questions.'],
    build(inp, t) {
      t.s('Person p1 = new Person("Fardin", 22, "Dhanmondi");', '', ['call', 'main()'], ['new', 'p1', 'Person', { name: '"Fardin"', age: '22', address: '"Dhanmondi"' }], ['v', 'p1', '@p1']);
      t.s('Person p2 = new Person("Mim", 21, "Mirpur");', '', ['new', 'p2', 'Person', { name: '"Mim"', age: '21', address: '"Mirpur"' }], ['v', 'p2', '@p2']);
      t.s('p1.display();', '', ['p', 'Fardin, 22, lives in Dhanmondi']);
      t.s('address = newAddress;', 'p1.updateAddress("Badda")', ['call', 'updateAddress(String newAddress)', { this: '@p1', newAddress: '"Badda"' }], ['f', 'p1', 'address', '"Badda"']);
      t.s('Person p3 = p1;', 'No new person: p3 is a second arrow to the same object.', ['ret'], ['v', 'p3', '@p1']);
      t.s('address = newAddress;', 'p3.updateAddress(…) → this = object #1, the same as p1.', ['call', 'updateAddress(String newAddress)', { this: '@p1', newAddress: '"Notun Bazar"' }], ['f', 'p1', 'address', '"Notun Bazar"']);
      t.s('p1.display();@2', 'p1 sees the change made through p3.', ['ret'], ['p', 'Fardin, 22, lives in Notun Bazar']);
      t.s('p2.display();', '', ['p', 'Mim, 21, lives in Mirpur']);
    }
  });
})();
