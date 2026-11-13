// Class & Object: output-tracing questions, each with a step-by-step memory trace.
// Every output below was produced by compiling and running the code (see /verify).
(function () {
  const { Q, code } = OOP;
  const S = (l, n, ...o) => ({ l, n, o });

  // ======================= Spring 2026 Q3 =======================
  Q({
    id: '261-q3', paper: '261', qno: '3', marks: 8, topic: 'class', sub: ['init-order', 'static'], type: 'output',
    title: 'Static block, instance block, constructor + shared count',
    prompt: '<p>Trace the following Java program and write the exact output.</p>',
    given: code`
class Test {
    static int count = 0;
    int id = 1;

    static {
        count += 2;
        System.out.println("Static Block");
    }

    {
        count += 3;
        id += count;
        System.out.println("Instance Block");
    }

    Test() {
        count += 5;
        id += 2;
        System.out.println("Constructor");
    }
}

class Main {
    public static void main(String[] args) {
        Test t1 = new Test();
        Test t2 = new Test();
        Test t3 = t1;
        t2.count += 10;
        t3.id += 5;

        System.out.println("t1-count = " + t1.count + ", t1-id = " + t1.id);
        System.out.println("t2-count = " + t2.count + ", t2-id = " + t2.id);
        System.out.println("t3-count = " + t3.count + ", t3-id = " + t3.id);
    }
}`,
    answer: {
      output: `Static Block
Instance Block
Constructor
Instance Block
Constructor
t1-count = 28, t1-id = 13
t2-count = 28, t2-id = 16
t3-count = 28, t3-id = 13`,
      html: `<table><tr><th>Moment</th><th>count (static, shared)</th><th>t1.id</th><th>t2.id</th></tr>
<tr><td>class loads (static block)</td><td>0 + 2 = 2</td><td>–</td><td>–</td></tr>
<tr><td>new Test() #1: <code>id = 1</code>, instance block</td><td>2 + 3 = 5</td><td>1 + 5 = 6</td><td>–</td></tr>
<tr><td>#1 constructor</td><td>5 + 5 = 10</td><td>6 + 2 = 8</td><td>–</td></tr>
<tr><td>new Test() #2: instance block</td><td>10 + 3 = 13</td><td>8</td><td>1 + 13 = 14</td></tr>
<tr><td>#2 constructor</td><td>13 + 5 = 18</td><td>8</td><td>14 + 2 = 16</td></tr>
<tr><td><code>t2.count += 10</code></td><td>28</td><td>8</td><td>16</td></tr>
<tr><td><code>t3.id += 5</code> (t3 is t1!)</td><td>28</td><td>13</td><td>16</td></tr></table>
<p>The static block runs <b>once</b>, the first time the class is used. The instance block runs <b>before</b> the constructor body, once for every <code>new</code>.</p>`
    },
    traps: ['<code>t2.count += 10</code> changes the <b>one shared</b> <code>count</code>. Every object (and the class) sees 28.', '<code>Test t3 = t1;</code> does not create an object. <code>t3.id += 5</code> changes t1’s id.'],
    tips: ['Order for every <code>new</code>: memory with default values → field initializers &amp; instance blocks (top to bottom) → constructor body.', 'Keep a small table: one column for each static variable, one column per object. Update it line by line.'],
    trace: {
      steps: [
        S('public static void main', 'The program starts in <code>main</code>. Class <code>Test</code> has not been loaded yet.', ['call', 'main()']),
        S('static int count = 0;', 'First use of <code>Test</code> → the class is loaded. Static variables are created once, in the static area.', ['s', 'Test', 'count', '0']),
        S('count += 2;', 'Static block runs (only once, ever).', ['s', 'Test', 'count', '2']),
        S('System.out.println("Static Block");', '', ['p', 'Static Block']),
        S('Test t1 = new Test();', '<code>new</code> allocates the object with default values (id = 0) and calls the constructor.', ['new', 'o1', 'Test', { id: '0' }], ['call', 'Test()  [object #1]', { this: '@o1' }]),
        S('int id = 1;', 'Before the constructor body: field initializers and instance blocks run top to bottom.', ['f', 'o1', 'id', '1']),
        S('count += 3;', 'Instance block: count is static, so this changes the shared value.', ['s', 'Test', 'count', '5']),
        S('id += count;', 'id = 1 + 5', ['f', 'o1', 'id', '6']),
        S('System.out.println("Instance Block");', '', ['p', 'Instance Block']),
        S('count += 5;', 'Now the constructor body.', ['s', 'Test', 'count', '10']),
        S('id += 2;', '', ['f', 'o1', 'id', '8']),
        S('System.out.println("Constructor");', '', ['p', 'Constructor']),
        S('Test t1 = new Test();', 'Constructor finishes; the reference is stored in t1.', ['ret'], ['v', 't1', '@o1']),
        S('Test t2 = new Test();', 'Second object. The static block does <b>not</b> run again.', ['new', 'o2', 'Test', { id: '0' }], ['call', 'Test()  [object #2]', { this: '@o2' }]),
        S('int id = 1;', '', ['f', 'o2', 'id', '1']),
        S('count += 3;', '', ['s', 'Test', 'count', '13']),
        S('id += count;', 'id = 1 + 13', ['f', 'o2', 'id', '14']),
        S('System.out.println("Instance Block");', '', ['p', 'Instance Block']),
        S('count += 5;', '', ['s', 'Test', 'count', '18']),
        S('id += 2;', '', ['f', 'o2', 'id', '16']),
        S('System.out.println("Constructor");', '', ['p', 'Constructor']),
        S('Test t2 = new Test();', '', ['ret'], ['v', 't2', '@o2']),
        S('Test t3 = t1;', 'No <code>new</code> → no new object. t3 just copies the arrow in t1.', ['v', 't3', '@o1']),
        S('t2.count += 10;', 'Accessing a static through an object still means the class variable. 18 + 10 = 28.', ['s', 'Test', 'count', '28']),
        S('t3.id += 5;', 't3 points to object #1, so object #1’s id becomes 8 + 5 = 13.', ['f', 'o1', 'id', '13']),
        S('System.out.println("t1-count', '', ['p', 't1-count = 28, t1-id = 13']),
        S('System.out.println("t2-count', '', ['p', 't2-count = 28, t2-id = 16']),
        S('System.out.println("t3-count', 't3 and t1 print the same thing because they are the same object.', ['p', 't3-count = 28, t3-id = 13'])
      ]
    }
  });

  // ======================= Fall 2025 Q2 =======================
  Q({
    id: '253-q2', paper: '253', qno: '2', marks: 6, topic: 'class', sub: ['init-order', 'constructors', 'static'], type: 'output',
    title: 'Two classes, two statics named cnt, this(6)',
    prompt: '<p>Write the output of the following program.</p>',
    given: code`
class A {
    int a = 3;
    static int cnt = 5;
    A() {
        this(6);
        a = a + cnt;
        System.out.println("A(): no-arg");
    }
    A(int a) {
        this.a = a;
        cnt++;
        System.out.println("A(int)");
    }
    {
        a = 9;
        System.out.println("A: instance block");
    }
    static {
        cnt = 10;
        System.out.println("A: static block");
    }
    void display() {
        System.out.println("A - a = " + a + ", cnt = " + cnt);
    }
}
public class B {
    static int cnt;
    static {
        System.out.println("B: static block");
    }
    B() {
        cnt++;
        System.out.println("B() - no arg");
    }
    void show() {
        System.out.println("B - cnt = " + cnt);
    }
    public static void main(String[] args) {
        System.out.println("--- main ---");
        B b1 = new B();
        A a1 = new A();
        a1.display();
        b1.show();
        A a2 = new A(5);
        a2.display();
    }
}`,
    answer: {
      output: `B: static block
--- main ---
B() - no arg
A: static block
A: instance block
A(int)
A(): no-arg
A - a = 17, cnt = 11
B - cnt = 1
A: instance block
A(int)
A - a = 5, cnt = 12`,
      html: `<ol><li><code>main</code> lives in <code>B</code>, so <b>B is loaded before main runs</b>. That is why "B: static block" comes before "--- main ---".</li>
<li>A is loaded only at <code>new A()</code>: <code>cnt = 5</code>, then the static block sets it to 10.</li>
<li><code>A()</code> starts with <code>this(6)</code>. The instance initializers (<code>a = 3</code>, then the block <code>a = 9</code>) run <b>once</b>, at the start of <code>A(int)</code>, because that constructor does not call <code>this(...)</code>.</li>
<li><code>A(int)</code>: a = 6, cnt = 11. Back in <code>A()</code>: a = 6 + 11 = 17.</li>
<li><code>A.cnt</code> and <code>B.cnt</code> are two different variables. B.cnt is 1.</li>
<li><code>new A(5)</code>: no static block this time. a = 3 → 9 → 5, cnt = 12.</li></ol>`
    },
    traps: ['The class that contains <code>main</code> is loaded first, so its static block prints <b>before</b> the first line of main.', 'Instance blocks run once per object, even when constructors chain with <code>this(...)</code>.', 'Two classes can each have a static <code>cnt</code>. They are separate.'],
    tips: ['When a constructor starts with <code>this(...)</code>, go to the target constructor first. Run instance blocks there, then its body, then come back.'],
    trace: {
      steps: [
        S('static int cnt;', 'To run <code>B.main</code>, Java must load class B first. Its static variable starts at 0.', ['s', 'B', 'cnt', '0']),
        S('System.out.println("B: static block");', 'B’s static block runs before main.', ['p', 'B: static block']),
        S('public static void main', 'Now main starts.', ['call', 'main()']),
        S('System.out.println("--- main ---");', '', ['p', '--- main ---']),
        S('B b1 = new B();', 'Create a B object (it has no instance fields).', ['new', 'b', 'B', {}], ['call', 'B()', { this: '@b' }]),
        S('cnt++;@2', 'Inside B, <code>cnt</code> means <b>B.cnt</b>.', ['s', 'B', 'cnt', '1']),
        S('System.out.println("B() - no arg");', '', ['p', 'B() - no arg']),
        S('B b1 = new B();', '', ['ret'], ['v', 'b1', '@b']),
        S('A a1 = new A();', 'First use of A → load class A. Static initializers run in textual order: first <code>cnt = 5</code>…', ['s', 'A', 'cnt', '5']),
        S('cnt = 10;', '…then the static block.', ['s', 'A', 'cnt', '10']),
        S('System.out.println("A: static block");', '', ['p', 'A: static block']),
        S('A a1 = new A();', 'Now the object is allocated (a = 0) and <code>A()</code> is called.', ['new', 'a1', 'A', { a: '0' }], ['call', 'A()', { this: '@a1' }]),
        S('this(6);', '<code>A()</code> immediately calls <code>A(int)</code>. Instance initializers will run in A(int), since it does not call this().', ['call', 'A(int a)', { this: '@a1', a: '6' }]),
        S('int a = 3;', 'Field initializer.', ['f', 'a1', 'a', '3']),
        S('a = 9;', 'Instance block. Field initializers and instance blocks run top to bottom, wherever they are written in the class.', ['f', 'a1', 'a', '9']),
        S('System.out.println("A: instance block");', '', ['p', 'A: instance block']),
        S('this.a = a;', 'Now the body of A(int). Field a = parameter a = 6.', ['f', 'a1', 'a', '6']),
        S('cnt++;@1', 'A.cnt: 10 → 11', ['s', 'A', 'cnt', '11']),
        S('System.out.println("A(int)");', '', ['p', 'A(int)']),
        S('a = a + cnt;', 'Back in <code>A()</code>. No local named a here, so a means the field: 6 + 11 = 17.', ['ret'], ['f', 'a1', 'a', '17']),
        S('System.out.println("A(): no-arg");', '', ['p', 'A(): no-arg']),
        S('A a1 = new A();', '', ['ret'], ['v', 'a1', '@a1']),
        S('System.out.println("A - a = "', 'a1.display()', ['call', 'display()', { this: '@a1' }], ['p', 'A - a = 17, cnt = 11']),
        S('System.out.println("B - cnt = "', 'b1.show(): B.cnt is still 1. It is not A.cnt!', ['ret'], ['call', 'show()', { this: '@b' }], ['p', 'B - cnt = 1']),
        S('A a2 = new A(5);', 'A is already loaded, so no static block. Allocate and call A(int) directly.', ['ret'], ['new', 'a2', 'A', { a: '0' }], ['call', 'A(int a)', { this: '@a2', a: '5' }]),
        S('int a = 3;', '', ['f', 'a2', 'a', '3']),
        S('a = 9;', '', ['f', 'a2', 'a', '9']),
        S('System.out.println("A: instance block");', '', ['p', 'A: instance block']),
        S('this.a = a;', '', ['f', 'a2', 'a', '5']),
        S('cnt++;@1', '', ['s', 'A', 'cnt', '12']),
        S('System.out.println("A(int)");', '', ['p', 'A(int)']),
        S('A a2 = new A(5);', '', ['ret'], ['v', 'a2', '@a2']),
        S('System.out.println("A - a = "', 'a2.display()', ['call', 'display()', { this: '@a2' }], ['p', 'A - a = 5, cnt = 12']),
        S('a2.display();', 'Done.', ['ret'])
      ]
    }
  });

  // ======================= Summer 2025 Q2 =======================
  Q({
    id: '252-q2', paper: '252', qno: '2', marks: 6, topic: 'class', sub: ['init-order', 'static', 'constructors'], type: 'output',
    title: 'FirstClass / SecondClass: lazy class loading',
    prompt: '<p>Write the output of the following program.</p>',
    given: code`
public class FirstClass {
    int a = initA();
    static int x = 10;
    FirstClass() {
        this(SecondClass.b);
        System.out.println("FirstClass: no-arg ctor");
    }
    FirstClass(int a) {
        System.out.println("FirstClass: one-arg ctor, a = " + a);
    }
    static {
        System.out.println("FirstClass: static block");
    }
    public static void main(String[] args) {
        System.out.println("MAIN: start");
        FirstClass f1 = new FirstClass();
        FirstClass f2 = new FirstClass(SecondClass.b);
        f1.display();
        SecondClass.display();
        SecondClass s = new SecondClass();
        s.display();
        System.out.println("MAIN: end");
    }
    final void display() {
        System.out.println("FirstClass: display(), a = " + a + ", x = " + x);
    }
    static {
        System.out.println("FirstClass: static block again");
    }
    int initA() {
        return 2;
    }
}
class SecondClass {
    static int b;
    int y = initY();
    {
        System.out.println("SecondClass: instance block");
    }
    SecondClass() {
        b = 8;
        System.out.println("SecondClass: no-arg ctor");
    }
    SecondClass(int b) {
        this.b = b;
        System.out.println("SecondClass: one-arg ctor, b = " + b);
    }
    static void display() {
        System.out.println("SecondClass: display(), b = " + b);
    }
    static {
        b = initB();
        System.out.println("SecondClass: static block");
    }
    static int initB() {
        System.out.println("SecondClass: static var b init");
        return 9;
    }
    int initY() {
        return 7;
    }
}`,
    answer: {
      output: `FirstClass: static block
FirstClass: static block again
MAIN: start
SecondClass: static var b init
SecondClass: static block
FirstClass: one-arg ctor, a = 9
FirstClass: no-arg ctor
FirstClass: one-arg ctor, a = 9
FirstClass: display(), a = 2, x = 10
SecondClass: display(), b = 9
SecondClass: instance block
SecondClass: no-arg ctor
SecondClass: display(), b = 8
MAIN: end`,
      html: `<ul><li>Both static blocks of FirstClass run (top to bottom) <b>before</b> main, because main is inside FirstClass.</li>
<li>SecondClass is loaded only when <code>SecondClass.b</code> is first touched, inside <code>this(SecondClass.b)</code>. Its static block calls <code>initB()</code>, which prints first and returns 9.</li>
<li>In <code>FirstClass(int a)</code> the printed <code>a</code> is the <b>parameter</b> (9), not the field (2). The field is printed later by <code>display()</code>: a = 2.</li>
<li><code>new SecondClass()</code>: instance initializers (y = 7, instance block) run, then the body sets the static b = 8.</li>
<li><code>s.display()</code> calls a static method through a reference. That is legal and prints b = 8.</li></ul>`
    },
    traps: ['A parameter with the same name as a field <b>shadows</b> it. <code>"a = " + a</code> inside <code>FirstClass(int a)</code> prints the parameter.', 'A class is loaded the first time it is used, not when the program starts. Watch for the first <code>SecondClass.something</code>.', 'Two <code>static { }</code> blocks run in the order they appear in the file.'],
    tips: ['Write the output in phases: (1) static blocks of the main class, (2) main, loading other classes when they are first touched.'],
    trace: {
      steps: [
        S('static int x = 10;', 'main is in FirstClass → load FirstClass first. Statics run top to bottom: x = 10…', ['s', 'FirstClass', 'x', '10']),
        S('System.out.println("FirstClass: static block");', '…first static block…', ['p', 'FirstClass: static block']),
        S('System.out.println("FirstClass: static block again");', '…second static block (it is further down the file, but still before main).', ['p', 'FirstClass: static block again']),
        S('System.out.println("MAIN: start");', 'Now main runs.', ['call', 'main()'], ['p', 'MAIN: start']),
        S('FirstClass f1 = new FirstClass();', 'Allocate f1 (a = 0) and call the no-arg constructor.', ['new', 'f1', 'FirstClass', { a: '0' }], ['call', 'FirstClass()', { this: '@f1' }]),
        S('this(SecondClass.b);', 'To call this(...), Java must first evaluate SecondClass.b → first use of SecondClass → load it now.', ['s', 'SecondClass', 'b', '0']),
        S('System.out.println("SecondClass: static var b init");', 'SecondClass’s static block calls initB(), which prints…', ['call', 'initB()'], ['p', 'SecondClass: static var b init']),
        S('return 9;', '…and returns 9.', ['ret'], ['s', 'SecondClass', 'b', '9']),
        S('System.out.println("SecondClass: static block");', '', ['p', 'SecondClass: static block']),
        S('FirstClass(int a) {', 'Now this(9) runs the one-arg constructor. It does not call this(), so field initializers run here.', ['call', 'FirstClass(int a)', { this: '@f1', a: '9' }]),
        S('int a = initA();', 'Field initializer: a = initA() = 2. This sets the <b>field</b>.', ['f', 'f1', 'a', '2']),
        S('System.out.println("FirstClass: one-arg ctor, a = " + a);', 'But here <code>a</code> is the <b>parameter</b> (9), which hides the field.', ['p', 'FirstClass: one-arg ctor, a = 9']),
        S('System.out.println("FirstClass: no-arg ctor");', 'Back in the no-arg constructor.', ['ret'], ['p', 'FirstClass: no-arg ctor']),
        S('FirstClass f1 = new FirstClass();', '', ['ret'], ['v', 'f1', '@f1']),
        S('FirstClass f2 = new FirstClass(SecondClass.b);', 'SecondClass is already loaded: no static output. b is 9.', ['new', 'f2', 'FirstClass', { a: '0' }], ['call', 'FirstClass(int a)', { this: '@f2', a: '9' }]),
        S('int a = initA();', '', ['f', 'f2', 'a', '2']),
        S('System.out.println("FirstClass: one-arg ctor, a = " + a);', '', ['p', 'FirstClass: one-arg ctor, a = 9']),
        S('FirstClass f2 = new FirstClass(SecondClass.b);', '', ['ret'], ['v', 'f2', '@f2']),
        S('System.out.println("FirstClass: display(), a = "', 'display() uses the <b>field</b> a = 2.', ['call', 'display()', { this: '@f1' }], ['p', 'FirstClass: display(), a = 2, x = 10']),
        S('System.out.println("SecondClass: display(), b = " + b);', 'Static method of SecondClass.', ['ret'], ['call', 'SecondClass.display()'], ['p', 'SecondClass: display(), b = 9']),
        S('SecondClass s = new SecondClass();', 'New SecondClass object. Static block does NOT run again.', ['ret'], ['new', 's', 'SecondClass', { y: '0' }], ['call', 'SecondClass()', { this: '@s' }]),
        S('int y = initY();', 'Field initializer y = 7…', ['f', 's', 'y', '7']),
        S('System.out.println("SecondClass: instance block");', '…then the instance block…', ['p', 'SecondClass: instance block']),
        S('b = 8;', '…then the constructor body. b is static, so the class variable changes.', ['s', 'SecondClass', 'b', '8']),
        S('System.out.println("SecondClass: no-arg ctor");', '', ['p', 'SecondClass: no-arg ctor']),
        S('SecondClass s = new SecondClass();', '', ['ret'], ['v', 's', '@s']),
        S('System.out.println("SecondClass: display(), b = " + b);', '<code>s.display()</code>: a static method called through a reference is still the static method.', ['call', 'SecondClass.display()'], ['p', 'SecondClass: display(), b = 8']),
        S('System.out.println("MAIN: end");', '', ['ret'], ['p', 'MAIN: end'])
      ]
    }
  });

  // ======================= Spring 2025 Q1(a) =======================
  Q({
    id: '251-q1a', paper: '251', qno: '1(a)', marks: 5, topic: 'class', sub: ['init-order', 'static'], type: 'output',
    title: 'MindGame: static block, c++ and d--',
    prompt: '<p>Consider the following code and write the output.</p>',
    given: code`
class MindGame {
    int a = 0;
    int b = 2;
    static int c = 0;
    static int d = 5;

    MindGame() {
        a--;
        b += 5;
        c++;
        d--;
    }
    static {
        c--;
        d += c;
    }
    {
        a = c++;
        b = b + d;
    }
    public void displayAB() {
        System.out.println("a = " + a);
        System.out.println("b = " + b);
    }
    public static void displayCD() {
        System.out.println("c = " + c);
        System.out.println("d = " + d);
    }
}
public class Main {
    public static void main(String[] args) {
        MindGame.displayCD();
        MindGame m1 = new MindGame();
        m1.displayAB();
        m1.displayCD();
        MindGame.displayCD();
    }
}`,
    answer: {
      output: `c = -1
d = 4
a = -2
b = 11
c = 1
d = 3
c = 1
d = 3`,
      html: `<p><b>Class loading</b> (at <code>MindGame.displayCD()</code>): c = 0, d = 5, then static block: c = -1, d = 5 + (-1) = 4.</p>
<p><b>new MindGame()</b>: a = 0, b = 2 → instance block: <code>a = c++</code> gives a = -1 (old value), then c = 0; b = 2 + 4 = 6 → constructor: a = -2, b = 11, c = 1, d = 3.</p>`
    },
    traps: ['<code>a = c++</code> is <b>post</b>-increment: a gets the old value of c, and c goes up afterwards.', 'The constructor is written above the instance block, but the instance block still runs first.'],
    tips: ['Even if the static block is written below the fields and methods, it runs at class-load time, before any object exists.'],
    trace: {
      steps: [
        S('public static void main', '', ['call', 'main()']),
        S('MindGame.displayCD();', 'First use of MindGame → load the class. Static fields in order: c = 0, d = 5…', ['s', 'MindGame', 'c', '0'], ['s', 'MindGame', 'd', '5']),
        S('c--;', '…then the static block. c = -1', ['s', 'MindGame', 'c', '-1']),
        S('d += c;', 'd = 5 + (-1) = 4', ['s', 'MindGame', 'd', '4']),
        S('System.out.println("c = " + c);', 'Now displayCD() actually runs.', ['call', 'displayCD()'], ['p', 'c = -1']),
        S('System.out.println("d = " + d);', '', ['p', 'd = 4']),
        S('MindGame m1 = new MindGame();', 'Allocate: a = 0, b = 0 (defaults) and call the constructor.', ['ret'], ['new', 'm', 'MindGame', { a: '0', b: '0' }], ['call', 'MindGame()', { this: '@m' }]),
        S('int a = 0;', 'Field initializers first…', ['f', 'm', 'a', '0']),
        S('int b = 2;', '', ['f', 'm', 'b', '2']),
        S('a = c++;', '…then the instance block. Post-increment: a takes the OLD c (-1), then c becomes 0.', ['f', 'm', 'a', '-1'], ['s', 'MindGame', 'c', '0']),
        S('b = b + d;', 'b = 2 + 4 = 6', ['f', 'm', 'b', '6']),
        S('a--;', 'Now the constructor body. a = -2', ['f', 'm', 'a', '-2']),
        S('b += 5;', 'b = 11', ['f', 'm', 'b', '11']),
        S('c++;', 'c = 1', ['s', 'MindGame', 'c', '1']),
        S('d--;', 'd = 3', ['s', 'MindGame', 'd', '3']),
        S('MindGame m1 = new MindGame();', '', ['ret'], ['v', 'm1', '@m']),
        S('System.out.println("a = " + a);', 'm1.displayAB()', ['call', 'displayAB()', { this: '@m' }], ['p', 'a = -2']),
        S('System.out.println("b = " + b);', '', ['p', 'b = 11']),
        S('System.out.println("c = " + c);', 'm1.displayCD(): a static method, even though it is called through m1.', ['ret'], ['call', 'displayCD()'], ['p', 'c = 1']),
        S('System.out.println("d = " + d);', '', ['p', 'd = 3']),
        S('System.out.println("c = " + c);', 'MindGame.displayCD(): same static values.', ['ret'], ['call', 'displayCD()'], ['p', 'c = 1']),
        S('System.out.println("d = " + d);', '', ['p', 'd = 3']),
        S('MindGame.displayCD();@2', 'Done.', ['ret'])
      ]
    }
  });

  // ======================= Spring 2025 Q4(b) =======================
  Q({
    id: '251-q4b', paper: '251', qno: '4(b)', marks: 3, topic: 'class', sub: ['references', 'gc'], type: 'output',
    title: 'Box b2 = b1; b1 = null;',
    prompt: '<p>What is the output of the program? Justify your answer.</p>',
    given: code`
public class Box {
    double width;
    double height;
    double depth;

    public void print() {
        System.out.println(width);
        System.out.println(height);
        System.out.println(depth);
    }
}
public class Main {
    public static void main(String[] args) {
        Box b1 = new Box();
        b1.width = 1;
        b1.height = 2;
        b1.depth = 3;
        Box b2 = b1;
        b1 = null;
        b2.print();
    }
}`,
    answer: {
      output: `1.0
2.0
3.0`,
      html: `<p><code>Box b2 = b1;</code> copies the <b>reference</b>, so b1 and b2 point to the same object. <code>b1 = null</code> only clears the variable b1. The object is still reachable through b2, so it is not garbage and <code>b2.print()</code> works.</p>
<p>The fields are <code>double</code>, so the int values 1, 2, 3 are widened and printed as <b>1.0, 2.0, 3.0</b>.</p>`
    },
    traps: ['Setting one reference to <code>null</code> does not delete the object. An object becomes garbage only when <b>no</b> reference points to it.', 'Assigning an int to a double field prints with <code>.0</code>.'],
    trace: {
      steps: [
        S('Box b1 = new Box();', '', ['call', 'main()'], ['new', 'box', 'Box', { width: '0.0', height: '0.0', depth: '0.0' }], ['v', 'b1', '@box']),
        S('b1.width = 1;', 'int 1 is stored as double 1.0', ['f', 'box', 'width', '1.0']),
        S('b1.height = 2;', '', ['f', 'box', 'height', '2.0']),
        S('b1.depth = 3;', '', ['f', 'box', 'depth', '3.0']),
        S('Box b2 = b1;', 'Copy the arrow, not the object.', ['v', 'b2', '@box']),
        S('b1 = null;', 'b1 no longer points anywhere, but b2 still does → the object is NOT garbage.', ['v', 'b1', 'null']),
        S('System.out.println(width);', 'b2.print()', ['call', 'print()', { this: '@box' }], ['p', '1.0']),
        S('System.out.println(height);', '', ['p', '2.0']),
        S('System.out.println(depth);', '', ['p', '3.0']),
        S('b2.print();', '', ['ret'])
      ]
    }
  });

  // ======================= Fall 2024 Q3 =======================
  Q({
    id: '243-q3', paper: '243', qno: '3', marks: 6, topic: 'class', sub: ['static', 'init-order'], type: 'output',
    title: 'Operations: static total, Increment(), square()',
    prompt: '<p>Write the output of the following code.</p>',
    given: code`
class Operations {
    static int total = 20;

    static {
        System.out.println("Global Tech Academy");
    }

    static int square(int y) {
        return y * y;
    }

    public static void Increment() {
        total++;
        System.out.println(total);
    }

    public static void main(String args[]) {
        Operations.Increment();
        Operations obj1 = new Operations();
        obj1.Increment();
        Operations obj2 = new Operations();
        obj2.Increment();
        System.out.println(obj1.total);
        int result = Operations.square(Operations.total);
        System.out.println(result);
    }
}`,
    answer: {
      output: `Global Tech Academy
21
22
23
23
529`,
      html: `<p>The static block prints first (class load, before main). <code>total</code> is one shared variable: 20 → 21 → 22 → 23, whether you call <code>Increment()</code> through the class or through obj1/obj2. <code>obj1.total</code> is also that same 23. square(23) = 529.</p>`
    },
    traps: ['<code>obj1.Increment()</code> and <code>obj2.Increment()</code> change the same static <code>total</code>. Objects do not get their own copy.'],
    tips: ['Spot <code>static</code> on the variable first. If it is static, there is exactly one box for the whole class.'],
    trace: {
      steps: [
        S('static int total = 20;', 'Class loads before main.', ['s', 'Operations', 'total', '20']),
        S('System.out.println("Global Tech Academy");', '', ['p', 'Global Tech Academy']),
        S('Operations.Increment();', '', ['call', 'main()']),
        S('total++;', '', ['call', 'Increment()'], ['s', 'Operations', 'total', '21']),
        S('System.out.println(total);', '', ['p', '21']),
        S('Operations obj1 = new Operations();', 'An object with no instance fields.', ['ret'], ['new', 'o1', 'Operations', {}], ['v', 'obj1', '@o1']),
        S('total++;', 'obj1.Increment() → still the static method, same total.', ['call', 'Increment()'], ['s', 'Operations', 'total', '22']),
        S('System.out.println(total);', '', ['p', '22']),
        S('Operations obj2 = new Operations();', '', ['ret'], ['new', 'o2', 'Operations', {}], ['v', 'obj2', '@o2']),
        S('total++;', '', ['call', 'Increment()'], ['s', 'Operations', 'total', '23']),
        S('System.out.println(total);', '', ['p', '23']),
        S('System.out.println(obj1.total);', '', ['ret'], ['p', '23']),
        S('return y * y;', 'square(23)', ['call', 'square(int y)', { y: '23' }]),
        S('int result = Operations.square(Operations.total);', '23 × 23 = 529', ['ret'], ['v', 'result', '529']),
        S('System.out.println(result);', '', ['p', '529'])
      ]
    }
  });

  Q({
    id: '242-q3', paper: '242', qno: '3', marks: 6, topic: 'class', sub: ['static', 'init-order'], type: 'output',
    title: 'Calculate: static count, Counter(), cube()',
    prompt: '<p>Write the output of the following code.</p>',
    given: code`
class Calculate {
    static int count = 10;
    static { System.out.println("United International University"); }

    static int cube(int x) {
        return x * x * x;
    }
    public static void Counter() {
        count++; // incrementing the value of static variable
        System.out.println(count);
    }
    public static void main(String args[]) {
        Calculate.Counter();
        Calculate c1 = new Calculate();
        c1.Counter();
        Calculate c2 = new Calculate();
        c2.Counter();
        System.out.println(c1.count);
        int result = Calculate.cube(Calculate.count);
        System.out.println(result);
    }
}`,
    answer: {
      output: `United International University
11
12
13
13
2197`,
      html: '<p>Same pattern as Fall 2024 Q3. The static block prints before main. The one shared <code>count</code> goes 10 → 11 → 12 → 13. cube(13) = 13 × 13 × 13 = 2197.</p>'
    },
    traps: ['13³: 13 × 13 = 169, then 169 × 13 = 2197. Do the arithmetic carefully. Losing marks on multiplication is common.'],
    trace: {
      steps: [
        S('static int count = 10;', 'Class loads before main.', ['s', 'Calculate', 'count', '10']),
        S('static { System.out.println', '', ['p', 'United International University']),
        S('Calculate.Counter();', '', ['call', 'main()']),
        S('count++;', '', ['call', 'Counter()'], ['s', 'Calculate', 'count', '11']),
        S('System.out.println(count);', '', ['p', '11']),
        S('Calculate c1 = new Calculate();', '', ['ret'], ['new', 'c1', 'Calculate', {}], ['v', 'c1', '@c1']),
        S('count++;', 'c1.Counter() → same static count', ['call', 'Counter()'], ['s', 'Calculate', 'count', '12']),
        S('System.out.println(count);', '', ['p', '12']),
        S('Calculate c2 = new Calculate();', '', ['ret'], ['new', 'c2', 'Calculate', {}], ['v', 'c2', '@c2']),
        S('count++;', '', ['call', 'Counter()'], ['s', 'Calculate', 'count', '13']),
        S('System.out.println(count);', '', ['p', '13']),
        S('System.out.println(c1.count);', '', ['ret'], ['p', '13']),
        S('return x * x * x;', '', ['call', 'cube(int x)', { x: '13' }]),
        S('int result = Calculate.cube', '13 × 13 × 13 = 2197', ['ret'], ['v', 'result', '2197']),
        S('System.out.println(result);', '', ['p', '2197'])
      ]
    }
  });

  // ======================= Summer 2024 / Fall 2024 Q4: Sum =======================
  function sumTrace(v, lit) {
    // v = {a:[x,y,z], b:[x,y], c:x, blk:[x,y,z], msg}
    const [X, Y, Z] = v.a, [X2, Y2] = v.b, X1 = v.c, [bx, by, bz] = v.blk;
    return {
      steps: [
        S('Sum s = new Sum(', 'Allocate: x = y = z = 0, then call the 3-arg constructor.', ['call', 'main()'], ['new', 's', 'Sum', { x: '0', y: '0', z: '0' }], ['call', 'Sum(int x, int y, int z)', { this: '@s', x: '' + X, y: '' + Y, z: '' + Z }]),
        S('this(' + X2 + ', ' + Y2 + ');', 'First line is this(...) → jump to the 2-arg constructor.', ['call', 'Sum(int x, int y)', { this: '@s', x: '' + X2, y: '' + Y2 }]),
        S('this(' + X1 + ');', 'Again this(...) → jump to the 1-arg constructor.', ['call', 'Sum(int x)', { this: '@s', x: '' + X1 }]),
        S('System.out.println(x + y + z);@1', 'Sum(int x) does NOT call this(), so the instance blocks run now, before its body. Inside a block there is no parameter: x, y, z are the fields = 0.', ['p', '0']),
        S('x = ' + bx + ';', 'Second instance block.', ['f', 's', 'x', '' + bx]),
        S('y = ' + by + ';', '', ['f', 's', 'y', '' + by]),
        S('z = ' + bz + ';', '', ['f', 's', 'z', '' + bz]),
        S('System.out.println(x + y + z);@2', bx + ' + ' + by + ' + ' + bz, ['p', '' + (bx + by + bz)]),
        S('this.x = x;@1', 'Body of Sum(int x): field x = parameter ' + X1 + '.', ['f', 's', 'x', '' + X1]),
        S('System.out.println(x + y + z);@3', '⚠ x here is the <b>parameter</b> (' + X1 + '); y and z are fields (' + by + ', ' + bz + ').', ['p', '' + (X1 + by + bz)]),
        S('this.x = x;@2', 'Back in Sum(int x, int y).', ['ret'], ['f', 's', 'x', '' + X2]),
        S('this.y = y;@1', '', ['f', 's', 'y', '' + Y2]),
        S('System.out.println(x + y + z);@4', 'x, y are parameters (' + X2 + ', ' + Y2 + '); z is the field (' + bz + ').', ['p', '' + (X2 + Y2 + bz)]),
        S('this.x = x;@3', 'Back in Sum(int x, int y, int z).', ['ret'], ['f', 's', 'x', '' + X]),
        S('this.y = y;@2', '', ['f', 's', 'y', '' + Y]),
        S('this.z = z;', '', ['f', 's', 'z', '' + Z]),
        S('System.out.println(x + y + z);@5', 'All three are parameters.', ['p', '' + (X + Y + Z)]),
        S('Sum s = new Sum(', '', ['ret'], ['v', 's', '@s']),
        S('this.display(', 's.display() calls the overloaded display(String).', ['call', 'display()', { this: '@s' }]),
        S('System.out.println(str);', '', ['call', 'display(String str)', { this: '@s', str: '"' + v.msg + '"' }], ['p', v.msg]),
        S('s.display();', '', ['ret'], ['ret'])
      ]
    };
  }
  const sumCode = (blk, c1, c2, c3, msg) => code`
public class Sum {
    int x, y, z;
    {
        System.out.println(x + y + z);
    }
    {
        x = ${blk[0]};
        y = ${blk[1]};
        z = ${blk[2]};
        System.out.println(x + y + z);
    }
    public Sum(int x) {
        this.x = x;
        System.out.println(x + y + z);
    }
    public Sum(int x, int y) {
        this(${c1});
        this.x = x;
        this.y = y;
        System.out.println(x + y + z);
    }
    public Sum(int x, int y, int z) {
        this(${c2[0]}, ${c2[1]});
        this.x = x;
        this.y = y;
        this.z = z;
        System.out.println(x + y + z);
    }
    public void display() {
        this.display("${msg}");
    }
    public void display(String str) {
        System.out.println(str);
    }
    public static void main(String args[]) {
        Sum s = new Sum(${c3[0]}, ${c3[1]}, ${c3[2]});
        s.display();
    }
}`;
  const sumTips = ['Inside a constructor, a bare name like <code>x</code> means the <b>parameter</b> if one exists. Only <code>this.x</code> is the field. This is the whole trick of this question.', 'With a <code>this(...)</code> chain, the deepest constructor’s body runs first and the outermost one prints last.', 'Instance blocks run once, at the start of the constructor that has no <code>this(...)</code> call.'];
  Q({
    id: '242-q4', paper: '242', qno: '4', marks: 6, topic: 'class', sub: ['constructors', 'init-order', 'overloading'], type: 'output',
    title: 'Sum: this() chain + instance blocks + shadowing',
    prompt: '<p>Write the output of the following code.</p>',
    given: sumCode([10, 20, 30], 1000, [100, 200], [10, 20, 30], "That's one small step for man, one giant leap for mankind."),
    answer: {
      output: `0
60
1050
330
60
That's one small step for man, one giant leap for mankind.`,
      html: `<table><tr><th>Printed by</th><th>x</th><th>y</th><th>z</th><th>Sum</th></tr>
<tr><td>1st instance block (fields still default)</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>2nd instance block</td><td>10</td><td>20</td><td>30</td><td>60</td></tr>
<tr><td>Sum(int x): x is param</td><td>1000</td><td>20 (field)</td><td>30 (field)</td><td>1050</td></tr>
<tr><td>Sum(x, y): x, y params</td><td>100</td><td>200</td><td>30 (field)</td><td>330</td></tr>
<tr><td>Sum(x, y, z): all params</td><td>10</td><td>20</td><td>30</td><td>60</td></tr></table>`
    },
    traps: sumTips.slice(0, 1),
    tips: sumTips.slice(1),
    trace: sumTrace({ a: [10, 20, 30], b: [100, 200], c: 1000, blk: [10, 20, 30], msg: "That's one small step for man, one giant leap for mankind." })
  });
  Q({
    id: '243-q4', paper: '243', qno: '4', marks: 6, topic: 'class', sub: ['constructors', 'init-order', 'overloading'], type: 'output',
    title: 'Sum (version 2): this() chain + instance blocks',
    prompt: '<p>Write the output of the following code.</p>',
    given: sumCode([11, 22, 33], 500, [50, 20], [100, 150, 300], 'The pen is stronger than the sword.'),
    answer: {
      output: `0
66
555
103
550
The pen is stronger than the sword.`,
      html: `<ul><li>Block 1: 0 + 0 + 0 = <b>0</b></li><li>Block 2: 11 + 22 + 33 = <b>66</b></li><li>Sum(500): 500 (param) + 22 + 33 = <b>555</b></li><li>Sum(50, 20): 50 + 20 (params) + 33 (field) = <b>103</b></li><li>Sum(100, 150, 300): <b>550</b></li></ul>`
    },
    traps: sumTips.slice(0, 1),
    tips: sumTips.slice(1).concat(['This exact code with different numbers appeared in two consecutive trimesters (Summer 2024 and Fall 2024). Practise the pattern, not just the answer.']),
    trace: sumTrace({ a: [100, 150, 300], b: [50, 20], c: 500, blk: [11, 22, 33], msg: 'The pen is stronger than the sword.' })
  });

  // ======================= Spring 2024 Q3 =======================
  Q({
    id: '241-q3', paper: '241', qno: '3', marks: 7.5, topic: 'class', sub: ['init-order', 'constructors', 'static'], type: 'output',
    title: 'Person: instance block, this(), static s',
    prompt: '<p>Write the output of the following program.</p>',
    given: code`
class Person {
    int id;
    String name;
    static int s = 10;
    {
        System.out.println("3");
    }
    public Person() {
        this.id = 1;
        this.name = "M";
        System.out.println("1");
        s++;
    }
    public Person(int id, String name) {
        this();
        this.id = id;
        this.name = name;
        System.out.println("2");
        s++;
    }
    public static void main(String args[]) {
        Person p = new Person(1, "N");
        Person p1 = new Person();
        System.out.println(p1.s);
        p.s = 11;
        System.out.println(Person.s);
    }
}`,
    answer: {
      output: `3
1
2
3
1
13
11`,
      html: `<p><code>new Person(1, "N")</code> → calls <code>this()</code> → the instance block runs <b>once</b> (prints 3), then Person() prints 1 (s = 11), then back to print 2 (s = 12). <code>new Person()</code> → 3, 1 (s = 13). Then <code>p.s = 11</code> sets the shared static, so <code>Person.s</code> is 11.</p>`
    },
    traps: ['The instance block prints “3” only once per object, even though two constructors run for <code>new Person(1, "N")</code>.', '<code>p.s = 11</code> overwrites the static for everyone.'],
    trace: {
      steps: [
        S('static int s = 10;', 'Load class Person (main is here).', ['s', 'Person', 's', '10']),
        S('Person p = new Person(1, "N");', '', ['call', 'main()'], ['new', 'p', 'Person', { id: '0', name: 'null' }], ['call', 'Person(int id, String name)', { this: '@p', id: '1', name: '"N"' }]),
        S('this();', 'Calls the no-arg constructor.', ['call', 'Person()', { this: '@p' }]),
        S('System.out.println("3");', 'Person() has no this(...), so the instance block runs here.', ['p', '3']),
        S('this.id = 1;', '', ['f', 'p', 'id', '1']),
        S('this.name = "M";', '', ['f', 'p', 'name', '"M"']),
        S('System.out.println("1");', '', ['p', '1']),
        S('s++;@1', '', ['s', 'Person', 's', '11']),
        S('this.id = id;', 'Back in the 2-arg constructor.', ['ret'], ['f', 'p', 'id', '1']),
        S('this.name = name;', '', ['f', 'p', 'name', '"N"']),
        S('System.out.println("2");', '', ['p', '2']),
        S('s++;@2', '', ['s', 'Person', 's', '12']),
        S('Person p = new Person(1, "N");', '', ['ret'], ['v', 'p', '@p']),
        S('Person p1 = new Person();', '', ['new', 'p1', 'Person', { id: '0', name: 'null' }], ['call', 'Person()', { this: '@p1' }]),
        S('System.out.println("3");', 'Instance block for the second object.', ['p', '3']),
        S('this.id = 1;', '', ['f', 'p1', 'id', '1']),
        S('this.name = "M";', '', ['f', 'p1', 'name', '"M"']),
        S('System.out.println("1");', '', ['p', '1']),
        S('s++;@1', '', ['s', 'Person', 's', '13']),
        S('Person p1 = new Person();', '', ['ret'], ['v', 'p1', '@p1']),
        S('System.out.println(p1.s);', '', ['p', '13']),
        S('p.s = 11;', 'Static assignment through a reference: changes Person.s.', ['s', 'Person', 's', '11']),
        S('System.out.println(Person.s);', '', ['p', '11'])
      ]
    }
  });

  // ======================= Summer 2023 Q1 =======================
  Q({
    id: '232-q1', paper: '232', qno: '1', marks: 5, topic: 'class', sub: ['init-order', 'overloading', 'constructors'], type: 'output',
    title: 'Vehicle: two static blocks, instance block, honk() overloads',
    prompt: '<p>Write the output of the following program.</p>',
    given: code`
public class Vehicle {
    private String brand;
    private String model;

    static {
        System.out.println("Initializing Vehicle class...");
    }
    {
        System.out.println("Initializing an instance of the Vehicle class...");
    }
    public Vehicle() {
        System.out.println("Creating a default vehicle.");
        brand = "Unknown";
    }
    public Vehicle(String brand, String model) {
        System.out.println("Creating a customized vehicle of brand: " + brand + " and model: " + model);
        this.brand = brand;
        this.model = model;
    }
    public void honk() {
        System.out.println("The vehicle emits a honking sound.");
    }
    public void honk(String sound) {
        System.out.println("The vehicle emits a custom honking sound: " + sound);
    }
    static {
        System.out.println("Making sure of initialization...");
    }
    public void info() {
        System.out.println("model=" + model + " brand=" + brand);
    }
    public static void main(String[] args) {
        Vehicle defaultVehicle = new Vehicle();
        defaultVehicle.honk();
        defaultVehicle.info();

        Vehicle truck = new Vehicle("Ford", "F-150");
        truck.honk("Loud horn sound");
        truck.info();
    }
}`,
    answer: {
      output: `Initializing Vehicle class...
Making sure of initialization...
Initializing an instance of the Vehicle class...
Creating a default vehicle.
The vehicle emits a honking sound.
model=null brand=Unknown
Initializing an instance of the Vehicle class...
Creating a customized vehicle of brand: Ford and model: F-150
The vehicle emits a custom honking sound: Loud horn sound
model=F-150 brand=Ford`,
      html: '<p>Both static blocks run first, top to bottom, once. Each <code>new</code> runs the instance block, then the chosen constructor. The default constructor never sets <code>model</code>, so it is still <code>null</code>. Concatenating null into a String prints the word <b>null</b> (no exception).</p>'
    },
    traps: ['An unassigned String field is <code>null</code>, and <code>"model=" + model</code> prints <code>model=null</code>.', 'The second static block appears in the middle of the class, but it still runs before main.'],
    trace: {
      steps: [
        S('System.out.println("Initializing Vehicle class...");', 'Class loading: static blocks in file order.', ['p', 'Initializing Vehicle class...']),
        S('System.out.println("Making sure of initialization...");', '', ['p', 'Making sure of initialization...']),
        S('Vehicle defaultVehicle = new Vehicle();', 'main starts. Allocate (brand = model = null).', ['call', 'main()'], ['new', 'v1', 'Vehicle', { brand: 'null', model: 'null' }], ['call', 'Vehicle()', { this: '@v1' }]),
        S('System.out.println("Initializing an instance', 'Instance block first.', ['p', 'Initializing an instance of the Vehicle class...']),
        S('System.out.println("Creating a default vehicle.");', '', ['p', 'Creating a default vehicle.']),
        S('brand = "Unknown";', 'model is never set → stays null.', ['f', 'v1', 'brand', '"Unknown"']),
        S('Vehicle defaultVehicle = new Vehicle();', '', ['ret'], ['v', 'defaultVehicle', '@v1']),
        S('System.out.println("The vehicle emits a honking sound.");', 'honk() with no arguments.', ['p', 'The vehicle emits a honking sound.']),
        S('System.out.println("model=" + model', '', ['p', 'model=null brand=Unknown']),
        S('Vehicle truck = new Vehicle("Ford", "F-150");', '', ['new', 'v2', 'Vehicle', { brand: 'null', model: 'null' }], ['call', 'Vehicle(String brand, String model)', { this: '@v2', brand: '"Ford"', model: '"F-150"' }]),
        S('System.out.println("Initializing an instance', '', ['p', 'Initializing an instance of the Vehicle class...']),
        S('System.out.println("Creating a customized', 'Uses the parameters.', ['p', 'Creating a customized vehicle of brand: Ford and model: F-150']),
        S('this.brand = brand;', '', ['f', 'v2', 'brand', '"Ford"']),
        S('this.model = model;', '', ['f', 'v2', 'model', '"F-150"']),
        S('Vehicle truck = new Vehicle("Ford", "F-150");', '', ['ret'], ['v', 'truck', '@v2']),
        S('System.out.println("The vehicle emits a custom', 'honk(String) is chosen because one String argument is passed.', ['p', 'The vehicle emits a custom honking sound: Loud horn sound']),
        S('System.out.println("model=" + model', '', ['p', 'model=F-150 brand=Ford'])
      ]
    }
  });

  // ======================= Spring 2023 Q1 =======================
  Q({
    id: '231-q1', paper: '231', qno: '1', marks: 4, topic: 'class', sub: ['constructors', 'overloading'], type: 'output',
    title: 'SomeClass: constructor chaining with this()',
    prompt: '<p>Write the expected output of the following code.</p>',
    given: code`
public class SomeClass {
    SomeClass() {
        System.out.println("I am the base constructor");
    }
    SomeClass(int a) {
        this();
        System.out.println("I have an extra value: " + a);
        this.someMethod(a);
    }
    SomeClass(int a, double b) {
        this(a);
        System.out.println("I have more values: " + b);
    }
    public void someMethod() {
        System.out.println("I have no param");
    }
    public void someMethod(int c) {
        System.out.println("I borrow " + c + " form a constructor");
    }
}
public class Main {
    public static void main(String[] args) {
        SomeClass s = new SomeClass(5, 6.3);
        s.someMethod();
    }
}`,
    answer: {
      output: `I am the base constructor
I have an extra value: 5
I borrow 5 form a constructor
I have more values: 6.3
I have no param`,
      html: '<p><code>(5, 6.3)</code> matches <code>SomeClass(int, double)</code>. It calls <code>this(5)</code>, which calls <code>this()</code>. The deepest constructor prints first, then each one finishes its remaining lines on the way back up.</p>'
    },
    tips: ['Think of <code>this(...)</code> as a function call: the rest of the constructor waits until the called constructor finishes.', 'Copy strings exactly, typos included. The paper says "form a constructor", not "from".'],
    trace: {
      steps: [
        S('SomeClass s = new SomeClass(5, 6.3);', 'Arguments (int, double) → SomeClass(int a, double b).', ['call', 'main()'], ['new', 's', 'SomeClass', {}], ['call', 'SomeClass(int a, double b)', { this: '@s', a: '5', b: '6.3' }]),
        S('this(a);', 'Calls SomeClass(int). The rest of this constructor waits.', ['call', 'SomeClass(int a)', { this: '@s', a: '5' }]),
        S('this();', 'Calls SomeClass().', ['call', 'SomeClass()', { this: '@s' }]),
        S('System.out.println("I am the base constructor");', '', ['p', 'I am the base constructor']),
        S('System.out.println("I have an extra value: " + a);', 'Back in SomeClass(int).', ['ret'], ['p', 'I have an extra value: 5']),
        S('this.someMethod(a);', 'An int is passed → someMethod(int).', ['call', 'someMethod(int c)', { this: '@s', c: '5' }]),
        S('System.out.println("I borrow "', '', ['p', 'I borrow 5 form a constructor']),
        S('System.out.println("I have more values: " + b);', 'Back up to SomeClass(int, double).', ['ret'], ['ret'], ['p', 'I have more values: 6.3']),
        S('SomeClass s = new SomeClass(5, 6.3);', '', ['ret'], ['v', 's', '@s']),
        S('System.out.println("I have no param");', 's.someMethod() with no arguments.', ['p', 'I have no param'])
      ]
    }
  });

  // ======================= Spring 2023 Q4 =======================
  Q({
    id: '231-q4', paper: '231', qno: '4', marks: 3, topic: 'class', sub: ['static'], type: 'output',
    title: 'Static method in Parent and Child (method hiding)',
    prompt: '<p>Write the output of the following code.</p>',
    given: code`
public class Parent {
    public static int count = 0;
    public static void printDetails() {
        count++;
        System.out.println("I am in Parent Class: " + count);
    }
}
public class Child extends Parent {
    public static void printDetails() {
        count++;
        System.out.println("I am in a Child Class: " + count);
    }
}
public class Main {
    public static void main(String[] args) {
        Child x = new Child();
        x.printDetails();
        x.printDetails();
        Parent y = new Parent();
        y.printDetails();
        Child.printDetails();
        Parent.printDetails();
        x.printDetails();
    }
}`,
    answer: {
      output: `I am in a Child Class: 1
I am in a Child Class: 2
I am in Parent Class: 3
I am in a Child Class: 4
I am in Parent Class: 5
I am in a Child Class: 6`,
      html: '<p>There is only <b>one</b> <code>count</code> (declared static in Parent, inherited by Child), so it keeps increasing: 1, 2, …, 6. A static method is chosen by the <b>declared type</b> of the reference (or the class name), not by the object. x is declared <code>Child</code>, y is declared <code>Parent</code>.</p>'
    },
    traps: ['Static methods are not overridden, they are <b>hidden</b>. If x were declared <code>Parent x = new Child();</code>, then <code>x.printDetails()</code> would print the Parent version.'],
    trace: {
      steps: [
        S('Child x = new Child();', '', ['s', 'Parent', 'count', '0'], ['call', 'main()'], ['new', 'x', 'Child', {}], ['v', 'x', '@x']),
        S('System.out.println("I am in a Child Class: "', 'x is declared Child → Child.printDetails(). count = 1', ['s', 'Parent', 'count', '1'], ['p', 'I am in a Child Class: 1']),
        S('System.out.println("I am in a Child Class: "', 'count = 2', ['s', 'Parent', 'count', '2'], ['p', 'I am in a Child Class: 2']),
        S('Parent y = new Parent();', '', ['new', 'y', 'Parent', {}], ['v', 'y', '@y']),
        S('System.out.println("I am in Parent Class: "', 'y is declared Parent → Parent version. count = 3', ['s', 'Parent', 'count', '3'], ['p', 'I am in Parent Class: 3']),
        S('System.out.println("I am in a Child Class: "', 'Child.printDetails()', ['s', 'Parent', 'count', '4'], ['p', 'I am in a Child Class: 4']),
        S('System.out.println("I am in Parent Class: "', 'Parent.printDetails()', ['s', 'Parent', 'count', '5'], ['p', 'I am in Parent Class: 5']),
        S('System.out.println("I am in a Child Class: "', 'x.printDetails()', ['s', 'Parent', 'count', '6'], ['p', 'I am in a Child Class: 6'])
      ]
    }
  });

  // ======================= Fall 2022 Q1 =======================
  Q({
    id: '223-q1', paper: '223', qno: '1', marks: 6, topic: 'class', sub: ['init-order', 'constructors', 'overloading'], type: 'output',
    title: 'GoT: two instance blocks + overloaded constructors',
    prompt: '<p>Write the output of the following program.</p>',
    given: code`
public class GoT {
    {
        System.out.println("Valar dohaeris");
    }
    public String name;
    public String house;
    public double impact;
    public float intent;

    public GoT() {
        System.out.println("Best TV series after Breaking Bad");
    }
    public GoT(String name, String house) {
        this.name = name;
        this.house = house;
    }
    public GoT(double impact) {
        this("Daenerys", "Targaryen");
        this.impact = impact;
    }
    public GoT(float intent) {
        this("Arya", "Stark");
        this.intent = intent;
    }
    public void printFullName() {
        System.out.println(name + " " + house);
    }
    public void printDetails() {
        printFullName();
        System.out.println("Impact: " + impact);
        System.out.println("Intent: " + intent);
    }
    {
        System.out.println("Valar morghulis");
    }
    public static void main(String[] args) {
        GoT ob1 = new GoT();
        ob1.name = "John Snow";
        ob1.house = "404";
        GoT ob2 = new GoT(4.8);
        ob1.printDetails();
        ob2.printDetails();
    }
}`,
    answer: {
      output: `Valar dohaeris
Valar morghulis
Best TV series after Breaking Bad
Valar dohaeris
Valar morghulis
John Snow 404
Impact: 0.0
Intent: 0.0
Daenerys Targaryen
Impact: 4.8
Intent: 0.0`,
      html: `<ul><li>Both instance blocks run (in file order) before every constructor body. The second block is near the end of the class, but it still runs before the constructor.</li>
<li><code>4.8</code> is a <b>double</b> literal, so <code>GoT(double)</code> is chosen, not <code>GoT(float)</code>. A float literal would need an <code>f</code>: <code>4.8f</code>.</li>
<li>GoT(String, String) prints nothing, so object 2 only prints the two block lines.</li>
<li>Default values: double → <code>0.0</code>, float → <code>0.0</code>.</li></ul>`
    },
    traps: ['<code>4.8</code> without <code>f</code> is a double. Overload resolution picks <code>GoT(double)</code>.', 'An unset float field prints <code>0.0</code>, the same as a double.'],
    trace: {
      steps: [
        S('GoT ob1 = new GoT();', '', ['call', 'main()'], ['new', 'g1', 'GoT', { name: 'null', house: 'null', impact: '0.0', intent: '0.0' }], ['call', 'GoT()', { this: '@g1' }]),
        S('System.out.println("Valar dohaeris");', 'Instance block #1', ['p', 'Valar dohaeris']),
        S('System.out.println("Valar morghulis");', 'Instance block #2 (written lower in the class, but still runs before the constructor body).', ['p', 'Valar morghulis']),
        S('System.out.println("Best TV series', 'Constructor body.', ['p', 'Best TV series after Breaking Bad']),
        S('GoT ob1 = new GoT();', '', ['ret'], ['v', 'ob1', '@g1']),
        S('ob1.name = "John Snow";', '', ['f', 'g1', 'name', '"John Snow"']),
        S('ob1.house = "404";', '', ['f', 'g1', 'house', '"404"']),
        S('GoT ob2 = new GoT(4.8);', '4.8 is a double → GoT(double impact).', ['new', 'g2', 'GoT', { name: 'null', house: 'null', impact: '0.0', intent: '0.0' }], ['call', 'GoT(double impact)', { this: '@g2', impact: '4.8' }]),
        S('this("Daenerys", "Targaryen");', '', ['call', 'GoT(String name, String house)', { this: '@g2', name: '"Daenerys"', house: '"Targaryen"' }]),
        S('System.out.println("Valar dohaeris");', 'Instance blocks run at the start of GoT(String, String), the constructor without this().', ['p', 'Valar dohaeris']),
        S('System.out.println("Valar morghulis");', '', ['p', 'Valar morghulis']),
        S('this.name = name;', '', ['f', 'g2', 'name', '"Daenerys"']),
        S('this.house = house;', '', ['f', 'g2', 'house', '"Targaryen"']),
        S('this.impact = impact;', '', ['ret'], ['f', 'g2', 'impact', '4.8']),
        S('GoT ob2 = new GoT(4.8);', '', ['ret'], ['v', 'ob2', '@g2']),
        S('System.out.println(name + " " + house);', 'ob1.printDetails() → printFullName()', ['p', 'John Snow 404']),
        S('System.out.println("Impact: " + impact);', '', ['p', 'Impact: 0.0']),
        S('System.out.println("Intent: " + intent);', '', ['p', 'Intent: 0.0']),
        S('System.out.println(name + " " + house);', 'ob2.printDetails()', ['p', 'Daenerys Targaryen']),
        S('System.out.println("Impact: " + impact);', '', ['p', 'Impact: 4.8']),
        S('System.out.println("Intent: " + intent);', '', ['p', 'Intent: 0.0'])
      ]
    }
  });

  // ======================= Summer 2022 Q3(a) =======================
  Q({
    id: '222-q3a', paper: '222', qno: '3(a)', marks: 3, topic: 'class', sub: ['init-order', 'constructors'], type: 'output',
    title: 'Mid: field init, instance block, this(100, 200)',
    prompt: '<p>Write only the output from the main method, in the order it appears in the console.</p>',
    given: code`
class Mid {
    int x = 10;
    {
        x = 20;
        System.out.println("@Block=" + x);
    }
    Mid(int x1, int x2) {
        x = x1 + x2;
        System.out.println("@Constructor-2=" + x);
    }
    Mid(int x1) {
        this(100, 200);
        x = x1;
        System.out.println("@Constructor-1=" + x);
    }
    Mid() {
        this(50);
        x = 30;
        System.out.println("@Constructor-0=" + x);
    }
}
public class InitBlock {
    public static void main(String[] args) {
        Mid obj1 = new Mid(30);
        System.out.println("@End=" + obj1.x);
    }
}`,
    answer: {
      output: `@Block=20
@Constructor-2=300
@Constructor-1=30
@End=30`,
      html: '<p><code>new Mid(30)</code> calls <code>Mid(int)</code>, never <code>Mid()</code>, so "@Constructor-0" is <b>not</b> printed. Mid(int) calls this(100, 200). The initializers run at the start of Mid(int, int): x = 10 → 20 (print). Then x = 300 (print), then back in Mid(int): x = 30 (print).</p>'
    },
    traps: ['Don’t trace constructors that are never called. <code>Mid()</code> is a distractor.'],
    trace: {
      steps: [
        S('Mid obj1 = new Mid(30);', '', ['call', 'main()'], ['new', 'm', 'Mid', { x: '0' }], ['call', 'Mid(int x1)', { this: '@m', x1: '30' }]),
        S('this(100, 200);', '', ['call', 'Mid(int x1, int x2)', { this: '@m', x1: '100', x2: '200' }]),
        S('int x = 10;', 'Initializers run at the start of the constructor that has no this().', ['f', 'm', 'x', '10']),
        S('x = 20;', '', ['f', 'm', 'x', '20']),
        S('System.out.println("@Block=" + x);', '', ['p', '@Block=20']),
        S('x = x1 + x2;', '', ['f', 'm', 'x', '300']),
        S('System.out.println("@Constructor-2=" + x);', '', ['p', '@Constructor-2=300']),
        S('x = x1;', 'Back in Mid(int).', ['ret'], ['f', 'm', 'x', '30']),
        S('System.out.println("@Constructor-1=" + x);', '', ['p', '@Constructor-1=30']),
        S('Mid obj1 = new Mid(30);', 'Mid() was never called.', ['ret'], ['v', 'obj1', '@m']),
        S('System.out.println("@End=" + obj1.x);', '', ['p', '@End=30'])
      ]
    }
  });

  // ======================= Summer 2022 Q3(b) =======================
  Q({
    id: '222-q3b', paper: '222', qno: '3(b)', marks: 3, topic: 'class', sub: ['references', 'gc'], type: 'output',
    title: 'resetPoint1 vs resetPoint2 (pass-by-value)',
    prompt: '<p>(i) What will be the outputs from lines 24 and 26? (ii) Explain the consequences of line 28 in terms of garbage collection.</p>',
    given: code`
class Point {
    int x;
    int y;

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }
}
public class PointDemo {
    void resetPoint1(Point p) {
        p = new Point(0, 0);
    }
    void resetPoint2(Point p) {
        p.x = 0;
        p.y = 0;
    }
    public static void main(String[] args) {
        Point p1 = new Point(3, 5);
        Point p2 = new Point(10, 15);

        PointDemo demo = new PointDemo();
        demo.resetPoint1(p1);
        System.out.println("(" + p1.x + ", " + p1.y + ")"); // Question (i)
        demo.resetPoint2(p2);
        System.out.println("(" + p2.x + ", " + p2.y + ")"); // Question (i)

        p2 = new Point(9, 9); // Question (ii)
    }
}`,
    answer: {
      output: `(3, 5)
(0, 0)`,
      html: `<p><b>(i)</b> Java passes a <b>copy of the reference</b>. In <code>resetPoint1</code>, <code>p = new Point(0,0)</code> only re-points the local copy p. main’s p1 is untouched → (3, 5). In <code>resetPoint2</code>, <code>p.x = 0</code> follows the copied arrow to the <b>same</b> object and changes it → (0, 0).</p>
<p><b>(ii)</b> After line 28, p2 points to the new Point(9, 9). The old Point object (now 0, 0) has no reference left, so it becomes <b>eligible for garbage collection</b>. The Point(0, 0) created inside resetPoint1 was already eligible when that method returned.</p>`
    },
    traps: ['Re-assigning a parameter (<code>p = new …</code>) never affects the caller. Changing a field through the parameter (<code>p.x = …</code>) does.'],
    tips: ['Ask yourself: does the method say <code>param = …</code> (no effect outside) or <code>param.field = …</code> (visible outside)?'],
    trace: {
      steps: [
        S('Point p1 = new Point(3, 5);', '', ['call', 'main()'], ['new', 'a', 'Point', { x: '3', y: '5' }], ['v', 'p1', '@a']),
        S('Point p2 = new Point(10, 15);', '', ['new', 'b', 'Point', { x: '10', y: '15' }], ['v', 'p2', '@b']),
        S('PointDemo demo = new PointDemo();', '', ['new', 'd', 'PointDemo', {}], ['v', 'demo', '@d']),
        S('demo.resetPoint1(p1);', 'The VALUE of p1 (an arrow to #1) is copied into parameter p.', ['call', 'resetPoint1(Point p)', { this: '@d', p: '@a' }]),
        S('p = new Point(0, 0);', 'The local p is re-pointed to a NEW object. main’s p1 still points to #1.', ['new', 'z', 'Point', { x: '0', y: '0' }], ['v', 'p', '@z']),
        S('demo.resetPoint1(p1);', 'Method returns; its frame disappears. The Point(0, 0) is now unreachable.', ['ret']),
        S('System.out.println("(" + p1.x + ", " + p1.y + ")"); // Question (i)', '', ['p', '(3, 5)']),
        S('demo.resetPoint2(p2);', '', ['call', 'resetPoint2(Point p)', { this: '@d', p: '@b' }]),
        S('p.x = 0;', 'Follows the arrow and changes the SAME object main sees.', ['f', 'b', 'x', '0']),
        S('p.y = 0;', '', ['f', 'b', 'y', '0']),
        S('demo.resetPoint2(p2);', '', ['ret']),
        S('System.out.println("(" + p2.x + ", " + p2.y + ")"); // Question (i)', '', ['p', '(0, 0)']),
        S('p2 = new Point(9, 9);', 'Old object #2 loses its last reference → eligible for GC.', ['new', 'n', 'Point', { x: '9', y: '9' }], ['v', 'p2', '@n'])
      ]
    }
  });

  // ======================= Spring 2022 Q5(b) =======================
  Q({
    id: '221-q5b', paper: '221', qno: '5(b)', marks: 4, topic: 'class', sub: ['references', 'gc'], type: 'output',
    title: 'swapPoints1 vs swapPoints2 + which lines create garbage',
    prompt: '<p>(i) What values will be printed in lines 31 and 33? (ii) Mention the line numbers in main that cause some objects to be marked for garbage collection.</p>',
    given: code`
class Point {
    int x, y;
}

class Functions {
    void swapPoints1(Point a, Point b) {
        Point t = a;
        a = b;
        b = t;
    }
    void swapPoints2(Point a, Point b) {
        int x = a.x;
        int y = a.y;
        a.x = b.x;
        a.y = b.y;
        b.x = x;
        b.y = y;
    }
}
class Main {
    public static void main(String[] args) {
        Functions fnc = new Functions();
        Point p1 = new Point();
        p1.x = 10;
        p1.y = 15;
        Point p2 = new Point();
        p2.x = 20;
        p2.y = 25;
        fnc.swapPoints1(p1, p2);
        System.out.println(p1.x + ", " + p1.y);
        fnc.swapPoints2(p1, p2);
        System.out.println(p1.x + ", " + p1.y);
        new Point();
        Point p3 = p2;
        p2 = new Point();
        p3 = p1;
        p1 = p2;
    }
}`,
    answer: {
      output: `10, 15
20, 25`,
      html: `<p><b>(i)</b> swapPoints1 only swaps the local copies a and b, so nothing changes in main: <b>10, 15</b>. swapPoints2 copies the <b>field values</b> across the two objects: <b>20, 25</b>.</p>
<p><b>(ii)</b> (Paper line numbers.) <b>Line 34</b> <code>new Point();</code> creates an object no one refers to, so it is garbage immediately. After line 36 (<code>p2 = new Point()</code>) the old p2 object is still held by p3. At <b>line 37</b> (<code>p3 = p1</code>) that object (20/25 → now 10/15 after the swap) loses its last reference. Line 38 (<code>p1 = p2</code>) leaves the original p1 object still referenced by p3. So lines <b>34 and 37</b> create garbage.</p>`
    },
    traps: ['<code>new Point();</code> on its own line creates an object that is unreachable at once.', 'Before saying "garbage", check every variable: the object may still be held by another reference such as p3.'],
    trace: {
      steps: [
        S('Functions fnc = new Functions();', '', ['call', 'main()'], ['new', 'f', 'Functions', {}], ['v', 'fnc', '@f']),
        S('Point p1 = new Point();', '', ['new', 'A', 'Point', { x: '0', y: '0' }], ['v', 'p1', '@A']),
        S('p1.x = 10;', '', ['f', 'A', 'x', '10']),
        S('p1.y = 15;', '', ['f', 'A', 'y', '15']),
        S('Point p2 = new Point();', '', ['new', 'B', 'Point', { x: '0', y: '0' }], ['v', 'p2', '@B']),
        S('p2.x = 20;', '', ['f', 'B', 'x', '20']),
        S('p2.y = 25;', '', ['f', 'B', 'y', '25']),
        S('fnc.swapPoints1(p1, p2);', 'a and b are copies of the arrows.', ['call', 'swapPoints1(Point a, Point b)', { this: '@f', a: '@A', b: '@B' }]),
        S('Point t = a;', '', ['v', 't', '@A']),
        S('a = b;', 'Only the LOCAL a changes.', ['v', 'a', '@B']),
        S('b = t;', 'Local a and b are swapped… main’s p1, p2 are not.', ['v', 'b', '@A']),
        S('fnc.swapPoints1(p1, p2);', 'Frame gone; no effect.', ['ret']),
        S('System.out.println(p1.x + ", " + p1.y);@1', '', ['p', '10, 15']),
        S('fnc.swapPoints2(p1, p2);', '', ['call', 'swapPoints2(Point a, Point b)', { this: '@f', a: '@A', b: '@B' }]),
        S('int x = a.x;', '', ['v', 'x', '10']),
        S('int y = a.y;', '', ['v', 'y', '15']),
        S('a.x = b.x;', 'This changes the actual object #2 (p1’s object).', ['f', 'A', 'x', '20']),
        S('a.y = b.y;', '', ['f', 'A', 'y', '25']),
        S('b.x = x;', '', ['f', 'B', 'x', '10']),
        S('b.y = y;', '', ['f', 'B', 'y', '15']),
        S('fnc.swapPoints2(p1, p2);', 'The objects’ contents really were swapped.', ['ret']),
        S('System.out.println(p1.x + ", " + p1.y);@2', '', ['p', '20, 25']),
        S('        new Point();', 'Created and immediately unreachable → garbage (line 34).', ['new', 'C', 'Point', { x: '0', y: '0' }]),
        S('Point p3 = p2;', '', ['v', 'p3', '@B']),
        S('p2 = new Point();@2', 'Old p2 object is still held by p3 → NOT garbage yet.', ['new', 'D', 'Point', { x: '0', y: '0' }], ['v', 'p2', '@D']),
        S('p3 = p1;', 'Now nothing points to object #3 → garbage (line 37).', ['v', 'p3', '@A']),
        S('p1 = p2;', 'Object #2 is still held by p3 → not garbage.', ['v', 'p1', '@D'])
      ]
    }
  });

  // ======================= Fall 2021 Q3 =======================
  Q({
    id: '213-q3', paper: '213', qno: '3', marks: 5, topic: 'class', sub: ['references', 'gc'], type: 'output',
    title: 'Exam: testFnc1 (swap refs) vs testFnc2 (swap fields)',
    prompt: '<p>A. Write the output of the println calls in lines 26, 28 and 30 (only e1’s values are printed). B. Explain what happens after lines 32 and 33 in terms of garbage collection.</p>',
    given: code`
class Exam {
    int id;
    double mark;
}

class MTest {
    void testFnc1(Exam m1, Exam m2) {
        Exam temp = m1;
        m1 = m2;
        m2 = temp;
    }

    void testFnc2(Exam m1, Exam m2) {
        int tempId = m1.id;
        double tempMark = m2.mark;
        m1.id = m2.id;   m1.mark = m2.mark;
        m2.id = tempId;  m2.mark = tempMark;
    }

    public static void main(String[] args) {
        MTest testObj = new MTest();
        Exam e1 = new Exam();
        Exam e2 = new Exam();
        e1.id = 10;    e1.mark = 70;
        e2.id = 20;    e2.mark = 85;
        System.out.println(e1.id + " " + e1.mark);
        testObj.testFnc1(e1, e2);
        System.out.println(e1.id + " " + e1.mark);
        testObj.testFnc2(e1, e2);
        System.out.println(e1.id + " " + e1.mark);

        e1 = new Exam();
        e2 = new Exam();
    }
}`,
    answer: {
      output: `10 70.0
10 70.0
20 85.0`,
      html: `<p>testFnc1 swaps local copies of the references, so there is no effect. testFnc2 writes into the objects, so e1’s object gets id 20, mark 85.0. (Note a bug in the paper’s code: <code>tempMark</code> stores <code>m2.mark</code>, so e2 ends with mark 85.0, not 70. That doesn’t affect what is printed.)</p>
<p><b>B.</b> Line 32 points e1 to a new Exam, so the old e1 object has no reference → eligible for GC. Line 33 does the same for the old e2 object. So <b>2 objects</b> become eligible.</p>`
    },
    traps: ['<code>e1.mark = 70</code> stores into a <b>double</b> field, so it prints <code>70.0</code>.'],
    trace: {
      steps: [
        S('MTest testObj = new MTest();', '', ['call', 'main()'], ['new', 't', 'MTest', {}], ['v', 'testObj', '@t']),
        S('Exam e1 = new Exam();', '', ['new', 'A', 'Exam', { id: '0', mark: '0.0' }], ['v', 'e1', '@A']),
        S('Exam e2 = new Exam();', '', ['new', 'B', 'Exam', { id: '0', mark: '0.0' }], ['v', 'e2', '@B']),
        S('e1.id = 10;', '', ['f', 'A', 'id', '10'], ['f', 'A', 'mark', '70.0']),
        S('e2.id = 20;', '', ['f', 'B', 'id', '20'], ['f', 'B', 'mark', '85.0']),
        S('System.out.println(e1.id + " " + e1.mark);@1', '', ['p', '10 70.0']),
        S('testObj.testFnc1(e1, e2);', '', ['call', 'testFnc1(Exam m1, Exam m2)', { this: '@t', m1: '@A', m2: '@B' }]),
        S('Exam temp = m1;', '', ['v', 'temp', '@A']),
        S('m1 = m2;', '', ['v', 'm1', '@B']),
        S('m2 = temp;', 'Only the local arrows swapped.', ['v', 'm2', '@A']),
        S('testObj.testFnc1(e1, e2);', '', ['ret']),
        S('System.out.println(e1.id + " " + e1.mark);@2', 'Unchanged.', ['p', '10 70.0']),
        S('testObj.testFnc2(e1, e2);', '', ['call', 'testFnc2(Exam m1, Exam m2)', { this: '@t', m1: '@A', m2: '@B' }]),
        S('int tempId = m1.id;', '', ['v', 'tempId', '10']),
        S('double tempMark = m2.mark;', 'Note: the paper copies m2.mark here (probably a typo for m1.mark).', ['v', 'tempMark', '85.0']),
        S('m1.id = m2.id;', 'Writes INTO object #2.', ['f', 'A', 'id', '20'], ['f', 'A', 'mark', '85.0']),
        S('m2.id = tempId;', '', ['f', 'B', 'id', '10'], ['f', 'B', 'mark', '85.0']),
        S('testObj.testFnc2(e1, e2);', '', ['ret']),
        S('System.out.println(e1.id + " " + e1.mark);@3', '', ['p', '20 85.0']),
        S('e1 = new Exam();@2', 'Old e1 object → eligible for GC.', ['new', 'C', 'Exam', { id: '0', mark: '0.0' }], ['v', 'e1', '@C']),
        S('e2 = new Exam();@2', 'Old e2 object → eligible for GC. Total: 2.', ['new', 'D', 'Exam', { id: '0', mark: '0.0' }], ['v', 'e2', '@D'])
      ]
    }
  });

  // ======================= Fall 2020 Q1(b) =======================
  Q({
    id: '203-q1b', paper: '203', qno: '1(b)', marks: 2, topic: 'class', sub: ['gc', 'references'], type: 'output',
    title: 'Garbage: how many eligible after line 14?',
    prompt: '<p>How many objects will be eligible for garbage collection after line 14 executes? Explain briefly.</p>',
    given: code`
class Garbage {
    int val;
    Garbage(int a) {
        val = a;
    }
    void update(Garbage a) {
        this.val = a.val;
    }
}
public class GC {
    public static void main(String[] args) {
        Garbage g1 = new Garbage(1);
        new Garbage(2);
        g1.update(new Garbage(3));
        System.out.println(g1.val);
    }
}`,
    answer: {
      output: '3',
      html: '<p><b>2 objects</b>. <code>new Garbage(2)</code> is never stored anywhere, so it is unreachable at once. <code>new Garbage(3)</code> is only referenced by the parameter <code>a</code> while <code>update</code> runs. update copies the <b>value</b> 3 into g1 (not the reference), so once the method returns nothing points to Garbage(3). Only Garbage(1) (held by g1) is alive. The program prints 3.</p>'
    },
    traps: ['<code>this.val = a.val</code> copies an int, not the object. g1 doesn’t keep Garbage(3) alive.'],
    trace: {
      steps: [
        S('Garbage g1 = new Garbage(1);', '', ['call', 'main()'], ['new', 'g1', 'Garbage', { val: '1' }], ['v', 'g1', '@g1']),
        S('new Garbage(2);', 'Not assigned to any variable → unreachable immediately.', ['new', 'g2', 'Garbage', { val: '2' }]),
        S('g1.update(new Garbage(3));', 'Garbage(3) is alive only through the parameter a.', ['new', 'g3', 'Garbage', { val: '3' }], ['call', 'update(Garbage a)', { this: '@g1', a: '@g3' }]),
        S('this.val = a.val;', 'Copies the int 3, not the reference.', ['f', 'g1', 'val', '3']),
        S('g1.update(new Garbage(3));', 'Method returns → parameter a disappears → Garbage(3) is unreachable. 2 objects are now eligible.', ['ret']),
        S('System.out.println(g1.val);', '', ['p', '3'])
      ]
    }
  });

  // ======================= Summer 2020 Q3 =======================
  Q({
    id: '202-q3', paper: '202', qno: '3', marks: 5, topic: 'class', sub: ['gc', 'references'], type: 'output',
    title: 'TV / Refrigerator: reference diagrams after each comment',
    prompt: '<p>(i) What is the output? (ii) Draw the reference diagrams after each line with a comment inside main. <span class="muted">(The paper does not show the Refrigerator class. We assume <code>class Refrigerator extends TV</code> with the same 3-argument constructor.)</span></p>',
    given: code`
class TV {
    int id;
    String brandName;
    double marketValue;

    TV(int id, String brandName, double marketValue) {
        this.id = id;
        this.brandName = brandName;
        this.marketValue = marketValue;
    }
    void updatePrice(double value) {
        marketValue = value;
    }
}
public class Main {
    public static void main(String[] args) {
        TV rA = new Refrigerator(1, "Samsung", 40000.0);
        TV rB = new Refrigerator(2, "Sony", 38000.0);
        TV rC;
        rC = rB;    // i
        rB = new TV(5, "Walton", 30000.0);
        rC = rA;    // ii
        rA = new TV(2, "LG", 42000.0);
        rB.updatePrice(rC.marketValue);    // iii

        System.out.println(rA.id + " " + rB.id + " " + rC.id);

        rA = rB;    // iv
    }
}`,
    answer: {
      output: '2 5 1',
      html: `<ul><li><b>(i)</b> rA → Samsung#1, rB → Sony#2, rC → Sony#2.</li>
<li><b>(ii)</b> rB → Walton#5, rC → Samsung#1. Sony#2 has no reference → eligible for GC.</li>
<li><b>(iii)</b> rA → LG#2. Walton’s marketValue becomes 40000.0 (Samsung’s value).</li>
<li><b>(iv)</b> rA → Walton#5. LG#2 has no reference → eligible for GC.</li></ul>
<p>Use the visualiser: it draws exactly these diagrams at each step.</p>`
    },
    traps: ['Two different objects can have the same id value (Sony and LG both have id 2). Track <b>objects</b>, not ids.'],
    trace: {
      steps: [
        S('TV rA = new Refrigerator(1, "Samsung", 40000.0);', '', ['call', 'main()'], ['new', 'sam', 'Refrigerator', { id: '1', brandName: '"Samsung"', marketValue: '40000.0' }], ['v', 'rA', '@sam']),
        S('TV rB = new Refrigerator(2, "Sony", 38000.0);', '', ['new', 'sony', 'Refrigerator', { id: '2', brandName: '"Sony"', marketValue: '38000.0' }], ['v', 'rB', '@sony']),
        S('TV rC;', 'Declared but not initialised (shown as null here; Java won’t let you use it until assigned).', ['v', 'rC', 'null']),
        S('rC = rB;    // i', 'Diagram (i)', ['v', 'rC', '@sony']),
        S('rB = new TV(5, "Walton", 30000.0);', '', ['new', 'wal', 'TV', { id: '5', brandName: '"Walton"', marketValue: '30000.0' }], ['v', 'rB', '@wal']),
        S('rC = rA;    // ii', 'Diagram (ii): nobody points to Sony anymore.', ['v', 'rC', '@sam']),
        S('rA = new TV(2, "LG", 42000.0);', '', ['new', 'lg', 'TV', { id: '2', brandName: '"LG"', marketValue: '42000.0' }], ['v', 'rA', '@lg']),
        S('rB.updatePrice(rC.marketValue);    // iii', 'Diagram (iii): Walton gets Samsung’s value 40000.0.', ['f', 'wal', 'marketValue', '40000.0']),
        S('System.out.println(rA.id', 'rA → LG (2), rB → Walton (5), rC → Samsung (1)', ['p', '2 5 1']),
        S('rA = rB;    // iv', 'Diagram (iv): LG loses its only reference.', ['v', 'rA', '@wal'])
      ]
    }
  });

  // ======================= Summer 2020 Q4 =======================
  Q({
    id: '202-q4', paper: '202', qno: '4', marks: 5, topic: 'class', sub: ['constructors', 'overloading'], type: 'fix',
    title: 'Currency: add missing constructors, then write output',
    prompt: '<p>Fix the error(s) and write the output. You cannot remove any line; you can only add lines/methods. Write only the added lines and the final output.</p>',
    given: code`
class Currency {
    public String country;
    public double amount = 2000.0;
    public boolean isAvailable;

    public Currency(double val) {
        amount = val;
    }
    public void addVal(double c) {
        amount += c;
    }
    public void addAmount(double c, double amount) {
        amount += c;
    }
    public double getAmount() {
        return amount;
    }
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
}`,
    answer: {
      codeTitle: 'Lines to add inside class Currency',
      code: code`
public Currency() { }

public Currency(boolean isAvailable) {
    this.isAvailable = isAvailable;
}`,
      output: `7000.0 false
3000.0 false
2000.0 true`,
      html: `<p><b>Errors:</b> once you write <i>any</i> constructor, Java no longer gives a free default constructor. So <code>new Currency()</code> and <code>new Currency(true)</code> don’t compile until we add them.</p>
<p><b>The big trap:</b> <code>addAmount(double c, double amount)</code> has a parameter named <code>amount</code>. Inside it, <code>amount += c</code> changes the <b>parameter</b>, not the field. Z’s amount stays 2000.0.</p>`
    },
    traps: ['If a class defines any constructor, the default no-arg constructor disappears.', 'A parameter with the same name as a field shadows the field. Without <code>this.</code>, you are changing the local copy.'],
    trace: {
      code: code`
class Currency {
    public String country;
    public double amount = 2000.0;
    public boolean isAvailable;

    public Currency() { }                       // added
    public Currency(boolean isAvailable) {      // added
        this.isAvailable = isAvailable;
    }
    public Currency(double val) {
        amount = val;
    }
    public void addVal(double c) {
        amount += c;
    }
    public void addAmount(double c, double amount) {
        amount += c;
    }
    public double getAmount() {
        return amount;
    }
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
}`,
      steps: [
        S('Currency X = new Currency();', 'Field initializer amount = 2000.0 runs for every object.', ['call', 'main()'], ['new', 'X', 'Currency', { country: 'null', amount: '2000.0', isAvailable: 'false' }], ['v', 'X', '@X']),
        S('Currency Y = new Currency(1000.0);', '', ['new', 'Y', 'Currency', { country: 'null', amount: '2000.0', isAvailable: 'false' }], ['call', 'Currency(double val)', { this: '@Y', val: '1000.0' }]),
        S('amount = val;', '', ['f', 'Y', 'amount', '1000.0']),
        S('Currency Y = new Currency(1000.0);', '', ['ret'], ['v', 'Y', '@Y']),
        S('Currency Z = new Currency(true);', '', ['new', 'Z', 'Currency', { country: 'null', amount: '2000.0', isAvailable: 'false' }], ['call', 'Currency(boolean isAvailable)', { this: '@Z', isAvailable: 'true' }]),
        S('this.isAvailable = isAvailable;', '', ['f', 'Z', 'isAvailable', 'true']),
        S('Currency Z = new Currency(true);', '', ['ret'], ['v', 'Z', '@Z']),
        S('X.addVal(5000.0);', '', ['call', 'addVal(double c)', { this: '@X', c: '5000.0' }]),
        S('amount += c;@1', 'No parameter called amount here → the field changes.', ['f', 'X', 'amount', '7000.0']),
        S('Y.amount += 2000.0;', '', ['ret'], ['f', 'Y', 'amount', '3000.0']),
        S('Z.addAmount(3000.0, 1000.0);', 'Parameter <code>amount</code> = 1000.0 hides the field!', ['call', 'addAmount(double c, double amount)', { this: '@Z', c: '3000.0', amount: '1000.0' }]),
        S('amount += c;@2', 'Only the PARAMETER becomes 4000.0. Z’s field is still 2000.0.', ['v', 'amount', '4000.0']),
        S('System.out.println(X.getAmount()', '', ['ret'], ['p', '7000.0 false']),
        S('System.out.println(Y.getAmount()', '', ['p', '3000.0 false']),
        S('System.out.println(Z.getAmount()', '', ['p', '2000.0 true'])
      ]
    }
  });

  // ======================= Fall 2019 Q2(a) =======================
  Q({
    id: '193-q2a', paper: '193', qno: '2(a)', marks: 4, topic: 'class', sub: ['gc', 'encapsulation'], type: 'output',
    title: 'BankAccount: output + diagrams at // 1 … // 4',
    prompt: '<p>i. What is the output? ii. Draw the objects and references after each line with a comment inside main.</p>',
    given: code`
class BankAccount {
    private String name;
    private double balance;

    BankAccount(String _name, double initialDeposit) {
        name = _name;
        balance = initialDeposit;
    }
    void deposit(double amount) {
        balance = balance + amount;
    }
    void withdraw(double amount) {
        if (amount <= balance) {
            balance = balance - amount;
        }
    }
    double getBalance() { return balance; }
    String getName() { return name; }
}
class Test {
    public static void main(String[] args) {
        BankAccount gatesAccount;                                     // 1
        gatesAccount = new BankAccount("Bill Gates", 500.0);         // 2
        BankAccount jobsAccount = new BankAccount("Steve Jobs", 0.0); // 3
        gatesAccount.withdraw(150.0);
        jobsAccount.deposit(400.0);
        System.out.println(gatesAccount.getName() + " " + gatesAccount.getBalance());
        System.out.println(jobsAccount.getName() + " " + jobsAccount.getBalance());
        jobsAccount = null;                                           // 4
    }
}`,
    answer: {
      output: `Bill Gates 350.0
Steve Jobs 400.0`,
      html: '<ul><li><b>// 1</b>: only a reference variable gatesAccount exists, and no object yet.</li><li><b>// 2</b>: gatesAccount → [Bill Gates, 500.0]</li><li><b>// 3</b>: jobsAccount → [Steve Jobs, 0.0]</li><li><b>// 4</b>: jobsAccount = null. The Steve Jobs object (now 400.0) has no reference → eligible for GC.</li></ul>'
    },
    trace: {
      steps: [
        S('BankAccount gatesAccount;', 'Declaring a reference does NOT create an object.', ['call', 'main()'], ['v', 'gatesAccount', 'null']),
        S('gatesAccount = new BankAccount("Bill Gates", 500.0);', '', ['new', 'g', 'BankAccount', { name: '"Bill Gates"', balance: '500.0' }], ['v', 'gatesAccount', '@g']),
        S('BankAccount jobsAccount = new BankAccount("Steve Jobs", 0.0);', '', ['new', 'j', 'BankAccount', { name: '"Steve Jobs"', balance: '0.0' }], ['v', 'jobsAccount', '@j']),
        S('gatesAccount.withdraw(150.0);', '150 ≤ 500, so withdraw.', ['f', 'g', 'balance', '350.0']),
        S('jobsAccount.deposit(400.0);', '', ['f', 'j', 'balance', '400.0']),
        S('System.out.println(gatesAccount.getName()', '', ['p', 'Bill Gates 350.0']),
        S('System.out.println(jobsAccount.getName()', '', ['p', 'Steve Jobs 400.0']),
        S('jobsAccount = null;', 'The Steve Jobs object is unreachable → eligible for GC.', ['v', 'jobsAccount', 'null'])
      ]
    }
  });

  // ======================= Fall 2019 Q2(b) =======================
  Q({
    id: '193-q2b', paper: '193', qno: '2(b)', marks: 2, topic: 'class', sub: ['references'], type: 'output',
    title: 'Modifier: updateId / updatePrice / V2 versions',
    prompt: '<p>What is the output of the following program?</p>',
    given: code`
class Product {
    String productId;
    double price;
    Product(String id, double _price) {
        productId = id;
        price = _price;
    }
}
class Modifier {
    void updateId(Product p, String newId) {
        p.productId = newId;
    }
    void updatePrice(double curPrice, double newPrice) {
        curPrice = newPrice;
    }
    void updateIdV2(Product p, String newId) {
        p = new Product(newId, p.price);
    }
    void updatePriceV2(Product p, double newPrice) {
        p.price = newPrice;
    }
}
public class Test {
    public static void main(String[] args) {
        Modifier m = new Modifier();
        Product p = new Product("L-124", 450.0);
        m.updateId(p, "L-567");
        System.out.println(p.productId);
        m.updatePrice(p.price, 470.0);
        System.out.println(p.price);
        m.updateIdV2(p, "L-135");
        System.out.println(p.productId);
        m.updatePriceV2(p, 490.0);
        System.out.println(p.price);
    }
}`,
    answer: {
      output: `L-567
450.0
L-567
490.0`,
      html: `<table><tr><th>Call</th><th>What is passed</th><th>Effect on p</th></tr>
<tr><td>updateId</td><td>reference copy</td><td>✅ changes p.productId (field write)</td></tr>
<tr><td>updatePrice</td><td>a copy of the double 450.0</td><td>❌ only the local copy changes</td></tr>
<tr><td>updateIdV2</td><td>reference copy</td><td>❌ local p re-pointed to a new object</td></tr>
<tr><td>updatePriceV2</td><td>reference copy</td><td>✅ field write</td></tr></table>`
    },
    tips: ['Java is <b>always</b> pass-by-value. For objects, the value being copied is the reference (the arrow).'],
    trace: {
      steps: [
        S('Modifier m = new Modifier();', '', ['call', 'main()'], ['new', 'm', 'Modifier', {}], ['v', 'm', '@m']),
        S('Product p = new Product("L-124", 450.0);', '', ['new', 'p', 'Product', { productId: '"L-124"', price: '450.0' }], ['v', 'p', '@p']),
        S('m.updateId(p, "L-567");', '', ['call', 'updateId(Product p, String newId)', { this: '@m', p: '@p', newId: '"L-567"' }]),
        S('p.productId = newId;', 'Field write through the copied arrow → visible in main.', ['f', 'p', 'productId', '"L-567"']),
        S('System.out.println(p.productId);', '', ['ret'], ['p', 'L-567']),
        S('m.updatePrice(p.price, 470.0);', 'Only the number 450.0 is copied in.', ['call', 'updatePrice(double curPrice, double newPrice)', { this: '@m', curPrice: '450.0', newPrice: '470.0' }]),
        S('curPrice = newPrice;', 'Changes the local copy only.', ['v', 'curPrice', '470.0']),
        S('System.out.println(p.price);@1', '', ['ret'], ['p', '450.0']),
        S('m.updateIdV2(p, "L-135");', '', ['call', 'updateIdV2(Product p, String newId)', { this: '@m', p: '@p', newId: '"L-135"' }]),
        S('p = new Product(newId, p.price);', 'Local p now points to a brand-new object. main’s p is unchanged.', ['new', 'q', 'Product', { productId: '"L-135"', price: '450.0' }], ['v', 'p', '@q']),
        S('System.out.println(p.productId);@2', 'The temporary product is garbage after the method returns.', ['ret'], ['p', 'L-567']),
        S('m.updatePriceV2(p, 490.0);', '', ['call', 'updatePriceV2(Product p, double newPrice)', { this: '@m', p: '@p', newPrice: '490.0' }]),
        S('p.price = newPrice;', '', ['f', 'p', 'price', '490.0']),
        S('System.out.println(p.price);@2', '', ['ret'], ['p', '490.0'])
      ]
    }
  });

  // ======================= Fall 2019 Q4(b) =======================
  Q({
    id: '193-q4b', paper: '193', qno: '4(b)', marks: 2, topic: 'class', sub: ['gc', 'references'], type: 'output',
    title: 'Player: how many objects eligible for GC?',
    prompt: '<p>Show how many objects are eligible for garbage collection after the code executes (show with diagrams).</p>',
    given: code`
class Player {
    String name;
    String position;
    Player(String a, String b) {
        name = a;
        position = b;
    }
}
public class Main {
    static void changePosition(Player p, String newPosition) {
        p.position = newPosition;
    }
    public static void main(String[] args) {
        Player p1 = new Player("Ramos", "Defence");
        Player p2 = new Player("Modric", "Midfield");
        Player p3 = new Player("Neymar", "LeftWing");
        changePosition(new Player("Messi", "Striker"), "MidField");
        p2 = p3;
    }
}`,
    answer: {
      html: '<p><b>2 objects</b>: the Messi object (only referenced by the parameter while changePosition ran) and the Modric object (after <code>p2 = p3</code>). Ramos is held by p1, Neymar by p2 and p3.</p>'
    },
    trace: {
      steps: [
        S('Player p1 = new Player("Ramos", "Defence");', '', ['call', 'main()'], ['new', 'r', 'Player', { name: '"Ramos"', position: '"Defence"' }], ['v', 'p1', '@r']),
        S('Player p2 = new Player("Modric", "Midfield");', '', ['new', 'm', 'Player', { name: '"Modric"', position: '"Midfield"' }], ['v', 'p2', '@m']),
        S('Player p3 = new Player("Neymar", "LeftWing");', '', ['new', 'n', 'Player', { name: '"Neymar"', position: '"LeftWing"' }], ['v', 'p3', '@n']),
        S('changePosition(new Player("Messi", "Striker"), "MidField");', '', ['new', 'x', 'Player', { name: '"Messi"', position: '"Striker"' }], ['call', 'changePosition(Player p, String newPosition)', { p: '@x', newPosition: '"MidField"' }]),
        S('p.position = newPosition;', '', ['f', 'x', 'position', '"MidField"']),
        S('changePosition(new Player("Messi", "Striker"), "MidField");', 'After return, nothing refers to Messi → garbage #1.', ['ret']),
        S('p2 = p3;', 'Modric loses its only reference → garbage #2.', ['v', 'p2', '@n'])
      ]
    }
  });

  // ======================= Summer 2019 Q3(c) =======================
  Q({
    id: '192-q3c', paper: '192', qno: '3(c)', marks: 2, topic: 'class', sub: ['gc'], type: 'output',
    title: 'Student s1 = s2; s1 = s3; how many eligible?',
    prompt: '<p>How many objects are eligible for garbage collection after the code executes (show graphically)?</p>',
    given: code`
public class Student {
    String name;
    Student(String n) {
        name = n;
    }
    public static void main(String[] args) {
        Student s1 = new Student("Sam");
        Student s2 = new Student("Mike");
        Student s3 = new Student("John");
        s1 = s2;
        s1 = s3;
    }
}`,
    answer: { html: '<p><b>1 object</b> (Sam). After the code: s1 → John, s2 → Mike, s3 → John. Mike is still held by s2.</p>' },
    trace: {
      steps: [
        S('Student s1 = new Student("Sam");', '', ['call', 'main()'], ['new', 'a', 'Student', { name: '"Sam"' }], ['v', 's1', '@a']),
        S('Student s2 = new Student("Mike");', '', ['new', 'b', 'Student', { name: '"Mike"' }], ['v', 's2', '@b']),
        S('Student s3 = new Student("John");', '', ['new', 'c', 'Student', { name: '"John"' }], ['v', 's3', '@c']),
        S('s1 = s2;', 'Sam has no reference now → eligible.', ['v', 's1', '@b']),
        S('s1 = s3;', 'Mike is still held by s2 → still alive. Answer: 1.', ['v', 's1', '@c'])
      ]
    }
  });

  // ======================= Summer 2018 Q2(a) =======================
  Q({
    id: '182-q2a', paper: '182', qno: '2(a)', marks: 3, topic: 'class', sub: ['gc'], type: 'output',
    title: 'Cookie c1 = c2; c1 = c3; c2 = c4;',
    prompt: '<p>How many objects are eligible for garbage collection after executing the code (show graphically)?</p>',
    given: code`
public class Cookie {
    String name;
    Cookie(String n) {
        name = n;
    }
    public static void main(String[] args) {
        Cookie c1 = new Cookie("W");
        Cookie c2 = new Cookie("X");
        Cookie c3 = new Cookie("Y");
        Cookie c4 = new Cookie("Z");
        c1 = c2;
        c1 = c3;
        c2 = c4;
    }
}`,
    answer: { html: '<p><b>2 objects</b>: W (lost at <code>c1 = c2</code>) and X (lost at <code>c2 = c4</code>; c1 had already moved on to Y). Final: c1 → Y, c2 → Z, c3 → Y, c4 → Z.</p>' },
    tips: ['Draw the final arrows only. Then count the boxes with no arrow pointing at them.'],
    trace: {
      steps: [
        S('Cookie c1 = new Cookie("W");', '', ['call', 'main()'], ['new', 'w', 'Cookie', { name: '"W"' }], ['v', 'c1', '@w']),
        S('Cookie c2 = new Cookie("X");', '', ['new', 'x', 'Cookie', { name: '"X"' }], ['v', 'c2', '@x']),
        S('Cookie c3 = new Cookie("Y");', '', ['new', 'y', 'Cookie', { name: '"Y"' }], ['v', 'c3', '@y']),
        S('Cookie c4 = new Cookie("Z");', '', ['new', 'z', 'Cookie', { name: '"Z"' }], ['v', 'c4', '@z']),
        S('c1 = c2;', 'W is unreachable.', ['v', 'c1', '@x']),
        S('c1 = c3;', 'X is still held by c2.', ['v', 'c1', '@y']),
        S('c2 = c4;', 'Now X is unreachable too. Total eligible: 2.', ['v', 'c2', '@z'])
      ]
    }
  });

  // ======================= Summer 2019 Q4(a) =======================
  Q({
    id: '192-q4a', paper: '192', qno: '4(a)', marks: 1.5, topic: 'class', sub: ['references'], type: 'output',
    title: 'getStudent(s1) returns a new object',
    prompt: '<p>What will be the output of the following program?</p>',
    given: code`
class Student {
    public String name;
    public int id;
    Student(String name, int id) {
        this.name = name;
        this.id = id;
    }
    public Student getStudent(Student s1) {
        s1 = new Student("Rahim", 101);
        return s1;
    }
}
class Main {
    public static void main(String[] args) {
        Student s1 = new Student("Karim", 102);
        System.out.println("Name : " + s1.name + " ID : " + s1.id);
        Student s2 = s1.getStudent(s1);
        Student s3 = s2;
        System.out.println("Name : " + s3.name + " ID : " + s3.id);
    }
}`,
    answer: {
      output: `Name : Karim ID : 102
Name : Rahim ID : 101`,
      html: '<p>Inside getStudent the parameter is re-pointed to a new object, which is then <b>returned</b>. main stores the returned reference in s2 (and s3). main’s s1 still points to Karim.</p>'
    },
    trace: {
      steps: [
        S('Student s1 = new Student("Karim", 102);', '', ['call', 'main()'], ['new', 'k', 'Student', { name: '"Karim"', id: '102' }], ['v', 's1', '@k']),
        S('System.out.println("Name : " + s1.name', '', ['p', 'Name : Karim ID : 102']),
        S('Student s2 = s1.getStudent(s1);', '', ['call', 'getStudent(Student s1)', { this: '@k', s1: '@k' }]),
        S('s1 = new Student("Rahim", 101);', 'Local s1 re-pointed. main’s s1 is unchanged.', ['new', 'r', 'Student', { name: '"Rahim"', id: '101' }], ['v', 's1', '@r']),
        S('return s1;', 'Returns the arrow to Rahim.'),
        S('Student s2 = s1.getStudent(s1);', '', ['ret'], ['v', 's2', '@r']),
        S('Student s3 = s2;', '', ['v', 's3', '@r']),
        S('System.out.println("Name : " + s3.name', '', ['p', 'Name : Rahim ID : 101'])
      ]
    }
  });

  // ======================= Spring 2019 Q6(a) =======================
  Q({
    id: '191-q6a', paper: '191', qno: '6(a)', marks: 2.5, topic: 'class', sub: ['references'], type: 'output',
    title: 'swapReference(obj1, obj2) does not swap',
    prompt: '<p>Write the output of the following code.</p>',
    given: code`
class SwapFunc {
    static void swapReference(RefFunc a, RefFunc b) {
        RefFunc c = a;
        a = b;
        b = c;
    }
}
public class RefFunc {
    int a;
    int b;
    public RefFunc(int a, int b) {
        this.a = a;
        this.b = b;
    }
    public static void main(String[] args) {
        RefFunc obj1 = new RefFunc(5, 6);
        RefFunc obj2 = new RefFunc(7, 8);
        SwapFunc.swapReference(obj1, obj2);
        System.out.println(obj1.a + "\t" + obj2.b);
    }
}`,
    answer: { output: '5\t8', html: '<p>The swap happens only between the method’s local copies. obj1 still → (5, 6), obj2 still → (7, 8). Output: <code>5</code>, a tab, <code>8</code>.</p>' },
    traps: ['A “swap two objects” method that only assigns parameters can <b>never</b> work in Java. To swap, you must swap the <b>fields</b> (see Spring 2018 Q1(a)).'],
    trace: {
      steps: [
        S('RefFunc obj1 = new RefFunc(5, 6);', '', ['call', 'main()'], ['new', 'o1', 'RefFunc', { a: '5', b: '6' }], ['v', 'obj1', '@o1']),
        S('RefFunc obj2 = new RefFunc(7, 8);', '', ['new', 'o2', 'RefFunc', { a: '7', b: '8' }], ['v', 'obj2', '@o2']),
        S('SwapFunc.swapReference(obj1, obj2);', '', ['call', 'swapReference(RefFunc a, RefFunc b)', { a: '@o1', b: '@o2' }]),
        S('RefFunc c = a;', '', ['v', 'c', '@o1']),
        S('a = b;', '', ['v', 'a', '@o2']),
        S('b = c;', 'Local arrows swapped…', ['v', 'b', '@o1']),
        S('SwapFunc.swapReference(obj1, obj2);', '…and thrown away when the method returns.', ['ret']),
        S('System.out.println(obj1.a + "\\t" + obj2.b);', '', ['p', '5\t8'])
      ]
    }
  });

  // ======================= Spring 2019 Q5(a) =======================
  Q({
    id: '191-q5a', paper: '191', qno: '5(a)', marks: 2.5, topic: 'class', sub: ['static'], type: 'output',
    title: 'CrazyVars: static i vs instance j',
    prompt: '<p>Will the code run without errors? If not, specify the errors. Otherwise write the output.</p>',
    given: code`
class CrazyVars {
    static int i;
    int j;
    void incrementI() {
        CrazyVars.i++;
    }
    void incrementJ() {
        this.j++;
    }
}
public class Execution {
    public static void main(String[] args) {
        CrazyVars workerOne = new CrazyVars();
        CrazyVars workerTwo = new CrazyVars();
        workerOne.incrementI();
        workerTwo.incrementJ();
        workerTwo.incrementI();
        workerOne.incrementJ();
        System.out.println(workerOne.i + workerTwo.j);
    }
}`,
    answer: { output: '3', html: '<p>It runs. i is shared: incremented twice → 2. Each object has its own j: workerTwo.j = 1. 2 + 1 = <b>3</b>. Both are ints, so <code>+</code> is addition.</p>' },
    trace: {
      steps: [
        S('CrazyVars workerOne = new CrazyVars();', '', ['s', 'CrazyVars', 'i', '0'], ['call', 'main()'], ['new', 'w1', 'CrazyVars', { j: '0' }], ['v', 'workerOne', '@w1']),
        S('CrazyVars workerTwo = new CrazyVars();', '', ['new', 'w2', 'CrazyVars', { j: '0' }], ['v', 'workerTwo', '@w2']),
        S('workerOne.incrementI();', '', ['s', 'CrazyVars', 'i', '1']),
        S('workerTwo.incrementJ();', 'Only workerTwo’s j.', ['f', 'w2', 'j', '1']),
        S('workerTwo.incrementI();', 'Same shared i.', ['s', 'CrazyVars', 'i', '2']),
        S('workerOne.incrementJ();', '', ['f', 'w1', 'j', '1']),
        S('System.out.println(workerOne.i + workerTwo.j);', '2 + 1', ['p', '3'])
      ]
    }
  });

  // ======================= Spring 2019 Q4(a) =======================
  Q({
    id: '191-q4a', paper: '191', qno: '4(a)', marks: 3, topic: 'class', sub: ['references'], type: 'output',
    title: 'Course.updateCourse(c2) with printf',
    prompt: '<p>Write the output of the following code.</p>',
    given: code`
public class Course {
    String name, id;
    int credit;
    public Course(String name, String id, int credit) {
        this.name = name;
        this.id = id;
        this.credit = credit;
    }
    public void display() {
        System.out.printf("%s-%s-%d\n", name, id, credit);
    }
    public void updateCourse(Course c1) {
        this.name = c1.name;
        this.id = c1.id;
        c1.credit--;
    }
}
public class Application {
    public static void main(String[] args) {
        Course c1 = new Course("OOP", "CSI211", 3);
        Course c2 = new Course("SPL", "CSI121", 1);
        c1.display();
        c2.display();
        c1.updateCourse(c2);
        c1.display();
        c2.display();
    }
}`,
    answer: {
      output: `OOP-CSI211-3
SPL-CSI121-1
SPL-CSI121-3
SPL-CSI121-0`,
      html: '<p>In <code>c1.updateCourse(c2)</code>: <code>this</code> = main’s c1, and the parameter named <code>c1</code> = main’s c2 (the names are a deliberate distraction). c1 copies name and id from c2 but keeps its credit 3. c2’s credit drops to 0.</p>'
    },
    traps: ['The parameter is named <code>c1</code> but receives main’s <code>c2</code>. Track objects, not names.'],
    trace: {
      steps: [
        S('Course c1 = new Course("OOP", "CSI211", 3);', '', ['call', 'main()'], ['new', 'oop', 'Course', { name: '"OOP"', id: '"CSI211"', credit: '3' }], ['v', 'c1', '@oop']),
        S('Course c2 = new Course("SPL", "CSI121", 1);', '', ['new', 'spl', 'Course', { name: '"SPL"', id: '"CSI121"', credit: '1' }], ['v', 'c2', '@spl']),
        S('c1.display();', '', ['p', 'OOP-CSI211-3']),
        S('c2.display();', '', ['p', 'SPL-CSI121-1']),
        S('c1.updateCourse(c2);', 'this = object #1, parameter c1 = object #2.', ['call', 'updateCourse(Course c1)', { this: '@oop', c1: '@spl' }]),
        S('this.name = c1.name;', '', ['f', 'oop', 'name', '"SPL"']),
        S('this.id = c1.id;', '', ['f', 'oop', 'id', '"CSI121"']),
        S('c1.credit--;', 'Decrements object #2’s credit.', ['f', 'spl', 'credit', '0']),
        S('c1.display();@2', '', ['ret'], ['p', 'SPL-CSI121-3']),
        S('c2.display();@2', '', ['p', 'SPL-CSI121-0'])
      ]
    }
  });

  // ======================= Fall 2018 Q6 =======================
  Q({
    id: '183-q6a', paper: '183', qno: '6(a)', marks: 3, topic: 'class', sub: ['references'], type: 'output',
    title: 'Wizard w1 = w2; w2 = w3; w3 = w1;',
    prompt: '<p>Write the output of the given code.</p>',
    given: code`
public class Wizard {
    String name;
    Wizard(String n) {
        name = n;
    }
}
public class Application {
    public static void main(String[] args) {
        Wizard w1 = new Wizard("Hagrid");
        Wizard w2 = new Wizard("Sirius");
        Wizard w3 = new Wizard("Harry");
        w1 = w2;
        w2 = w3;
        w3 = w1;
        System.out.println(w1.name);
        System.out.println(w2.name);
        System.out.println(w3.name);
    }
}`,
    answer: { output: `Sirius
Harry
Sirius`, html: '<p>Assignments copy arrows, one line at a time. When <code>w3 = w1</code> runs, w1 already points to Sirius, so this is not a rotation. Hagrid becomes eligible for GC.</p>' },
    traps: ['This is not a “rotate”. Apply each line to the <b>current</b> state.'],
    trace: {
      steps: [
        S('Wizard w1 = new Wizard("Hagrid");', '', ['call', 'main()'], ['new', 'h', 'Wizard', { name: '"Hagrid"' }], ['v', 'w1', '@h']),
        S('Wizard w2 = new Wizard("Sirius");', '', ['new', 's', 'Wizard', { name: '"Sirius"' }], ['v', 'w2', '@s']),
        S('Wizard w3 = new Wizard("Harry");', '', ['new', 'r', 'Wizard', { name: '"Harry"' }], ['v', 'w3', '@r']),
        S('w1 = w2;', 'Hagrid now has no reference.', ['v', 'w1', '@s']),
        S('w2 = w3;', '', ['v', 'w2', '@r']),
        S('w3 = w1;', 'w1 is Sirius now.', ['v', 'w3', '@s']),
        S('System.out.println(w1.name);', '', ['p', 'Sirius']),
        S('System.out.println(w2.name);', '', ['p', 'Harry']),
        S('System.out.println(w3.name);', '', ['p', 'Sirius'])
      ]
    }
  });
  Q({
    id: '183-q6b', paper: '183', qno: '6(b)', marks: 2, topic: 'class', sub: ['static', 'strings'], type: 'output',
    title: 'Example: static a vs instance b, "Sum: "+2+3, \'a\'+2',
    prompt: '<p>Write the output of the given code.</p>',
    given: code`
public class Example {
    static int a = 5;
    int b = 10;
}
public class FindOutput {
    public static void main(String[] args) {
        Example e1 = new Example();
        Example e2 = new Example();
        e1.a = 10;
        e1.b = 30;
        System.out.println(e2.a);
        System.out.println(e2.b);
        System.out.println("Sum: " + 2 + 3);
        System.out.println('a' + 2);
    }
}`,
    answer: {
      output: `10
10
Sum: 23
99`,
      html: '<ul><li><code>e1.a = 10</code> changes the shared static → e2.a is 10.</li><li><code>e1.b = 30</code> only changes e1’s own b → e2.b is still 10.</li><li><code>"Sum: " + 2</code> → "Sum: 2", then + 3 → <b>"Sum: 23"</b> (left to right).</li><li><code>\'a\' + 2</code>: char + int = int. \'a\' is 97, so the result is <b>99</b>.</li></ul>'
    },
    traps: ['<code>"Sum: " + 2 + 3</code> is "Sum: 23", not "Sum: 5". Use <code>"Sum: " + (2 + 3)</code> to add first.', 'Char arithmetic: \'a\' = 97, \'A\' = 65, \'0\' = 48.'],
    tips: ['Try your own expressions in the <a href="#/learn/class-object/strings">String + evaluator</a>.'],
    trace: {
      steps: [
        S('Example e1 = new Example();', '', ['s', 'Example', 'a', '5'], ['call', 'main()'], ['new', 'x', 'Example', { b: '10' }], ['v', 'e1', '@x']),
        S('Example e2 = new Example();', '', ['new', 'y', 'Example', { b: '10' }], ['v', 'e2', '@y']),
        S('e1.a = 10;', 'Static → shared.', ['s', 'Example', 'a', '10']),
        S('e1.b = 30;', 'Instance → only e1.', ['f', 'x', 'b', '30']),
        S('System.out.println(e2.a);', '', ['p', '10']),
        S('System.out.println(e2.b);', '', ['p', '10']),
        S('System.out.println("Sum: " + 2 + 3);', '("Sum: " + 2) + 3 → "Sum: 2" + 3 → "Sum: 23"', ['p', 'Sum: 23']),
        S("System.out.println('a' + 2);", "char + int → int: 97 + 2", ['p', '99'])
      ]
    }
  });

  // ======================= Summer 2018 Q2(c) =======================
  Q({
    id: '182-q2c', paper: '182', qno: '2(c)', marks: 4, topic: 'class', sub: ['static', 'references'], type: 'output',
    title: 'Test.update(obj): this.a++ (static), b++, obj.c++',
    prompt: '<p>Write the output of the code.</p>',
    given: code`
public class Test {
    static int a = 1;
    int b = 2;
    int c;
    void update(Test obj) {
        this.a++;
        b++;
        obj.c++;
    }
}
public class TestMain {
    public static void main(String[] args) {
        Test obj1 = new Test();
        System.out.println("obj1.a:" + obj1.a);
        System.out.println("obj1.b:" + obj1.b);
        System.out.println("obj1.c:" + obj1.c);
        Test obj2 = new Test();
        obj2.update(obj1);
        System.out.println("obj1.a:" + obj1.a);
        System.out.println("obj1.b:" + obj1.b);
        System.out.println("obj1.c:" + obj1.c);
        obj2 = obj1;
        obj2.update(obj1);
        System.out.println("obj2.a:" + obj2.a);
        System.out.println("obj2.b:" + obj2.b);
        System.out.println("obj2.c:" + obj2.c);
    }
}`,
    answer: {
      output: `obj1.a:1
obj1.b:2
obj1.c:0
obj1.a:2
obj1.b:2
obj1.c:1
obj2.a:3
obj2.b:3
obj2.c:2`,
      html: '<p>In <code>obj2.update(obj1)</code>: <code>this</code> = obj2, so b++ changes obj2’s b, not obj1’s. obj.c++ changes obj1. <code>this.a++</code> is the static a. After <code>obj2 = obj1</code>, this and obj are both obj1, so obj1’s b and c both go up.</p>'
    },
    traps: ['<code>this.a</code> on a static variable still means the single class variable.', 'Unqualified <code>b</code> inside a method means <code>this.b</code>, which belongs to the object the method was called on.'],
    trace: {
      steps: [
        S('Test obj1 = new Test();', '', ['s', 'Test', 'a', '1'], ['call', 'main()'], ['new', 'o1', 'Test', { b: '2', c: '0' }], ['v', 'obj1', '@o1']),
        S('System.out.println("obj1.a:" + obj1.a);@1', '', ['p', 'obj1.a:1']),
        S('System.out.println("obj1.b:" + obj1.b);@1', '', ['p', 'obj1.b:2']),
        S('System.out.println("obj1.c:" + obj1.c);@1', '', ['p', 'obj1.c:0']),
        S('Test obj2 = new Test();', '', ['new', 'o2', 'Test', { b: '2', c: '0' }], ['v', 'obj2', '@o2']),
        S('obj2.update(obj1);@1', 'this = obj2, obj = obj1', ['call', 'update(Test obj)', { this: '@o2', obj: '@o1' }]),
        S('this.a++;', 'static', ['s', 'Test', 'a', '2']),
        S('b++;', 'this.b → obj2’s b', ['f', 'o2', 'b', '3']),
        S('obj.c++;', 'obj1’s c', ['f', 'o1', 'c', '1']),
        S('System.out.println("obj1.a:" + obj1.a);@2', '', ['ret'], ['p', 'obj1.a:2']),
        S('System.out.println("obj1.b:" + obj1.b);@2', 'obj1.b was never touched.', ['p', 'obj1.b:2']),
        S('System.out.println("obj1.c:" + obj1.c);@2', '', ['p', 'obj1.c:1']),
        S('obj2 = obj1;', 'Old obj2 object becomes garbage.', ['v', 'obj2', '@o1']),
        S('obj2.update(obj1);@2', 'this and obj are now the same object.', ['call', 'update(Test obj)', { this: '@o1', obj: '@o1' }]),
        S('this.a++;', '', ['s', 'Test', 'a', '3']),
        S('b++;', '', ['f', 'o1', 'b', '3']),
        S('obj.c++;', '', ['f', 'o1', 'c', '2']),
        S('System.out.println("obj2.a:" + obj2.a);', '', ['ret'], ['p', 'obj2.a:3']),
        S('System.out.println("obj2.b:" + obj2.b);', '', ['p', 'obj2.b:3']),
        S('System.out.println("obj2.c:" + obj2.c);', '', ['p', 'obj2.c:2'])
      ]
    }
  });

  // ======================= Spring 2018 Q2(a) =======================
  Q({
    id: '181-q2a', paper: '181', qno: '2(a)', marks: 2, topic: 'class', sub: ['encapsulation', 'strings'], type: 'output',
    title: 'setA(int a) { a = a; } + String/number + order',
    prompt: '<p>What will be the output? (Both versions from the paper are covered.)</p>',
    given: code`
public class E {
    int a;
    public int getA() { return a; }
    public void setA(int a) { a = a; }
    E show() { return this; }

    public static void main(String[] args) {
        E obj = new E();
        obj.setA(10);
        System.out.println(obj.getA());
        E obj2 = obj.show();
        System.out.println(obj2.getA());

        // OR part of the question
        int a = 10;
        double b = 5;
        String c = "Bazinga";
        System.out.println(a + b + c);
        System.out.println(c + a + b);
        System.out.println(b + a + c);
    }
}`,
    answer: {
      output: `0
0
15.0Bazinga
Bazinga105.0
15.0Bazinga`,
      html: `<p><b>Part 1:</b> In <code>setA</code>, <code>a = a</code> assigns the parameter to itself, so the field stays 0. <code>show()</code> returns <code>this</code>, so obj2 is the same object → 0 again. Fix: <code>this.a = a;</code></p>
<p><b>Part 2 (OR):</b> <code>a + b</code> = 10 + 5.0 = 15.0 (double) → "15.0Bazinga". <code>c + a</code> → "Bazinga10", then + b → "Bazinga105.0".</p>`
    },
    traps: ['<code>a = a;</code> in a setter compiles fine but does nothing. Always write <code>this.a = a;</code>', 'Numbers on the left are added first. Once a String appears, everything after it is joined as text.'],
    trace: {
      steps: [
        S('E obj = new E();', '', ['call', 'main()'], ['new', 'e', 'E', { a: '0' }], ['v', 'obj', '@e']),
        S('obj.setA(10);', '', ['call', 'setA(int a)', { this: '@e', a: '10' }]),
        S('public void setA(int a) { a = a; }', 'Both a’s are the parameter. The field is untouched.', ['v', 'a', '10']),
        S('System.out.println(obj.getA());', '', ['ret'], ['p', '0']),
        S('E obj2 = obj.show();', 'show() returns this → same object.', ['v', 'obj2', '@e']),
        S('System.out.println(obj2.getA());', '', ['p', '0']),
        S('int a = 10;', '', ['v', 'a', '10']),
        S('double b = 5;', 'int 5 widened to 5.0', ['v', 'b', '5.0']),
        S('String c = "Bazinga";', '', ['v', 'c', '"Bazinga"']),
        S('System.out.println(a + b + c);', '(10 + 5.0) = 15.0, then + "Bazinga"', ['p', '15.0Bazinga']),
        S('System.out.println(c + a + b);', '"Bazinga" + 10 = "Bazinga10", + 5.0 = "Bazinga105.0"', ['p', 'Bazinga105.0']),
        S('System.out.println(b + a + c);', '', ['p', '15.0Bazinga'])
      ]
    }
  });
})();
