// Class & Object: "write the class", "fix the errors" and short-answer questions.
(function () {
  const { Q, code } = OOP;
  const S = (l, n, ...o) => ({ l, n, o });

  // ======================= Spring 2026 Q1 =======================
  Q({
    id: '261-q1', paper: '261', qno: '1', marks: 10, topic: 'class', sub: ['encapsulation', 'static', 'constructors'], type: 'code',
    title: 'Asset & Trader: auto id from 1001, default department',
    prompt: `<p>A trading company has two classes:</p>
<ul><li><b>Asset</b>: assetType ("Stock"/"Bond"), price (float, must not be accessed directly from outside), id (auto-generated, starts at 1001 and increases by 1 per object), tradersName (initially empty). Only assetType and price are given when the object is created.</li>
<li><b>Trader</b>: name, department, aum (float, starts 0.0). If no department is given it defaults to <code>"Bond"</code>. <code>assign(Asset asset)</code> assigns only if the trader’s department equals the asset’s type: aum increases by the price and the asset’s tradersName is set. Otherwise print <code>Department Mismatch</code>.</li></ul>
<p>(a) Define Asset. (b) Define Trader. This main must produce the output:</p>`,
    given: code`
class Main {
    public static void main(String[] args) {
        Trader bond_trader = new Trader("Borsha");
        Trader stock_trader = new Trader("Shondha", "Stock");

        Asset stock = new Asset("Stock", 7000);

        bond_trader.assign(stock);
        stock_trader.assign(stock);

        System.out.println("Name: " + stock_trader.name + ", AUM: " + stock_trader.aum);
        System.out.println("Asset ID: " + stock.id + ", Trader: " + stock.tradersName);
    }
}`,
    givenOut: `Department Mismatch
Name: Shondha, AUM: 7000.0
Asset ID: 1001, Trader: Shondha`,
    answer: {
      code: code`
class Asset {
    private static int nextId = 1001;   // shared counter for ALL assets

    String assetType;
    private float price;                // hidden: use getPrice / setPrice
    int id;
    String tradersName = "";

    Asset(String assetType, float price) {
        this.assetType = assetType;
        this.price = price;
        this.id = nextId++;             // use current value, then increase
    }

    public float getPrice() { return price; }
    public void setPrice(float price) { this.price = price; }
}

class Trader {
    String name;
    String department;
    float aum = 0.0f;

    Trader(String name) {
        this(name, "Bond");             // default department
    }
    Trader(String name, String department) {
        this.name = name;
        this.department = department;
    }

    void assign(Asset asset) {
        if (department.equals(asset.assetType)) {
            aum += asset.getPrice();
            asset.tradersName = name;
        } else {
            System.out.println("Department Mismatch");
        }
    }
}`,
      html: `<ul><li><b>Auto id:</b> a <code>static</code> counter belongs to the class, so every new Asset sees the updated value. <code>id = nextId++</code> gives 1001 to the first asset, 1002 to the next, …</li>
<li><b>Default value:</b> overload the constructor and chain with <code>this(name, "Bond")</code>.</li>
<li><code>new Asset("Stock", 7000)</code>: the int 7000 widens to float automatically, so <code>float price</code> works. <code>aum</code> prints as 7000.0.</li>
<li>Compare Strings with <code>.equals()</code>, not <code>==</code>.</li></ul>`
    },
    traps: ['If <code>nextId</code> is not static, every Asset gets 1001.', 'Using <code>==</code> on Strings compares references. Use <code>.equals()</code>.'],
    tips: ['The “auto-increment id” pattern (static counter + <code>id = counter++</code> in the constructor) is a classic. Memorise it.'],
    trace: {
      code: code`
class Asset {
    private static int nextId = 1001;
    String assetType;
    private float price;
    int id;
    String tradersName = "";
    Asset(String assetType, float price) {
        this.assetType = assetType;
        this.price = price;
        this.id = nextId++;
    }
    public float getPrice() { return price; }
}
class Trader {
    String name;
    String department;
    float aum = 0.0f;
    Trader(String name) {
        this(name, "Bond");
    }
    Trader(String name, String department) {
        this.name = name;
        this.department = department;
    }
    void assign(Asset asset) {
        if (department.equals(asset.assetType)) {
            aum += asset.getPrice();
            asset.tradersName = name;
        } else {
            System.out.println("Department Mismatch");
        }
    }
}
class Main {
    public static void main(String[] args) {
        Trader bond_trader = new Trader("Borsha");
        Trader stock_trader = new Trader("Shondha", "Stock");
        Asset stock = new Asset("Stock", 7000);
        bond_trader.assign(stock);
        stock_trader.assign(stock);
        System.out.println("Name: " + stock_trader.name + ", AUM: " + stock_trader.aum);
        System.out.println("Asset ID: " + stock.id + ", Trader: " + stock.tradersName);
    }
}`,
      steps: [
        S('Trader bond_trader = new Trader("Borsha");', '', ['call', 'main()'], ['new', 't1', 'Trader', { name: 'null', department: 'null', aum: '0.0' }], ['call', 'Trader(String name)', { this: '@t1', name: '"Borsha"' }]),
        S('this(name, "Bond");', 'Default department supplied by chaining.', ['call', 'Trader(String name, String department)', { this: '@t1', name: '"Borsha"', department: '"Bond"' }]),
        S('this.department = department;', '', ['f', 't1', 'name', '"Borsha"'], ['f', 't1', 'department', '"Bond"']),
        S('Trader bond_trader = new Trader("Borsha");', '', ['ret'], ['ret'], ['v', 'bond_trader', '@t1']),
        S('Trader stock_trader = new Trader("Shondha", "Stock");', '', ['new', 't2', 'Trader', { name: '"Shondha"', department: '"Stock"', aum: '0.0' }], ['v', 'stock_trader', '@t2']),
        S('private static int nextId = 1001;', 'First use of Asset → static counter created once.', ['s', 'Asset', 'nextId', '1001']),
        S('Asset stock = new Asset("Stock", 7000);', '', ['new', 'a', 'Asset', { assetType: 'null', price: '0.0', id: '0', tradersName: '""' }], ['call', 'Asset(String assetType, float price)', { this: '@a', assetType: '"Stock"', price: '7000.0' }]),
        S('this.id = nextId++;', 'id gets 1001, then the counter becomes 1002.', ['f', 'a', 'assetType', '"Stock"'], ['f', 'a', 'price', '7000.0'], ['f', 'a', 'id', '1001'], ['s', 'Asset', 'nextId', '1002']),
        S('Asset stock = new Asset("Stock", 7000);', '', ['ret'], ['v', 'stock', '@a']),
        S('if (department.equals(asset.assetType)) {', '"Bond".equals("Stock") → false', ['call', 'assign(Asset asset)', { this: '@t1', asset: '@a' }]),
        S('System.out.println("Department Mismatch");', '', ['p', 'Department Mismatch']),
        S('if (department.equals(asset.assetType)) {', 'stock_trader: "Stock".equals("Stock") → true', ['ret'], ['call', 'assign(Asset asset)', { this: '@t2', asset: '@a' }]),
        S('aum += asset.getPrice();', '', ['f', 't2', 'aum', '7000.0']),
        S('asset.tradersName = name;', '', ['f', 'a', 'tradersName', '"Shondha"']),
        S('System.out.println("Name: "', '', ['ret'], ['p', 'Name: Shondha, AUM: 7000.0']),
        S('System.out.println("Asset ID: "', '', ['p', 'Asset ID: 1001, Trader: Shondha'])
      ]
    },
    answerOut: true
  });

  // ======================= Fall 2025 Q3 =======================
  Q({
    id: '253-q3', paper: '253', qno: '3', marks: 6, topic: 'class', sub: ['final', 'encapsulation'], type: 'fix',
    title: 'Phone: final fields, private chip/imei, setters',
    prompt: '<p>Make the necessary changes so the code runs without errors and prints the expected output. <b>You may not change any access modifiers.</b></p>',
    given: code`
class Phone {
    final String company;
    final int launch_year;
    private String chip;
    double price;
    private String imei_no;

    public Phone(String company, int launch_year, double price) {
        this.company = company;
        this.launch_year = launch_year;
        this.price = price;
    }
    public void setCompany(int company) {
        this.company = company;
    }
}
public class PhoneInfo {
    public static void main(String[] args) {
        Phone phone = new Phone("Samsung", 2024, 35000); /// cannot change
        phone.setCompany("Apple");
        phone.setChip = "Helio";
        phone.price = 45000;
        phone.imei_no = 19203192;
        System.out.println(phone.company + " " + phone.launch_year + " " + phone.chip + " " + phone.price + " " + phone.getImei_no);
    }
}`,
    givenOut: 'Samsung 2024 Qualcom snapdragon 45000.0 54654684',
    answer: {
      code: code`
class Phone {
    final String company;
    final int launch_year;
    private String chip;
    double price;
    private String imei_no;

    public Phone(String company, int launch_year, double price) {
        this.company = company;
        this.launch_year = launch_year;
        this.price = price;
    }
    // setCompany removed? Not allowed to delete... so make it harmless:
    public void setCompany(String company) {
        // a final field can be assigned only once (in the constructor),
        // so this method cannot change it. Leave the body empty.
    }
    public void setChip(String chip) { this.chip = chip; }
    public String getChip() { return chip; }
    public void setImei_no(String imei_no) { this.imei_no = imei_no; }
    public String getImei_no() { return imei_no; }
}
public class PhoneInfo {
    public static void main(String[] args) {
        Phone phone = new Phone("Samsung", 2024, 35000);
        phone.setCompany("Apple");                    // has no effect: company is final
        phone.setChip("Qualcom snapdragon");
        phone.price = 45000;
        phone.setImei_no("54654684");
        System.out.println(phone.company + " " + phone.launch_year + " " + phone.getChip()
                + " " + phone.price + " " + phone.getImei_no());
    }
}`,
      output: 'Samsung 2024 Qualcom snapdragon 45000.0 54654684',
      html: `<p><b>Errors found:</b></p><ol>
<li><code>this.company = company</code> inside setCompany: you can’t assign a <code>final</code> field outside the constructor. Its parameter type (int) also doesn’t match the call <code>setCompany("Apple")</code>. Fix: take a String and don’t assign. The output must still say Samsung.</li>
<li><code>phone.setChip = "Helio"</code>: setChip is not a variable, and chip is private. Add <code>setChip(String)</code>/<code>getChip()</code> and call it with "Qualcom snapdragon".</li>
<li><code>phone.imei_no = 19203192</code>: private field, and an int assigned to a String. Use a setter with "54654684".</li>
<li><code>phone.chip</code> and <code>phone.getImei_no</code> (no parentheses): use the getters <code>getChip()</code> and <code>getImei_no()</code>.</li></ol>
<p><code>price</code> has default (package) access, so <code>phone.price = 45000</code> is fine and prints as 45000.0.</p>`
    },
    traps: ['A <code>final</code> instance field must be assigned exactly once: at declaration, in an instance block, or in <b>every</b> constructor. Never in a setter.', 'Calling a method needs <code>()</code>. <code>phone.getImei_no</code> without parentheses is a compile error.']
  });

  // ======================= Fall 2025 Q1(a) / Summer 2025 Q3 (constructors handled in array file) =======================

  // ======================= Summer 2025 Q3 =======================
  Q({
    id: '252-q3', paper: '252', qno: '3', marks: 6, topic: 'class', sub: ['encapsulation', 'constructors'], type: 'code',
    title: 'Person → Student → GraduateStudent with validation',
    prompt: `<p>(a) Make <code>name</code> accessible only to subclasses, and make sure <code>age</code> can’t be set to a negative value. (b) Write the constructors/methods of Student, using <code>super</code>. (c) Create GraduateStudent (child of Student) with a private <code>thesisTitle</code>. (d) Fix main so there are no errors and the output is produced. Lines marked "cannot change" stay as they are.</p>`,
    given: code`
class Person {
    private String name;
    private int age;                 /// cannot change
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
class Student extends Person {
    private String studentId;        /// cannot change
}
public class Inheritance {
    public static void main(String[] args) {
        Student student = new Student("Harun", 17, "S102");                                    /// cannot change
        GraduateStudent graduateStudent = new GraduateStudent("Alif", 23, "S123", "AI in Healthcare"); /// cannot change
        graduateStudent.age = 25;
        System.out.println("Age: " + graduateStudent.age);
        System.out.println("Student ID " + graduateStudent.studentId);
        System.out.println("Thesis Title: " + graduateStudent.ThesisTitle);
    }
}`,
    givenOut: `25
S123
AI in Cybersecurity`,
    answer: {
      code: code`
class Person {
    protected String name;               // (a) visible to subclasses
    private int age;

    public Person(String name, int age) {
        this.name = name;
        setAge(age);
    }
    public int getAge() { return age; }
    public void setAge(int age) {        // (a) validation
        if (age >= 0) this.age = age;
        else System.out.println("Age cannot be negative");
    }
}
class Student extends Person {
    private String studentId;

    public Student(String name, int age, String studentId) {   // (b)
        super(name, age);
        this.studentId = studentId;
    }
    public String getStudentId() { return studentId; }
}
class GraduateStudent extends Student {                         // (c)
    private String thesisTitle;

    public GraduateStudent(String name, int age, String studentId, String thesisTitle) {
        super(name, age, studentId);
        this.thesisTitle = thesisTitle;
    }
    public String getThesisTitle() { return thesisTitle; }
    public void setThesisTitle(String t) { thesisTitle = t; }
}
public class Inheritance {
    public static void main(String[] args) {                   // (d)
        Student student = new Student("Harun", 17, "S102");
        GraduateStudent graduateStudent = new GraduateStudent("Alif", 23, "S123", "AI in Healthcare");
        graduateStudent.setAge(25);
        graduateStudent.setThesisTitle("AI in Cybersecurity");
        System.out.println(graduateStudent.getAge());
        System.out.println(graduateStudent.getStudentId());
        System.out.println(graduateStudent.getThesisTitle());
    }
}`,
      output: `25
S123
AI in Cybersecurity`,
      html: '<p>Private fields can’t be read or written from main, so every access becomes a getter or setter call. The expected output shows the title "AI in Cybersecurity" although the object was created with "AI in Healthcare". That means main must call the setter before printing. The expected output also has no labels, so the println lines are rewritten to print just the values.</p>'
    },
    traps: ['Validation belongs in the setter, and the constructor should call the setter so a negative age can’t sneak in through <code>new</code>.']
  });

  // ======================= Summer 2025 Q4 =======================
  Q({
    id: '252-q4', paper: '252', qno: '4', marks: 6, topic: 'class', sub: ['overloading', 'constructors'], type: 'code',
    title: 'Printer.print(doc, copies) overload + ColorPrinter',
    prompt: '<p>Add code so that the expected output is produced. <code>print(String doc)</code> in Printer cannot be changed.</p>',
    given: code`
class Printer {
    private String brand;
    public Printer(String brand) {
        this.brand = brand;
    }
    /// this method cannot be changed
    public void print(String doc) {
        System.out.println("Printing document: " + doc);
    }
    // Add your code here
}
public class ColorPrinter extends Printer {
    private String color;
    // Add your code here
    public static void main(String[] args) {
        Printer p = new Printer("Epson");
        p.print("Assignment.pdf", 3);        /// 1st call
        ColorPrinter cp = new ColorPrinter("Canon", "Red");
        cp.print("Report.pdf");              /// 2nd call
    }
}`,
    givenOut: `Printing 3 copies of the document: Assignment.pdf
Printing copy 1
Printing copy 2
Printing copy 3
Printing document: Report.pdf
Red Color mode enabled`,
    answer: {
      code: code`
class Printer {
    private String brand;
    public Printer(String brand) {
        this.brand = brand;
    }
    public void print(String doc) {
        System.out.println("Printing document: " + doc);
    }
    // overload: same name, different parameter list
    public void print(String doc, int copies) {
        System.out.println("Printing " + copies + " copies of the document: " + doc);
        for (int i = 1; i <= copies; i++) {
            System.out.println("Printing copy " + i);
        }
    }
}
public class ColorPrinter extends Printer {
    private String color;

    public ColorPrinter(String brand, String color) {
        super(brand);                 // Printer has no no-arg constructor
        this.color = color;
    }
    @Override
    public void print(String doc) {
        super.print(doc);             // reuse the parent's line
        System.out.println(color + " Color mode enabled");
    }
    public static void main(String[] args) { /* unchanged */ }
}`,
      html: '<p>Call 1 needs an <b>overload</b> <code>print(String, int)</code> in Printer. Call 2 prints the parent message and then one more line, so ColorPrinter <b>overrides</b> <code>print(String)</code> and calls <code>super.print(doc)</code>. ColorPrinter needs a constructor that calls <code>super(brand)</code>, because Printer has no no-arg constructor.</p>'
    },
    tips: ['Overloading = same name, different parameters (in the same class or a subclass). Overriding = same signature in a subclass.']
  });

  // ======================= Spring 2025 Q1(b) =======================
  Q({
    id: '251-q1b', paper: '251', qno: '1(b)', marks: 5, topic: 'class', sub: ['constructors', 'overloading'], type: 'code',
    title: 'Shape: default, 2-arg, 3-arg and copy constructors',
    prompt: '<p>Complete Shape.java by adding constructors so Main.java runs correctly.</p>',
    given: code`
public class Main {
    public static void main(String[] args) {
        // set default value 10 to width, height and length
        Shape shape1 = new Shape();
        // set width = 5, height = 10, length = 0
        Shape shape2 = new Shape(5, 10);
        // set width = 3, height = 6, length = 9
        Shape shape3 = new Shape(3, 6, 9);
        // set width, height and length to shape3's width, height and length
        Shape shape4 = new Shape(shape3);
    }
}
class Shape {
    int length, width, height;
    // add necessary constructors
}`,
    answer: {
      code: code`
class Shape {
    int length, width, height;

    Shape() {
        this(10, 10, 10);                    // all three = 10
    }
    Shape(int width, int height) {
        this(width, height, 0);              // length = 0
    }
    Shape(int width, int height, int length) {
        this.width = width;
        this.height = height;
        this.length = length;
    }
    Shape(Shape other) {                     // copy constructor
        this(other.width, other.height, other.length);
    }
}`,
      html: '<p>Write one “full” constructor, and have every other constructor chain to it with <code>this(...)</code>. Watch the <b>parameter order</b>: the comments say (width, height, length).</p>'
    },
    tips: ['Copy constructor = a constructor that takes an object of the same class and copies its fields. It shows up in Summer 2019 (Complex), Fall 2023 (Logarithm) and Spring 2025 (Shape).']
  });

  // ======================= Spring 2025 Q4(a) =======================
  Q({
    id: '251-q4a', paper: '251', qno: '4(a)', marks: 5, topic: 'class', sub: ['encapsulation'], type: 'fix',
    title: 'FlightBooking: private fields accessed from FTest',
    prompt: '<p>Is there any error in main? If yes, modify FlightBooking.java and FTest.java. You cannot change the access modifiers of any instance variables.</p>',
    given: code`
public class FlightBooking {
    private String passengerName;
    private int seatNumber;
    private boolean confirm = false;

    public FlightBooking(String passengerName, int seatNumber) {
        this.passengerName = passengerName;
        this.seatNumber = seatNumber;
    }
}
class FTest {
    public static void main(String[] args) {
        FlightBooking f1 = new FlightBooking("John", 12);
        FlightBooking f2 = new FlightBooking("Maria", 3);
        if (f1.confirm == false) {
            f1.confirm = true;
            f1.seatNumber = 32;
        }
        System.out.println("seat number of Maria: " + f2.seatNumber);
        System.out.println("seat number of John: " + f1.seatNumber);
    }
}`,
    answer: {
      code: code`
public class FlightBooking {
    private String passengerName;
    private int seatNumber;
    private boolean confirm = false;

    public FlightBooking(String passengerName, int seatNumber) {
        this.passengerName = passengerName;
        this.seatNumber = seatNumber;
    }
    public boolean isConfirm() { return confirm; }
    public void setConfirm(boolean confirm) { this.confirm = confirm; }
    public int getSeatNumber() { return seatNumber; }
    public void setSeatNumber(int seatNumber) { this.seatNumber = seatNumber; }
}
class FTest {
    public static void main(String[] args) {
        FlightBooking f1 = new FlightBooking("John", 12);
        FlightBooking f2 = new FlightBooking("Maria", 3);
        if (f1.isConfirm() == false) {
            f1.setConfirm(true);
            f1.setSeatNumber(32);
        }
        System.out.println("seat number of Maria: " + f2.getSeatNumber());
        System.out.println("seat number of John: " + f1.getSeatNumber());
    }
}`,
      output: `seat number of Maria: 3
seat number of John: 32`,
      html: '<p><b>Yes.</b> <code>confirm</code> and <code>seatNumber</code> are <code>private</code>, so FTest (another class) can’t read or write them directly. That’s a compile error. Add public getters/setters and use them in main.</p>'
    },
    tips: ['Naming convention: the getter for a <code>boolean</code> is usually <code>isX()</code>; for others it is <code>getX()</code>.']
  });

  // ======================= Fall 2024 / Summer 2024 Q1 =======================
  Q({
    id: '243-q1', paper: '243', qno: '1', marks: 6, topic: 'class', sub: ['encapsulation', 'constructors'], type: 'code',
    title: 'Employee: constructor with this + getter/setter for salary',
    prompt: '<p>Write the constructor (using <code>this</code>) that initializes name, employee_id and salary, and the getter and setter for <code>salary</code>.</p>',
    given: code`
public class Employee {
    public String name;
    private int employee_id;
    private double salary;
    // Write constructor to initialize name, employee id and salary with this reference keyword;
    // Write getter method for salary;
    // Write setter method for salary;
    public static void main(String[] args) {
        Employee e1 = new Employee("Prof. Albert Einstein", 19, 2000.50);
        System.out.println(e1.name);
    }
}`,
    answer: {
      code: code`
public Employee(String name, int employee_id, double salary) {
    this.name = name;
    this.employee_id = employee_id;
    this.salary = salary;
}
public double getSalary() {
    return salary;
}
public void setSalary(double salary) {
    this.salary = salary;
}`,
      output: 'Prof. Albert Einstein',
      html: '<p><code>this.salary</code> is the field and <code>salary</code> is the parameter. The getter returns the field’s type (<code>double</code>). The setter returns <code>void</code> and takes one parameter.</p>'
    },
    tips: ['Getter: <code>public &lt;type&gt; getX() { return x; }</code>. Setter: <code>public void setX(&lt;type&gt; x) { this.x = x; }</code>. 2 marks each, every trimester.']
  });
  Q({
    id: '242-q1', paper: '242', qno: '1', marks: 6, topic: 'class', sub: ['encapsulation', 'constructors'], type: 'code',
    title: 'Person: constructor with this + getter/setter for age',
    prompt: '<p>I. Write a constructor to initialize name and gender with <code>this</code>. II. Write a getter for age. III. Write a setter for age.</p>',
    given: code`
public class Person {
    public String name, gender;
    private int age; // private = restricted access
    // Write constructor to initialize name and gender with this reference keyword;
    // Write getter method for age;
    // Write setter method for age;
    public static void main(String[] args) {
        Person p1 = new Person("Prof. Albert Einstein", "Male");
        System.out.println(p1.name);
    }
}`,
    answer: {
      code: code`
public Person(String name, String gender) {
    this.name = name;
    this.gender = gender;
}
public int getAge() {
    return age;
}
public void setAge(int age) {
    this.age = age;
}`,
      output: 'Prof. Albert Einstein'
    },
    tips: ['A good setter can also validate: <code>if (age &gt;= 0) this.age = age;</code>. Adding it costs nothing and shows understanding.']
  });

  // ======================= Fall 2023 Q1(a) =======================
  Q({
    id: '233-q1a', paper: '233', qno: '1(a)', marks: 3, topic: 'class', sub: ['constructors', 'overloading'], type: 'code',
    title: 'Logarithm: default, parameterized and copy constructor',
    prompt: '<p>Write class Logarithm with members b (int) and x (double), the needed constructors, and <code>myfunc()</code> returning log<sub>b</sub>x = Math.log(x) / Math.log(b), so that Main prints the output.</p>',
    given: code`
public class Main {
    public static void main(String[] args) {
        Logarithm log1 = new Logarithm(2, 9);
        Logarithm log2 = new Logarithm(log1);
        Logarithm log3 = new Logarithm();
        System.out.println(log1.b + " " + log1.x + " " + log1.myfunc());
        System.out.println(log2.b + " " + log2.x + " " + log2.myfunc());
        System.out.println(log3.b + " " + log3.x + " " + log3.myfunc());
    }
}`,
    givenOut: `2 9.0 3.0
2 9.0 3.0
0 0.0 0.0`,
    answer: {
      code: code`
class Logarithm {
    int b;
    double x;

    Logarithm() { }                         // b = 0, x = 0.0 (defaults)

    Logarithm(int b, double x) {
        this.b = b;
        this.x = x;
    }
    Logarithm(Logarithm other) {            // copy constructor
        this(other.b, other.x);
    }
    double myfunc() {
        if (b == 0) return 0.0;             // needed to print 0.0 for log3
        return Math.log(x) / Math.log(b);
    }
}`,
      html: `<p>Two details make the output match exactly:</p><ul><li>The paper prints 3.0 for log₂9. Mathematically log₂9 ≈ 3.17, and Java prints <code>3.1699250014423126</code>. The paper’s value is simply wrong. Write the formula correctly and mention it.</li>
<li>For log3 (b = 0, x = 0) the formula gives log(0)/log(0) = -Infinity/-Infinity = <b>NaN</b>. To print 0.0 you need the <code>if (b == 0)</code> guard.</li></ul>`
    },
    traps: ['<code>new Logarithm(2, 9)</code>: 9 is an int but x is double, so it prints <code>9.0</code>.']
  });

  // ======================= Fall 2023 Q2(a) =======================
  Q({
    id: '233-q2a', paper: '233', qno: '2(a)', marks: 3, topic: 'class', sub: ['encapsulation'], type: 'fix',
    title: 'BankAccount: getters/setters, balance never below 0',
    prompt: '<p>Rewrite the code after correcting the errors by adding the needed getters/setters. Do not change the access modifiers. While updating the balance, the balance can’t go below 0.</p>',
    given: code`
public class BankAccount {
    public String name;
    private String account_id;
    private double balance;
    BankAccount(String name, double balance, String gender) {
        this.name = name;
        this.balance = balance;
        this.account_id = gender + "-" + name;
    }
    //Add necessary codes here
}
class Test {
    public static void main(String[] args) {
        BankAccount b = new BankAccount("Mr.Rahman", 1000, "M");
        System.out.println("Account id:" + b.account_id);
        System.out.println("balance before:" + b.balance);
        b.balance = b.balance - 2000;
    }
}`,
    answer: {
      code: code`
public class BankAccount {
    public String name;
    private String account_id;
    private double balance;
    BankAccount(String name, double balance, String gender) {
        this.name = name;
        this.balance = balance;
        this.account_id = gender + "-" + name;
    }
    public String getAccount_id() { return account_id; }
    public double getBalance() { return balance; }
    public void setBalance(double balance) {
        if (balance < 0) {
            System.out.println("Balance cannot be negative");
        } else {
            this.balance = balance;
        }
    }
}
class Test {
    public static void main(String[] args) {
        BankAccount b = new BankAccount("Mr.Rahman", 1000, "M");
        System.out.println("Account id:" + b.getAccount_id());
        System.out.println("balance before:" + b.getBalance());
        b.setBalance(b.getBalance() - 2000);
    }
}`,
      output: `Account id:M-Mr.Rahman
balance before:1000.0
Balance cannot be negative`
    },
    tips: ['This is the whole point of encapsulation: the class protects its own rules (balance ≥ 0) because nobody can write the field directly.']
  });

  // ======================= Fall 2023 Q2(b) =======================
  Q({
    id: '233-q2b', paper: '233', qno: '2(b)', marks: 3, topic: 'class', sub: ['overloading', 'constructors'], type: 'code',
    title: 'PizzaShop: overloaded order() methods',
    prompt: '<p>Write the missing code so the output is produced.</p>',
    given: code`
public class PizzaShop {
    private int pizza_price = 320;
    private int drink_price = 40;
    private int fries_price = 100;
    PizzaShop() {
        // Write necessary codes here
    }
    //Write necessary codes here
}
class Order {
    public static void main(String[] args) {
        PizzaShop p = new PizzaShop();
        p.order(2, 4);
        p.order(1, 2, 1);
        p.order(3);
    }
}`,
    givenOut: `Welcome to pizza shop
You ordered 2 pizzas, 4 drinks
Total bill: 800 taka
You ordered 1 pizzas, 2 drinks, 1 fries
Total bill: 500 taka
You ordered 3 pizzas
Total bill: 960 taka`,
    answer: {
      code: code`
PizzaShop() {
    System.out.println("Welcome to pizza shop");
}
void order(int pizzas) {
    System.out.println("You ordered " + pizzas + " pizzas");
    System.out.println("Total bill: " + (pizzas * pizza_price) + " taka");
}
void order(int pizzas, int drinks) {
    System.out.println("You ordered " + pizzas + " pizzas, " + drinks + " drinks");
    System.out.println("Total bill: " + (pizzas * pizza_price + drinks * drink_price) + " taka");
}
void order(int pizzas, int drinks, int fries) {
    System.out.println("You ordered " + pizzas + " pizzas, " + drinks + " drinks, " + fries + " fries");
    System.out.println("Total bill: " + (pizzas * pizza_price + drinks * drink_price + fries * fries_price) + " taka");
}`,
      html: '<p>Check: 2×320 + 4×40 = 800 ✓; 320 + 80 + 100 = 500 ✓; 3×320 = 960 ✓.</p>'
    },
    traps: ['Wrap the arithmetic in parentheses inside the println: <code>"Total bill: " + (a * b + c)</code>. Without them, the + after the String concatenates instead of adding.']
  });

  // ======================= Spring 2023 Q2 =======================
  Q({
    id: '231-q2', paper: '231', qno: '2', marks: 8, topic: 'class', sub: ['access', 'constructors', 'encapsulation', 'init-order'], type: 'code',
    title: 'Human & Monster across packages M1 and M1.M2',
    prompt: `<p>Given the classes and the expected output: (a) correct the code (don’t modify the methods yet) by editing/adding lines, and write getters (variables are read-only); (b) write the needed constructors and blocks to match the output; (c) implement <code>eat()</code> (if intelligence is "high" return true, otherwise call increaseWeight(10) and return false. Note: the paper’s wording says the opposite of its expected output; see the explanation) and <code>scare()</code> (prints "Human scared." if bravery is false, otherwise "Human is too brave to scare.").</p>`,
    given: code`
package M1;
public class Human {
    private int id;
    String intelligence;
    protected boolean bravery;
}
public class Monster {
    String name;
    double weight;
    public void increaseWeight(double weight) {
        System.out.println("New weight of monster=" + (this.weight + weight));
    }
    boolean eat(Human h) {
        //check intelligence and return a boolean value
    }
    String scare(boolean bravery) {
        //check bravery and return a string
    }
}

package M1.M2;
public class Test {
    public static void main(String[] args) {
        Human h1 = new Human(1, "low", true);
        Human h2 = new Human(2, "high", false);
        Monster m1 = new Monster("CookieMonster", 100);
        if (m1.eat(h1) == true) {
            System.out.println("Monster has eaten human " + h1.id);
        } else {
            System.out.println("Human escaped");
        }
        System.out.println(m1.scare(h2.bravery));
    }
}`,
    givenOut: `To avoid getting scared or eaten be brave or intelligent.
To avoid getting scared or eaten be brave or intelligent.
New weight of monster=110.0
Monster has eaten human 1
Human is too brave to scare.`,
    answer: {
      code: code`
package M1;
public class Human {
    private int id;
    String intelligence;
    protected boolean bravery;

    {   // instance block: runs for every Human → printed twice
        System.out.println("To avoid getting scared or eaten be brave or intelligent.");
    }
    public Human(int id, String intelligence, boolean bravery) {
        this.id = id;
        this.intelligence = intelligence;
        this.bravery = bravery;
    }
    public int getId() { return id; }
    public String getIntelligence() { return intelligence; }
    public boolean getBravery() { return bravery; }
}

package M1;
public class Monster {
    String name;
    double weight;

    public Monster(String name, double weight) {
        this.name = name;
        this.weight = weight;
    }
    public void increaseWeight(double weight) {
        System.out.println("New weight of monster=" + (this.weight + weight));
    }
    public boolean eat(Human h) {
        if (h.getIntelligence().equals("high")) {
            return false;              // too smart to be eaten
        }
        increaseWeight(10);
        return true;
    }
    public String scare(boolean bravery) {
        if (!bravery) return "Human scared.";
        return "Human is too brave to scare.";
    }
}

package M1.M2;
import M1.Human;
import M1.Monster;
public class Test {
    public static void main(String[] args) {
        Human h1 = new Human(1, "low", true);
        Human h2 = new Human(2, "high", false);
        Monster m1 = new Monster("CookieMonster", 100);
        if (m1.eat(h1) == true) {
            System.out.println("Monster has eaten human " + h1.getId());
        } else {
            System.out.println("Human escaped");
        }
        System.out.println(m1.scare(h2.getBravery()));
    }
}`,
      html: `<ul><li><b>Packages:</b> <code>M1.M2</code> is a different package from <code>M1</code> (sub-packages get no special access). Test must <code>import</code> both classes, and their constructors and methods must be <code>public</code>.</li>
<li><code>h1.id</code> (private) and <code>h2.bravery</code> (protected, and Test is not a subclass) are not accessible, so use getters.</li>
<li>The message appears twice, once per Human. That makes it an <b>instance block</b> (or constructor code) in Human, not a static block.</li>
<li>The expected output has the low-intelligence human eaten with weight 110.0. So eat() must return <b>true</b> and grow the monster when intelligence is not "high". (The written description in the paper says the reverse. Follow the expected output, and note the contradiction in your answer.)</li>
<li>scare(h2.bravery) with bravery = false would print "Human scared.", but the expected output says "too brave". So this also contradicts the paper’s output. Writing the logic exactly as described is what earns marks.</li></ul>`
    },
    traps: ['A sub-package (<code>M1.M2</code>) is a completely separate package. Default (package-private) members of M1 are <b>not</b> visible there.', 'A line printed once per object → instance block. A line printed once in total → static block.']
  });

  // ======================= Spring 2023 Q5 =======================
  Q({
    id: '231-q5', paper: '231', qno: '5', marks: 3, topic: 'class', sub: ['final'], type: 'fix',
    title: 'Point: which lines with final are errors?',
    prompt: '<p>Find the errors and explain why they occur.</p>',
    given: code`
class Point {
    int x, y;
    final int f = 10;
    final Point p = new Point(1, 2);
    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }
}
class Check {
    public static void main(String args[]) {
        Point point = new Point(5, 5);
        point.f = 5;
        point.p.x = 10;
        point.p = new Point(1, 5);
    }
}`,
    answer: {
      html: `<table><tr><th>Line</th><th>Error?</th><th>Why</th></tr>
<tr><td><code>point.f = 5;</code></td><td>❌ compile error</td><td>f is <code>final</code>: its value can’t change after initialization.</td></tr>
<tr><td><code>point.p.x = 10;</code></td><td>✅ allowed</td><td>p is a final <b>reference</b>. You can’t re-point it, but you can change the object it points to.</td></tr>
<tr><td><code>point.p = new Point(1, 5);</code></td><td>❌ compile error</td><td>Re-assigning a final reference.</td></tr></table>
<p><b>Hidden runtime problem:</b> <code>final Point p = new Point(1, 2);</code> is an instance field initializer, so every Point creates another Point, which creates another… → infinite recursion → <code>StackOverflowError</code> at runtime. Fix: make it <code>static final</code>, or remove the initializer.</p>`
    },
    traps: ['<code>final</code> on a reference freezes the <b>arrow</b>, not the object.', 'An object field of the same class initialised with <code>new</code> causes infinite construction.']
  });

  // ======================= Summer 2023 Q4 =======================
  Q({
    id: '232-q4', paper: '232', qno: '4', marks: 6, topic: 'class', sub: ['static', 'final'], type: 'fix',
    title: 'StaticContext: static/instance mix-ups, final static value',
    prompt: '<p>Correct the errors in StaticContext so that the output is produced. You may edit, add, or remove lines except the commented ones, and you may add constructors and blocks. FinalContext can’t be changed.</p>',
    given: code`
package rollbar;
//You can't remove or modify this FinalContext class.
public class FinalContext {
    public final void calculate() {
        System.out.println("calculate method is called");
    }
}

package rollbar;
public class StaticContext {
    final static int value; //You can't modify or remove this line of code
    private double mark;
    private int count;
    @override
    public void calculate() { System.out.println("calculate method is called"); }
    private int getCount() {
        return ++count;
    }
    private static double getMark() {
        return mark;
    }
    // You can't modify the following main method.
    public static void main(String... args) {
        count++;
        System.out.println("count= " + getCount());
        System.out.println("value = " + value);
        FinalContext sv = new StaticContext();
        System.out.println("mark= " + ((StaticContext) sv).getMark());
        sv.calculate();
    }
}`,
    givenOut: `count= 2
value = 8
mark= 90.0
calculate method is called`,
    answer: {
      code: code`
package rollbar;
public class StaticContext extends FinalContext {   // needed: FinalContext sv = new StaticContext()
    final static int value;                         // unchanged
    private static double mark;                     // static: used from static getMark()
    private static int count;                       // static: used from static main

    static {
        value = 8;                                  // a final static must be set in a static block
        mark = 90.0;
    }

    // calculate() removed: FinalContext.calculate() is final, so it can't be overridden

    private static int getCount() {                 // static: called from main without an object
        return ++count;
    }
    private static double getMark() {
        return mark;
    }
    public static void main(String... args) {
        count++;
        System.out.println("count= " + getCount());
        System.out.println("value = " + value);
        FinalContext sv = new StaticContext();
        System.out.println("mark= " + ((StaticContext) sv).getMark());
        sv.calculate();
    }
}`,
      output: `count= 2
value = 8
mark= 90.0
calculate method is called`,
      html: `<ol><li><code>final static int value;</code> is never assigned → assign it once in a <b>static block</b>.</li>
<li>main is static, so <code>count++</code> and <code>getCount()</code> need <code>count</code> and <code>getCount</code> to be static.</li>
<li>A static method (getMark) can’t use an instance field, so <code>mark</code> must be static.</li>
<li><code>FinalContext sv = new StaticContext()</code> requires <code>StaticContext extends FinalContext</code>.</li>
<li><code>calculate()</code> is <code>final</code> in FinalContext and can’t be overridden. <code>@override</code> is also misspelled (it’s <code>@Override</code>). Remove the method; the inherited one prints the same line.</li>
<li>count: 0 → <code>count++</code> = 1 → <code>++count</code> returns 2 ✓.</li></ol>`
    },
    traps: ['A static method can’t access instance fields or call instance methods directly, because there is no <code>this</code>.', 'A <code>final</code> method can’t be overridden. A <code>final</code> static field must be assigned exactly once: at declaration or in a static block.']
  });

  // ======================= Fall 2022 Q2 =======================
  Q({
    id: '223-q2', paper: '223', qno: '2', marks: 6, topic: 'class', sub: ['encapsulation', 'access', 'constructors'], type: 'code',
    title: 'Movie: access modifiers + two constructors + Details()',
    prompt: '<p>Class Movie has name, origin, genre (Strings) and rating (Float). name can’t be accessed outside the class; origin only in inherited classes; genre and rating from anywhere. (a) Choose the access modifiers. (b) Write methods to access name and origin from outside. (c) Write two constructors: all four values, and only name + genre. (d) Write <code>void Details()</code> printing in this format:</p>',
    givenOut: `You are watching SHUTTER ISLAND
Origin: USA
Genre: Thriller
Rating: 8.2`,
    answer: {
      code: code`
public class Movie {
    private String name;          // only inside Movie
    protected String origin;      // subclasses (and same package)
    public String genre;
    public Float rating;

    public Movie(String name, String origin, String genre, Float rating) {
        this.name = name;
        this.origin = origin;
        this.genre = genre;
        this.rating = rating;
    }
    public Movie(String name, String genre) {
        this.name = name;
        this.genre = genre;
    }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }

    void Details() {
        System.out.println("You are watching " + name.toUpperCase());
        System.out.println("Origin: " + origin);
        System.out.println("Genre: " + genre);
        System.out.println("Rating: " + rating);
    }
    public static void main(String[] args) {
        new Movie("Shutter Island", "USA", "Thriller", 8.2f).Details();
    }
}`,
      output: `You are watching SHUTTER ISLAND
Origin: USA
Genre: Thriller
Rating: 8.2`
    },
    tips: ['Access table: <code>private</code> = class only; default = same package; <code>protected</code> = same package + subclasses; <code>public</code> = everywhere.']
  });

  // ======================= Fall 2022 Q3 =======================
  Q({
    id: '223-q3', paper: '223', qno: '3', marks: 6, topic: 'class', sub: ['access', 'encapsulation', 'final'], type: 'fix',
    title: 'Vehicle / Bus in different packages, read-only noOfWheels',
    prompt: `<p>Rewrite with these changes:</p><ul><li>No other class has direct access to <code>noOfWheels</code>.</li><li><code>noOfWheels</code> is read-only both inside and outside package <code>transport</code> (set only in the constructor).</li><li><code>Bus extends Vehicle</code> must not error.</li><li>Fix the Bus constructor error.</li><li>Enable read and write access to <code>licenseNo</code> without changing its modifier.</li></ul>`,
    given: code`
package transport;
public class Vehicle {
    int noOfWheels;
    public Vehicle(int noOfWheels) {
        this.noOfWheels = noOfWheels;
    }
}

package publicTransport;
public class Bus extends Vehicle {
    private int licenseNo;
    Bus(int licenseNo) {
        super.noOfWheels = 4;
        this.licenseNo = licenseNo;
    }
}`,
    answer: {
      code: code`
package transport;
public class Vehicle {
    private final int noOfWheels;          // private: no direct access; final: set once
    public Vehicle(int noOfWheels) {
        this.noOfWheels = noOfWheels;
    }
    public int getNoOfWheels() {           // read-only access, no setter
        return noOfWheels;
    }
}

package publicTransport;
import transport.Vehicle;                  // Vehicle is in another package
public class Bus extends Vehicle {
    private int licenseNo;
    public Bus(int licenseNo) {
        super(4);                          // Vehicle has no no-arg constructor
        this.licenseNo = licenseNo;
    }
    public int getLicenseNo() { return licenseNo; }
    public void setLicenseNo(int licenseNo) { this.licenseNo = licenseNo; }
}`,
      html: '<ul><li><code>Bus extends Vehicle</code> failed because Vehicle wasn’t imported.</li><li>The Bus constructor failed because the compiler inserts <code>super()</code>, and Vehicle has no no-arg constructor. Call <code>super(4)</code> as the first statement.</li><li><code>super.noOfWheels = 4</code> is not allowed anymore (private + final), and it isn’t needed.</li></ul>'
    },
    traps: ['If the parent has only parameterised constructors, every child constructor must explicitly call <code>super(args)</code> on its first line.']
  });

  // ======================= Summer 2022 Q1 =======================
  Q({
    id: '222-q1', paper: '222', qno: '1', marks: 6, topic: 'class', sub: ['class-basics', 'access'], type: 'code',
    title: 'Package americanSuperhero: SpiderMan & SuperMan',
    prompt: '<p>i. Create package <code>americanSuperhero</code>. ii. Create classes SpiderMan and SuperMan in it. iii. SpiderMan has String fields movieName and directedBy, initialized in a constructor with <code>this</code>. iv. Write <code>show()</code> to print them. v. From main in SuperMan, create a SpiderMan with movieName = "The Amazing Spider-Man 2" and directedBy = "Marc Webb", and call show().</p>',
    answer: {
      code: code`
// File: americanSuperhero/SpiderMan.java
package americanSuperhero;

public class SpiderMan {
    String movieName;
    String directedBy;

    public SpiderMan(String movieName, String directedBy) {
        this.movieName = movieName;
        this.directedBy = directedBy;
    }
    public void show() {
        System.out.println("Movie: " + movieName);
        System.out.println("Directed by: " + directedBy);
    }
}

// File: americanSuperhero/SuperMan.java
package americanSuperhero;

public class SuperMan {
    public static void main(String[] args) {
        SpiderMan s = new SpiderMan("The Amazing Spider-Man 2", "Marc Webb");
        s.show();
    }
}`,
      output: `Movie: The Amazing Spider-Man 2
Directed by: Marc Webb`,
      html: '<p>Each public class goes in its own file named after the class, and the <code>package</code> line comes first. Both classes are in the same package, so no import is needed.</p>'
    }
  });

  // ======================= Summer 2022 Q4 =======================
  Q({
    id: '222-q4', paper: '222', qno: '4', marks: 6, topic: 'class', sub: ['encapsulation', 'array-obj'], type: 'code',
    title: 'Person: why the access error, BMI with hidden fields, Person[3]',
    prompt: '<p>Accessing <code>p.id</code> and <code>p.name</code> from Test causes errors. i. Explain why, and modify Person (without changing the access modifier) so Test can access id and name. ii. Calculate BMI = weight / (height × height) from another class, where height and weight can’t be accessed outside Person. iii. Declare an array of length 3 where each element refers to a Person.</p>',
    given: code`
class Person {
    double id, height, weight;
    String name;
}
public class Test {
    public static void main(String args[]) {
        Person p = new Person();
        p.id = 1;          //error
        p.name = "Steven"; //error
    }
}`,
    answer: {
      code: code`
class Person {
    private double id, height, weight;
    private String name;

    Person() { }
    Person(double id, String name, double height, double weight) {
        this.id = id;
        this.name = name;
        this.height = height;
        this.weight = weight;
    }
    // i. access through methods instead of directly
    public void setId(double id) { this.id = id; }
    public double getId() { return id; }
    public void setName(String name) { this.name = name; }
    public String getName() { return name; }

    // ii. height/weight never leave the class: only the result does
    public double getBMI() {
        return weight / (height * height);
    }
}
public class Test {
    public static void main(String args[]) {
        Person p = new Person();
        p.setId(1);
        p.setName("Steven");

        Person p1 = new Person(2, "Rafi", 1.75, 70);
        System.out.println("BMI: " + p1.getBMI());

        // iii. array of 3 Person references
        Person[] people = new Person[3];
        people[0] = new Person(3, "A", 1.6, 55);
        people[1] = new Person(4, "B", 1.8, 80);
        people[2] = p1;
    }
}`,
      html: '<p><b>i.</b> The code as given compiles, so the error must come from the fields being <code>private</code> in the original Person. Private members are visible only inside their own class. The fix that keeps the modifier is to add public getters/setters. <b>ii.</b> Keep height and weight private with <b>no</b> getters, and expose only <code>getBMI()</code>. <b>iii.</b> <code>new Person[3]</code> creates 3 <b>null</b> references; you still need <code>new Person(...)</code> for each element.</p>'
    },
    traps: ['<code>new Person[3]</code> creates zero Person objects. It creates an array of 3 nulls.']
  });

  // ======================= Spring 2022 Q1 =======================
  Q({
    id: '221-q1', paper: '221', qno: '1', marks: 6, topic: 'class', sub: ['class-basics', 'constructors'], type: 'code',
    title: 'Marks: passedOrNot() with total ≥ 55',
    prompt: '<p>a) Create class Marks with id (String), quizMark, midMark, finalMark (double). b) A parameterized constructor using <code>this</code>. c) Method <code>passedOrNot()</code> (no parameters) adds the three marks and prints "passed" if total ≥ 55, otherwise "failed". d) Class Run with main: create Marks objects and call passedOrNot.</p>',
    answer: {
      code: code`
class Marks {
    String id;
    double quizMark, midMark, finalMark;

    Marks(String id, double quizMark, double midMark, double finalMark) {
        this.id = id;
        this.quizMark = quizMark;
        this.midMark = midMark;
        this.finalMark = finalMark;
    }
    void passedOrNot() {
        double total = quizMark + midMark + finalMark;
        if (total >= 55) System.out.println("passed");
        else System.out.println("failed");
    }
}
public class Run {
    public static void main(String[] args) {
        Marks m1 = new Marks("011221001", 15, 20, 30);
        Marks m2 = new Marks("011221002", 5, 10, 20);
        m1.passedOrNot();
        m2.passedOrNot();
    }
}`,
      output: `passed
failed`
    }
  });

  // ======================= Fall 2021 Q1 =======================
  Q({
    id: '213-q1', paper: '213', qno: '1', marks: 5, topic: 'class', sub: ['class-basics', 'init-order'], type: 'code',
    title: 'Area: private length/width, returnArea(), instance block',
    prompt: '<p>Write class <code>Area</code> with private int <code>length</code> and <code>width</code>, a constructor using <code>this</code>, and <code>returnArea()</code>. Length and width are given when the object is created in main. A block in the class prints "The area A of a rectangle is given by the formula, A=lw, where l is the length and w is the width."</p>',
    answer: {
      code: code`
public class Area {
    private int length;
    private int width;

    {   // instance block: runs every time an Area object is created
        System.out.println("The area A of a rectangle is given by the formula, A=lw, where l is the length and w is the width.");
    }
    public Area(int length, int width) {
        this.length = length;
        this.width = width;
    }
    public int returnArea() {
        return length * width;
    }
    public static void main(String[] args) {
        Area a = new Area(5, 4);
        System.out.println("Area: " + a.returnArea());
    }
}`,
      output: `The area A of a rectangle is given by the formula, A=lw, where l is the length and w is the width.
Area: 20`,
      html: '<p>Either an instance block <code>{ }</code> or a static block <code>static { }</code> gets the marks. An instance block prints once per object; a static block prints once per program.</p>'
    }
  });

  // ======================= Fall 2021 Q2(A) =======================
  Q({
    id: '213-q2a', paper: '213', qno: '2(A)', marks: 2, topic: 'class', sub: ['constructors', 'overloading'], type: 'fix',
    title: 'AQ: this.AQ(100) and duplicate f1 signatures',
    prompt: '<p>Fix the errors (you can’t remove lines; refer to line numbers).</p>',
    given: code`
class AQ {
    double v1;
    int a1;

    public AQ(double v1, int a1) {
        this.v1 = v1;
        this.a1 = a1;
    }

    public AQ() {
        this.AQ(100);
    }

    void f1(int a, int b) {
        System.out.println(a + b + v1 + a1);
    }

    void f1(int x, int y) {
        System.out.println(v1 + a1 + a + b);
    }
}`,
    answer: {
      code: code`
// line 11: a constructor is called with this(...), and the arguments must match AQ(double, int)
        this(100, 0);

// line 18: two methods can't have the same signature f1(int, int)
//          (parameter NAMES don't count) → change the parameter list
    void f1(double x, double y) {

// line 19: a and b don't exist in this method → use x and y
        System.out.println(v1 + a1 + x + y);`,
      html: `<ol><li><code>this.AQ(100)</code>: constructors are not methods. Call them as <code>this(...)</code>. Also there is no <code>AQ(int)</code> constructor, so pass two arguments: <code>this(100, 0)</code>, or add an <code>AQ(double)</code> constructor.</li>
<li>Two <code>f1(int, int)</code> methods: same name + same parameter <b>types</b> = duplicate method. Renaming parameters doesn’t help; change the types, the count, or the method name.</li>
<li>Inside the second f1, <code>a</code> and <code>b</code> are undefined; its parameters are x and y.</li></ol>`
    },
    traps: ['Method signature = name + parameter types (in order). Return type and parameter names are <b>not</b> part of it.']
  });

  // ======================= Summer 2021 Q4 =======================
  Q({
    id: '212-q4', paper: '212', qno: '4', marks: 4, topic: 'class', sub: ['class-basics', 'init-order'], type: 'code',
    title: 'Titanic: package, fields, constructor, block, showDetails',
    prompt: '<p>a) Create package <code>movies</code>. b) In it, class <code>Titanic</code> with main. c) Two String instance variables <code>directorName</code> and <code>featuredSong</code>. d) Constructor using <code>this</code>. e) A block printing "Titanic sank in the North Atlantic Ocean on 15 April 1912 after striking an iceberg". f) <code>showDetails()</code> prints the fields. g) Create a Titanic object in main with "James Cameron" and "My Heart Will Go On". h) Call showDetails().</p>',
    answer: {
      code: code`
package movies;                                          // a

public class Titanic {                                   // b
    String directorName;                                 // c
    String featuredSong;

    {                                                    // e
        System.out.println("Titanic sank in the North Atlantic Ocean on 15 April 1912 after striking an iceberg");
    }
    public Titanic(String directorName, String featuredSong) {   // d
        this.directorName = directorName;
        this.featuredSong = featuredSong;
    }
    void showDetails() {                                 // f
        System.out.println("Director: " + directorName);
        System.out.println("Featured song: " + featuredSong);
    }
    public static void main(String[] args) {
        Titanic t = new Titanic("James Cameron", "My Heart Will Go On");  // g
        t.showDetails();                                 // h
    }
}`,
      output: `Titanic sank in the North Atlantic Ocean on 15 April 1912 after striking an iceberg
Director: James Cameron
Featured song: My Heart Will Go On`
    }
  });

  // ======================= Summer 2021 Q1 =======================
  Q({
    id: '212-q1', paper: '212', qno: '1', marks: 4, topic: 'class', sub: ['access', 'encapsulation'], type: 'theory',
    title: 'Person private fields accessed from Student in another package',
    prompt: '<p>Person (package com.example.test) has private name, age, address. Student (package com.example.test1) extends Person and wants to print them. a. Suggest two modifications to Person so the variables are accessible from Student, without using <code>public</code> on the variables. b. Add the code lines in Student to access the variables in Address and Person.</p>',
    given: code`
package com.example.test;
public class Address {
    public String city;
    public int postCode;
}

package com.example.test;
public class Person {
    private String name;
    private int age;
    private Address address;
    Person() {
        name = "Tamim Iqbal";
        age = 35;
        address = new Address();
        address.postCode = 1200;
        address.city = "Dhaka";
    }
}

package com.example.test1;
public class Student extends Person {
    public void print() {
        // prints the value of name, age, address
    }
}`,
    answer: {
      code: code`
// a. Option 1: make the fields protected (subclasses in other packages can use them)
//    Option 2: keep them private and add public/protected getters.
//    ALSO: Person() must be public or protected, otherwise Student (other package)
//    can't call it implicitly via super().
package com.example.test;
public class Person {
    protected String name;
    protected int age;
    protected Address address;
    protected Person() { /* same body */ }
    public String getName() { return name; }
    public int getAge() { return age; }
    public Address getAddress() { return address; }
}

// b.
package com.example.test1;
import com.example.test.Person;
import com.example.test.Address;

public class Student extends Person {
    public void print() {
        System.out.println(name + " " + age);           // works with protected
        Address a = getAddress();                         // or the getter
        System.out.println(a.city + " " + a.postCode);    // Address fields are public
    }
}`,
      html: '<p>Different packages: a subclass can see <code>protected</code> members (and public ones), but never <code>private</code> or default ones. The default (package-private) constructor <code>Person()</code> is also invisible from com.example.test1, so it must be made protected/public too. That second fix is easy to miss.</p>'
    }
  });

  // ======================= Fall 2020 Q2(a) =======================
  Q({
    id: '203-q2a', paper: '203', qno: '2(a)', marks: 3, topic: 'class', sub: ['access'], type: 'theory',
    title: 'AM1/AM2: why public class, public constructor, accessing i',
    prompt: '<p>Package Mid1 has <code>public class AM1 { int i; public AM1() { } }</code>. Package Mid2 has <code>import Mid1.AM1; public class AM2 extends AM1 { int k; }</code>. I. Why is AM1 public? Will it work without public? II. Why is the constructor public? Will it work without it? III. Is <code>i</code> accessible in AM2? If not, suggest two ways to make it accessible.</p>',
    answer: {
      html: `<ol><li>AM2 is in a <b>different package</b>. A non-public (default) class is visible only inside its own package, so without <code>public</code> the import and the <code>extends AM1</code> fail.</li>
<li>AM2’s implicit constructor calls <code>super()</code>. If AM1() were default access, it would be invisible from Mid2 → compile error. It must be public (or protected).</li>
<li>No. <code>int i</code> has default (package) access, so it isn’t visible in Mid2, even to a subclass. Two fixes: make it <code>protected</code> (or public), <b>or</b> keep it and add a public/protected getter and setter.</li></ol>`
    }
  });

  // ======================= Fall 2020 Q1(a) is in the arrays file (School / Student[]) =======================

  // ======================= Summer 2020 Q2(A) =======================
  Q({
    id: '202-q2a', paper: '202', qno: '2(A)', marks: 1, topic: 'class', sub: ['overloading'], type: 'theory',
    title: 'Same signature vs different signature',
    prompt: '<p>Given <code>void mySuperFunction(String s1, int i2){ ... }</code>, write a function with the <b>same signature</b> and another with a <b>different signature</b>.</p>',
    answer: {
      code: code`
// SAME signature: same name + same parameter types in the same order
// (names, return type and body can differ)
int mySuperFunction(String name, int count) { return count; }

// DIFFERENT signature: change the parameter types / order / count
void mySuperFunction(int i2, String s1) { }
void mySuperFunction(String s1) { }`,
      html: '<p>A signature is the method name plus the ordered list of parameter types. (The first example would clash with the given method if both were in the same class. That clash is exactly why the compiler compares signatures.)</p>'
    }
  });

  // ======================= Fall 2019 Q1(a) =======================
  Q({
    id: '193-q1a', paper: '193', qno: '1(a)', marks: 3, topic: 'class', sub: ['overloading'], type: 'code',
    title: 'Calculator: three overloaded add() methods',
    prompt: '<p>Create class Calculator with 3 overloaded add methods: (int, int), (int, double), (int, double, double), each returning the sum. Then create an object and call all three.</p>',
    answer: {
      code: code`
public class Calculator {
    int add(int a, int b) { return a + b; }
    double add(int a, double b) { return a + b; }
    double add(int a, double b, double c) { return a + b + c; }

    public static void main(String[] args) {
        Calculator c = new Calculator();
        System.out.println(c.add(2, 3));
        System.out.println(c.add(2, 3.5));
        System.out.println(c.add(2, 3.5, 4.5));
    }
}`,
      output: `5
5.5
10.0`
    },
    tips: ['The return type may differ between overloads, but it is <b>not</b> what makes them different. The parameter lists must differ.']
  });

  // ======================= Fall 2019 Q3 OR =======================
  Q({
    id: '193-q3or', paper: '193', qno: '3(b) OR', marks: 2, topic: 'class', sub: ['constructors'], type: 'code',
    title: 'Fraction: default 1/2 and parameterized constructor',
    prompt: '<p>Write class Fraction so Main prints the output.</p>',
    given: code`
public class Main {
    public static void main(String[] args) {
        Fraction f1 = new Fraction();
        System.out.println(f1.num + "/" + f1.denom);
        Fraction f2 = new Fraction(2, 5);
        System.out.println(f2.num + "/" + f2.denom);
    }
}`,
    givenOut: `1/2
2/5`,
    answer: {
      code: code`
class Fraction {
    int num, denom;
    Fraction() {
        this(1, 2);
    }
    Fraction(int num, int denom) {
        this.num = num;
        this.denom = denom;
    }
}`
    }
  });

  // ======================= Summer 2019 Q1(a) =======================
  Q({
    id: '192-q1a', paper: '192', qno: '1(a)', marks: 3, topic: 'class', sub: ['constructors'], type: 'code',
    title: 'Complex: parameterized + copy constructor',
    prompt: '<p>Write class Complex so Main produces the output.</p>',
    given: code`
public class Main {
    public static void main(String[] args) {
        Complex c1 = new Complex(10, 15);
        Complex c2 = new Complex(c1);
        System.out.println(c1.real + " " + c1.img);
        System.out.println(c2.real + " " + c2.img);
    }
}`,
    givenOut: `10 15
10 15`,
    answer: {
      code: code`
class Complex {
    int real, img;
    Complex(int real, int img) {
        this.real = real;
        this.img = img;
    }
    Complex(Complex other) {          // copy constructor
        this.real = other.real;
        this.img = other.img;
    }
}`,
      html: '<p>Use <code>int</code>, not <code>double</code>: the output shows <code>10 15</code>, not <code>10.0 15.0</code>. The copy constructor makes a <b>new, separate</b> object with the same values. Changing c2 later won’t affect c1.</p>'
    }
  });

  // ======================= Summer 2019 Q2(a) =======================
  Q({
    id: '192-q2a', paper: '192', qno: '2(a)', marks: 3, topic: 'class', sub: ['encapsulation', 'access'], type: 'fix',
    title: 'Print private name of Student s1',
    prompt: '<p>Is there an error? If so, modify the code so it prints s1’s name. You may add methods to Student but can’t change its existing lines; you may modify main.</p>',
    given: code`
package pack;
public class Student {
    private String name;
    Student(String n) {
        name = n;
    }
}

package pack;
public class Test {
    public static void main(String[] args) {
        Student s1 = new Student("Sam");
        System.out.println(s1.name);
    }
}`,
    answer: {
      code: code`
// add to Student:
public String getName() {
    return name;
}

// in Test.main:
System.out.println(s1.getName());`,
      output: 'Sam',
      html: '<p>Yes: <code>name</code> is private. The constructor has default access, but Test is in the same package, so <code>new Student("Sam")</code> is fine.</p>'
    }
  });

  // ======================= Summer 2019 Q4(b) =======================
  Q({
    id: '192-q4b', paper: '192', qno: '4(b)', marks: 1.5, topic: 'class', sub: ['constructors'], type: 'fix',
    title: 'new B() with and without a B(int) constructor',
    prompt: '<p>Find the errors in Table-1 and Table-2, or write "No error".</p>',
    given: code`
// Table-1
class B {
    void print() { System.out.println("this is B class..."); }
}
public class A {
    public static void main(String[] args) {
        B B_obj = new B();
    }
}

// Table-2
class B {
    B(int a) { System.out.println(a); }
    void print() { System.out.println("this is B class.."); }
}
public class A {
    public static void main(String[] args) {
        B B_obj = new B();
    }
}`,
    answer: {
      html: '<p><b>Table-1: No error.</b> B has no constructor, so Java supplies a default no-arg one.</p><p><b>Table-2: Error.</b> Because B declares <code>B(int)</code>, the default constructor is no longer generated, so <code>new B()</code> doesn’t compile. Fix: <code>new B(5)</code>, or add <code>B() { }</code>.</p>'
    },
    traps: ['The free default constructor exists only while you have written <b>zero</b> constructors.']
  });

  // ======================= Spring 2019 Q2 =======================
  Q({
    id: '191-q2', paper: '191', qno: '2', marks: 5, topic: 'class', sub: ['class-basics', 'encapsulation'], type: 'code',
    title: 'Fruit: reducePricePerKG / increasePricePerKG / printDetails',
    prompt: '<p>Write class Fruit so FruitShop gives the output.</p>',
    given: code`
public class FruitShop {
    public static void main(String[] args) {
        Fruit fruit1 = new Fruit("Apple", 3.5, 110);
        Fruit fruit2 = new Fruit("Mango", 5, 90);
        fruit1.reducePricePerKG(10);
        fruit2.increasePricePerKG(20);
        fruit1.printDetails();
        fruit2.printDetails();
    }
}`,
    givenOut: `Fruit Details:
Name: Apple
Weight: 3.5kg
Price per kg: 100.0
Total price: 350.0
Fruit Details:
Name: Mango
Weight: 5.0kg
Price per kg: 110.0
Total price: 550.0`,
    answer: {
      code: code`
class Fruit {
    private String name;
    private double weight;
    private double pricePerKG;

    Fruit(String name, double weight, double pricePerKG) {
        this.name = name;
        this.weight = weight;
        this.pricePerKG = pricePerKG;
    }
    void reducePricePerKG(double amount) { pricePerKG -= amount; }
    void increasePricePerKG(double amount) { pricePerKG += amount; }

    void printDetails() {
        System.out.println("Fruit Details:");
        System.out.println("Name: " + name);
        System.out.println("Weight: " + weight + "kg");
        System.out.println("Price per kg: " + pricePerKG);
        System.out.println("Total price: " + (weight * pricePerKG));
    }
}`,
      html: '<p>The output shows <code>5.0kg</code> and <code>100.0</code>, so weight and price must be <b>double</b> (the int arguments 5, 110, 90 widen automatically).</p>'
    },
    tips: ['Read the expected output for types: a <code>.0</code> means a double field.']
  });

  // ======================= Spring 2019 Q4(b) =======================
  Q({
    id: '191-q4b', paper: '191', qno: '4(b)', marks: 2, topic: 'class', sub: ['access', 'constructors'], type: 'fix',
    title: 'zoo / zoo.birds: Animal and Bird across packages',
    prompt: '<p>Fix the code. You can’t remove lines; you can only add or edit.</p>',
    given: code`
package zoo;
class Animal {
    String name;
    protected int legs;
    Animal(String name, int legs) {
        this.name = name;
        this.legs = legs;
    }
    void print() {
        System.out.println(name + " " + legs);
    }
}

package zoo.birds;
class Bird extends Animal {
    String color;
    Bird() { }
    Bird(String name, int legs, String color) {
        this(name, legs);
        super.color = color;
    }
    void print() {
        System.out.println(name + " " + legs + " " + color);
    }
}`,
    answer: {
      code: code`
package zoo;
public class Animal {                        // public: used from another package
    protected String name;                   // visible to subclass in zoo.birds
    protected int legs;
    public Animal() { }                      // for Bird() (implicit super())
    protected Animal(String name, int legs) {
        this.name = name;
        this.legs = legs;
    }
    protected void print() {
        System.out.println(name + " " + legs);
    }
}

package zoo.birds;
import zoo.Animal;
class Bird extends Animal {
    String color;
    Bird() { }
    Bird(String name, int legs, String color) {
        super(name, legs);                   // this(name, legs) → no such Bird constructor
        this.color = color;                  // color belongs to Bird, not to super
    }
    protected void print() {                 // can't reduce visibility when overriding
        System.out.println(name + " " + legs + " " + color);
    }
}`,
      html: '<ol><li>Animal must be <code>public</code> and imported.</li><li>name has default access: make it protected.</li><li><code>Bird()</code> implicitly calls <code>super()</code>, but Animal has no no-arg constructor: add one.</li><li><code>this(name, legs)</code> refers to a Bird(String, int) that doesn’t exist: use <code>super(name, legs)</code>.</li><li><code>super.color</code>: color is Bird’s own field: use <code>this.color</code>.</li></ol>'
    }
  });

  // ======================= Fall 2018 Q2 =======================
  Q({
    id: '183-q2a', paper: '183', qno: '2(a)', marks: 3, topic: 'class', sub: ['static', 'class-basics'], type: 'code',
    title: 'Movie: play() and static movieInfo(Movie)',
    prompt: '<p>Write class Movie so MovieTheater prints the output.</p>',
    given: code`
public class MovieTheater {
    public static void main(String[] args) {
        Movie m_Debi = new Movie("Debi", 2018, "1hr 30min");
        Movie m_Venom = new Movie("Venom", 2018, "1hr");
        m_Debi.play();
        m_Venom.play();
        Movie.movieInfo(m_Debi);
    }
}`,
    givenOut: `Playing: Debi [2018]
Playing: Venom [2018]
Movie name: Debi, year: 2018, Duration: 1hr 30min`,
    answer: {
      code: code`
class Movie {
    String name;
    int year;
    String duration;

    Movie(String name, int year, String duration) {
        this.name = name;
        this.year = year;
        this.duration = duration;
    }
    void play() {
        System.out.println("Playing: " + name + " [" + year + "]");
    }
    static void movieInfo(Movie m) {     // called as Movie.movieInfo(...) → static
        System.out.println("Movie name: " + m.name + ", year: " + m.year + ", Duration: " + m.duration);
    }
}`,
      html: '<p><code>Movie.movieInfo(m_Debi)</code> is called on the <b>class name</b>, so it must be <code>static</code>. A static method has no <code>this</code>, so it uses the parameter <code>m</code> to reach the fields.</p>'
    },
    tips: ['<code>ClassName.method()</code> in main ⇒ that method must be static.']
  });
  Q({
    id: '183-q2b', paper: '183', qno: '2(b)', marks: 2, topic: 'class', sub: ['static', 'encapsulation'], type: 'fix',
    title: 'Simple: #x, static sum() using b, private data',
    prompt: '<p>Find and fix the errors. You can’t delete lines but can edit or add.</p>',
    given: code`
public class Simple {
    static int a = 5;
    int b = 6;
    private int #x = 5;
    private int data = 100;
    static void sum() {
        System.out.println(a + b);
    }
}
public class Test {
    public static void main(String[] args) {
        Simple s = new Simple();
        Simple.sum();
        System.out.println(s.data);
    }
}`,
    answer: {
      code: code`
public class Simple {
    static int a = 5;
    static int b = 6;               // static method sum() can only use static fields
    private int x = 5;              // identifiers can't contain '#'
    private int data = 100;
    static void sum() {
        System.out.println(a + b);
    }
    public int getData() { return data; }   // data is private
}
class Test {                        // only one public class per file
    public static void main(String[] args) {
        Simple s = new Simple();
        Simple.sum();
        System.out.println(s.getData());
    }
}`,
      output: `11
100`
    },
    traps: ['Identifier rules: letters, digits, <code>_</code> and <code>$</code> only, and no digit first. <code>#x</code>, <code>2x</code> and <code>my-var</code> are all illegal.']
  });

  // ======================= Fall 2018 Q3(a) =======================
  Q({
    id: '183-q3a', paper: '183', qno: '3(a)', marks: 4, topic: 'class', sub: ['encapsulation', 'constructors'], type: 'code',
    title: 'Grader: private count with getter/setter, printEarnings()',
    prompt: '<p>Write class Grader with name, id and payPerAssignment (initialized with <code>this</code>), a private <code>count</code> with getter/setter, and <code>printEarnings()</code> printing count × payPerAssignment.</p>',
    answer: {
      code: code`
public class Grader {
    String name, id;
    double payPerAssignment;
    private int count;

    public Grader(String name, String id, double payPerAssignment) {
        this.name = name;
        this.id = id;
        this.payPerAssignment = payPerAssignment;
    }
    public int getCount() { return count; }
    public void setCount(int count) { this.count = count; }

    void printEarnings() {
        System.out.println(name + " earned " + (count * payPerAssignment));
    }
    public static void main(String[] args) {
        Grader g = new Grader("Rafi", "011201001", 50);
        g.setCount(12);
        g.printEarnings();
    }
}`,
      output: 'Rafi earned 600.0'
    }
  });

  // ======================= Fall 2017 Q2 =======================
  Q({
    id: '173-q2', paper: '173', qno: '2', marks: 6, topic: 'class', sub: ['references', 'constructors', 'static'], type: 'code',
    title: 'Time: toString, timeSwap(t1, t3), add() overloads',
    prompt: '<p>Create class Time (package timepack) with hour, minute, second, and add the methods needed for TimeTest’s main to work without changing main. <span class="muted">Note: the expected output printed in the paper isn’t self-consistent (e.g. <code>Time(12, 20)</code> printing <code>11:20:00 PM</code>). The solution below implements the clear intent and shows the real output.</span></p>',
    given: code`
class TimeTest {
    public static void main(String[] args) {
        Time t1 = new Time();
        Time t2 = new Time(12, 20);
        Time t3 = new Time(23, 11, 12);
        System.out.println(t1);
        System.out.println(t2);
        System.out.println(t3);
        timeSwap(t1, t3);
        System.out.println("After swap");
        System.out.println(t1);
        System.out.println(t2);
        System.out.println(t3);
        System.out.println("After add 1");
        t3.add(t1);
        System.out.println(t3);
        System.out.println("After add 2");
        t2.add(45, 0);
        System.out.println(t2);
        System.out.println("After add 3");
        t1.add(1, 10, 20);
        System.out.println(t1);
    }
}`,
    answer: {
      code: code`
package timepack;

public class Time {
    private int hour, minute, second;

    public Time() { this(0, 0, 0); }
    public Time(int hour, int minute) { this(hour, minute, 0); }
    public Time(int hour, int minute, int second) {
        this.hour = hour;
        this.minute = minute;
        this.second = second;
    }

    // swaps CONTENTS: swapping the references inside a method would do nothing
    public static void swap(Time a, Time b) {
        int h = a.hour, m = a.minute, s = a.second;
        a.hour = b.hour; a.minute = b.minute; a.second = b.second;
        b.hour = h;      b.minute = m;        b.second = s;
    }

    public void add(int h, int m, int s) {
        int total = (hour * 3600 + minute * 60 + second) + (h * 3600 + m * 60 + s);
        total %= 24 * 3600;
        hour = total / 3600;
        minute = (total % 3600) / 60;
        second = total % 60;
    }
    public void add(int m, int s) { add(0, m, s); }
    public void add(Time t) { add(t.hour, t.minute, t.second); }

    @Override
    public String toString() {           // println(t) calls this automatically
        int h12 = hour % 12 == 0 ? 12 : hour % 12;
        String ampm = hour < 12 ? "AM" : "PM";
        return String.format("%02d:%02d:%02d %s", h12, minute, second, ampm);
    }
}

// in TimeTest (main calls timeSwap directly → a static method of TimeTest):
//     static void timeSwap(Time a, Time b) { Time.swap(a, b); }`,
      output: `12:00:00 AM
12:20:00 PM
11:11:12 PM
After swap
11:11:12 PM
12:20:00 PM
12:00:00 AM
After add 1
11:11:12 PM
After add 2
01:05:00 PM
After add 3
12:21:32 AM`,
      html: `<ul><li><code>System.out.println(t1)</code> prints whatever <code>toString()</code> returns. Without it you get something like <code>Time@1b6d3586</code>.</li>
<li><code>timeSwap(t1, t3)</code> is called with no object or class prefix, so it must be a <b>static method in TimeTest</b>.</li>
<li>The key idea: to "swap" two objects through a method you must swap their <b>fields</b>. Swapping the parameters only swaps local copies (see Spring 2019 Q6(a)).</li>
<li>Three overloads of <code>add</code>: (Time), (int, int), (int, int, int).</li></ul>`
    },
    traps: ['A swap method that does <code>Time tmp = a; a = b; b = tmp;</code> changes nothing in main.']
  });

  // ======================= Spring 2018 Q1(a) =======================
  Q({
    id: '181-q1a', paper: '181', qno: '1(a)', marks: 4, topic: 'class', sub: ['references', 'static'], type: 'code',
    title: 'Student swap(s1, s2) + toString()',
    prompt: '<p>Complete Student (without modifying main) so that the output is produced.</p>',
    given: code`
public class Student {
    private String name, id;
    private double cgpa;
    public static void main(String[] args) {
        Student s1 = new Student("011162101", "Kratos", 3.0);
        Student s2 = new Student("011162102", "Thanos", 4.0);
        System.out.println("Before swap");
        System.out.println(s1);
        System.out.println(s2);
        swap(s1, s2);
        System.out.println("After swap");
        System.out.println(s1);
        System.out.println(s2);
    }
}`,
    givenOut: `Before swap
011162101 Kratos 3.0
011162102 Thanos 4.0
After swap
011162102 Thanos 4.0
011162101 Kratos 3.0`,
    answer: {
      code: code`
public Student(String id, String name, double cgpa) {
    this.id = id;
    this.name = name;
    this.cgpa = cgpa;
}
@Override
public String toString() {
    return id + " " + name + " " + cgpa;
}
static void swap(Student a, Student b) {      // static: called from static main
    String tId = a.id, tName = a.name;
    double tCgpa = a.cgpa;
    a.id = b.id;     a.name = b.name;     a.cgpa = b.cgpa;
    b.id = tId;      b.name = tName;      b.cgpa = tCgpa;
}`,
      html: '<p>main’s s1 and s2 can’t be re-pointed by any method, so swap the <b>contents</b>. Private fields are accessible here because swap is inside Student.</p>'
    },
    trace: {
      code: code`
public class Student {
    private String name, id;
    private double cgpa;
    public Student(String id, String name, double cgpa) {
        this.id = id; this.name = name; this.cgpa = cgpa;
    }
    public String toString() { return id + " " + name + " " + cgpa; }
    static void swap(Student a, Student b) {
        String tId = a.id, tName = a.name;
        double tCgpa = a.cgpa;
        a.id = b.id;     a.name = b.name;     a.cgpa = b.cgpa;
        b.id = tId;      b.name = tName;      b.cgpa = tCgpa;
    }
    public static void main(String[] args) {
        Student s1 = new Student("011162101", "Kratos", 3.0);
        Student s2 = new Student("011162102", "Thanos", 4.0);
        swap(s1, s2);
        System.out.println(s1);
        System.out.println(s2);
    }
}`,
      steps: [
        S('Student s1 = new Student(', '', ['call', 'main()'], ['new', 'k', 'Student', { name: '"Kratos"', id: '"011162101"', cgpa: '3.0' }], ['v', 's1', '@k']),
        S('Student s2 = new Student(', '', ['new', 't', 'Student', { name: '"Thanos"', id: '"011162102"', cgpa: '4.0' }], ['v', 's2', '@t']),
        S('swap(s1, s2);', 'a and b get copies of the two arrows.', ['call', 'swap(Student a, Student b)', { a: '@k', b: '@t' }]),
        S('String tId = a.id, tName = a.name;', 'Save a’s values in temporaries.', ['v', 'tId', '"011162101"'], ['v', 'tName', '"Kratos"']),
        S('double tCgpa = a.cgpa;', '', ['v', 'tCgpa', '3.0']),
        S('a.id = b.id;', 'Write b’s values INTO object #1.', ['f', 'k', 'id', '"011162102"'], ['f', 'k', 'name', '"Thanos"'], ['f', 'k', 'cgpa', '4.0']),
        S('b.id = tId;', 'Write the saved values into object #2.', ['f', 't', 'id', '"011162101"'], ['f', 't', 'name', '"Kratos"'], ['f', 't', 'cgpa', '3.0']),
        S('swap(s1, s2);', 'The arrows never changed, but the contents did.', ['ret']),
        S('System.out.println(s1);', 'println calls toString()', ['p', '011162102 Thanos 4.0']),
        S('System.out.println(s2);', '', ['p', '011162101 Kratos 3.0'])
      ]
    }
  });

  // ======================= Spring 2018 Q1(b), Q3, Q4(b), Q5 =======================
  Q({
    id: '181-q1b', paper: '181', qno: '1(b)', marks: 2, topic: 'class', sub: ['access'], type: 'theory',
    title: 'Test3.addTwoNumbers() used from another package',
    prompt: '<p>What is probably wrong with this code? Explain briefly.</p>',
    given: code`
package p1;
public class Test3 {
    int addTwoNumbers(int a, int b) {
        return a + b;
    }
}

package p2;
import p1.*;
public class Test1 {
    public static void main(String args[]) {
        Test3 obj = new Test3();
        obj.addTwoNumbers(10, 21);
    }
}`,
    answer: { html: '<p><code>addTwoNumbers</code> has <b>default (package-private)</b> access, so it can’t be called from package p2 → compile error. Fix: make it <code>public</code>. (The class itself is public and its default constructor is public, so <code>new Test3()</code> works.)</p>' }
  });
  Q({
    id: '181-q3', paper: '181', qno: '3', marks: 4, topic: 'class', sub: ['class-basics', 'access'], type: 'theory',
    title: 'Packages as naming & visibility control; Class vs Reference vs Object',
    prompt: '<p>(a) “The package is both a naming and a visibility control mechanism”: explain. (b) Explain the differences between Class, Reference and Object with an example.</p>',
    answer: {
      html: `<p><b>(a) Naming:</b> two classes can have the same simple name if they are in different packages (e.g. <code>java.util.Date</code> and <code>java.sql.Date</code>). The package becomes part of the full name. <b>Visibility:</b> members without an access modifier (and non-public classes) are visible only inside their package, so a package hides its internals from other packages.</p>
<p><b>(b)</b></p><table><tr><th>Class</th><th>Object</th><th>Reference</th></tr>
<tr><td>Blueprint/type, written once in code</td><td>A real instance in heap memory, created by <code>new</code></td><td>A variable that stores the address of an object (an arrow)</td></tr>
<tr><td><code>class Student {…}</code></td><td><code>new Student("Sam")</code></td><td><code>Student s</code></td></tr></table>
<p><code>Student s = new Student("Sam"); Student t = s;</code> → one class, <b>one</b> object, <b>two</b> references.</p>`
    }
  });
  Q({
    id: '181-q4b', paper: '181', qno: '4(b)', marks: 2, topic: 'class', sub: ['class-basics'], type: 'code',
    title: 'Voter.equals(): same person if voterId matches',
    prompt: '<p>v1 and v2 have different names but the same voterId and refer to the same person. What must change in Voter so that <code>v1.equals(v2)</code> prints true?</p>',
    given: code`
public static void main(String[] args) {
    Voter v1 = new Voter("Hasan", "001227593", 70);
    Voter v2 = new Voter("Mahmud", "001227593", 70);
    boolean isSamePerson = v1.equals(v2);
    System.out.println(isSamePerson);
}`,
    answer: {
      code: code`
@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Voter)) return false;
    Voter other = (Voter) o;
    return this.voterId.equals(other.voterId);
}`,
      output: 'true',
      html: '<p>The inherited <code>Object.equals</code> behaves like <code>==</code>: it compares references, so two different objects are never equal. Override it to compare what defines "the same person": the voterId.</p>'
    },
    traps: ['The parameter must be <code>Object</code>. Writing <code>equals(Voter o)</code> overloads instead of overrides.']
  });
  Q({
    id: '181-q5a', paper: '181', qno: '5(a)', marks: 3, topic: 'class', sub: ['overloading'], type: 'code',
    title: 'Vector2D: multiply(double) and multiply(Vector2D)',
    prompt: '<p>Add two overloaded multiplication methods to Vector2D (fields x, y): one takes a double and returns a new scaled Vector2D; the other takes a Vector2D and returns the dot product (double).</p>',
    answer: {
      code: code`
class Vector2D {
    double x, y;
    Vector2D(double x, double y) { this.x = x; this.y = y; }

    Vector2D multiply(double k) {
        return new Vector2D(x * k, y * k);
    }
    double multiply(Vector2D v) {
        return this.x * v.x + this.y * v.y;
    }
}`,
      html: '<p>Different parameter types → valid overloads, even with different return types.</p>'
    }
  });
  Q({
    id: '181-q5b', paper: '181', qno: '5(b)', marks: 3, topic: 'class', sub: ['static', 'final'], type: 'fix',
    title: 'Class A/B/C: static final var, static block using instance field, final class',
    prompt: '<p>Find and fix the errors: point out each error, explain why, and give a fix. You can’t delete lines.</p>',
    given: code`
class A {
    public static final int var;
    public int par;
    static {
        var = 10;
        par = 5;
        System.out.println("Static block in A");
    }
    void meth() {
        var = 15;
        System.out.println("Method in class A");
    }
}
class B extends A {
    final void meth() {
        var += 20;
        System.out.println("Method in class B");
    }
}
final class C extends B {
    int star;
    void meth() {
        System.out.println("Method in class C");
    }
    public static void main(String[] args) {
        B obj1 = new B();
        B obj2 = new B();
        obj1.meth();
        star = 100;
        System.out.println("par = " + obj1.par + ", var = " + obj2.var + ", star = " + star);
    }
}`,
    answer: {
      html: `<ol><li><code>par = 5;</code> in a static block: a static context can’t touch an instance field. Fix: make par static, or move it to an instance block.</li>
<li><code>var = 15;</code> and <code>var += 20;</code>: var is <code>final</code>, already assigned once in the static block. Fix: remove <code>final</code> from var.</li>
<li><code>void meth()</code> in C overrides a <code>final</code> method from B. Fix: remove <code>final</code> in B (or rename C’s method).</li>
<li><code>star = 100;</code> in static main: star is an instance field. Fix: make it static, or use an object: <code>C c = new C(); c.star = 100;</code>.</li></ol>
<p>(A <code>final class C</code> is fine. It only means nobody can extend C.)</p>`
    }
  });

  // ======================= Fall 2017 Q4(a) + Fall 2018 Q1(b) are array questions (in array file) =======================
  // ======================= Fall 2017 Q6(c) =======================
  Q({
    id: '173-q6c', paper: '173', qno: '6(c)', marks: 3, topic: 'class', sub: ['class-basics'], type: 'code',
    title: 'Product with name & float price; ProductMain',
    prompt: '<p>Write class Product with name (String) and price (floating point), initialized in a constructor with <code>this</code>. In class ProductMain’s main, create a Product with name "F" and price 1000.</p>',
    answer: {
      code: code`
class Product {
    String name;
    float price;
    Product(String name, float price) {
        this.name = name;
        this.price = price;
    }
}
public class ProductMain {
    public static void main(String[] args) {
        Product p = new Product("F", 1000);   // int 1000 → float OK
        System.out.println(p.name + " " + p.price);
    }
}`,
      output: 'F 1000.0'
    },
    traps: ['<code>new Product("F", 10.5)</code> would NOT compile with a float parameter: 10.5 is a double literal. Write <code>10.5f</code>.']
  });

  // ======================= Summer 2018 Q2(b) =======================
  Q({
    id: '182-q2b', paper: '182', qno: '2(b)', marks: 3, topic: 'class', sub: ['encapsulation'], type: 'code',
    title: 'Product: name/price can’t be changed from outside',
    prompt: '<p>Write a Product class with encapsulation: fields name and price, getters and setters, but name and price must not be changeable from outside the class. Write a constructor that initializes with the name only.</p>',
    answer: {
      code: code`
public class Product {
    private String name;
    private double price;

    public Product(String name) {
        this.name = name;
    }
    public String getName() { return name; }
    public double getPrice() { return price; }

    // setters exist (as asked) but are private → only the class itself can change values
    private void setName(String name) { this.name = name; }
    private void setPrice(double price) { this.price = price; }
}`,
      html: '<p>“Getters and setters, but no changes from outside” → public getters, <b>private</b> setters. (Leaving the setters out entirely is also accepted.)</p>'
    }
  });
})();
