// Concept pages (Learn), the cheat-sheet, demo traces and quizzes.
(function () {
  const { code, T, page, highlight } = OOP;
  const S = (l, n, ...o) => ({ l, n, o });
  const Qz = OOP.Widgets.quizzes;
  const c = (src) => highlight(src); // inline code listing

  // ------------------------------------------------------------------ demo traces
  T('demo-ref', {
    code: code`
class Student {
    String name;
    double cgpa;
    Student(String name, double cgpa) {
        this.name = name;
        this.cgpa = cgpa;
    }
}
public class Main {
    public static void main(String[] args) {
        Student s1 = new Student("Sam", 3.5);
        Student s2 = new Student("Rina", 3.9);
        Student s3 = s1;
        s3.cgpa = 4.0;
        System.out.println(s1.cgpa);
        s1 = null;
        s2 = s3;
    }
}`,
    expect: '4.0',
    steps: [
      S('public static void main', 'Every method call gets a frame on the stack. Local variables live there.', ['call', 'main()']),
      S('Student s1 = new Student("Sam", 3.5);', '<code>new</code> creates an <b>object</b> on the heap and runs the constructor. <code>s1</code> is a <b>reference</b>: it holds the arrow, not the object.', ['new', 'a', 'Student', { name: '"Sam"', cgpa: '3.5' }], ['v', 's1', '@a']),
      S('Student s2 = new Student("Rina", 3.9);', 'One class, now two objects.', ['new', 'b', 'Student', { name: '"Rina"', cgpa: '3.9' }], ['v', 's2', '@b']),
      S('Student s3 = s1;', 'Assignment copies the ARROW. Still two objects, now three references.', ['v', 's3', '@a']),
      S('s3.cgpa = 4.0;', 'Following s3’s arrow changes object #1, which is also what s1 sees.', ['f', 'a', 'cgpa', '4.0']),
      S('System.out.println(s1.cgpa);', '', ['p', '4.0']),
      S('s1 = null;', 'Object #1 is still reachable through s3 → NOT garbage.', ['v', 's1', 'null']),
      S('s2 = s3;', 'Now nothing points to Rina → eligible for garbage collection.', ['v', 's2', '@a'])
    ]
  });

  T('demo-init', {
    code: code`
class Demo {
    static int count = 0;
    int x = 1;
    static {
        System.out.println("static block, count = " + count);
    }
    {
        x = x + 10;
        System.out.println("instance block, x = " + x);
    }
    Demo() {
        this(5);
        System.out.println("Demo(), x = " + x);
    }
    Demo(int v) {
        x = x + v;
        count++;
        System.out.println("Demo(int), x = " + x);
    }
}
public class Main {
    public static void main(String[] args) {
        System.out.println("main starts");
        Demo d = new Demo();
        Demo e = new Demo(100);
    }
}`,
    expect: 'main starts\nstatic block, count = 0\ninstance block, x = 11\nDemo(int), x = 16\nDemo(), x = 16\ninstance block, x = 11\nDemo(int), x = 111',
    steps: [
      S('System.out.println("main starts");', 'Main is loaded and main runs. Demo is not loaded yet; nothing has used it.', ['call', 'main()'], ['p', 'main starts']),
      S('static int count = 0;', '① First use of Demo → load the class: static fields and static blocks, top to bottom, ONCE.', ['s', 'Demo', 'count', '0']),
      S('System.out.println("static block', '', ['p', 'static block, count = 0']),
      S('Demo d = new Demo();', '② Allocate the object with default values (x = 0).', ['new', 'd', 'Demo', { x: '0' }], ['call', 'Demo()', { this: '@d' }]),
      S('this(5);', '③ Demo() starts with this(5): jump to Demo(int) FIRST.', ['call', 'Demo(int v)', { this: '@d', v: '5' }]),
      S('int x = 1;', '④ Demo(int) has no this(), so field initializers + instance blocks run now (top to bottom).', ['f', 'd', 'x', '1']),
      S('x = x + 10;', '', ['f', 'd', 'x', '11']),
      S('System.out.println("instance block', '', ['p', 'instance block, x = 11']),
      S('x = x + v;', '⑤ Now the body of Demo(int).', ['f', 'd', 'x', '16']),
      S('count++;', '', ['s', 'Demo', 'count', '1']),
      S('System.out.println("Demo(int)', '', ['p', 'Demo(int), x = 16']),
      S('System.out.println("Demo(), x = "', '⑥ Return to the rest of Demo().', ['ret'], ['p', 'Demo(), x = 16']),
      S('Demo d = new Demo();', '', ['ret'], ['v', 'd', '@d']),
      S('Demo e = new Demo(100);', 'Second object: NO static block this time.', ['new', 'e', 'Demo', { x: '0' }], ['call', 'Demo(int v)', { this: '@e', v: '100' }]),
      S('int x = 1;', '', ['f', 'e', 'x', '1']),
      S('x = x + 10;', '', ['f', 'e', 'x', '11']),
      S('System.out.println("instance block', '', ['p', 'instance block, x = 11']),
      S('x = x + v;', '', ['f', 'e', 'x', '111']),
      S('count++;', '', ['s', 'Demo', 'count', '2']),
      S('System.out.println("Demo(int)', '', ['p', 'Demo(int), x = 111']),
      S('Demo e = new Demo(100);', '', ['ret'], ['v', 'e', '@e'])
    ]
  });

  T('demo-pass', {
    code: code`
class Box {
    int v;
}
public class Main {
    static void change(int n, Box b) {
        n = 99;
        b.v = 99;
        b = new Box();
        b.v = -1;
    }
    public static void main(String[] args) {
        int n = 1;
        Box box = new Box();
        box.v = 1;
        change(n, box);
        System.out.println(n + " " + box.v);
    }
}`,
    expect: '1 99',
    steps: [
      S('int n = 1;', '', ['call', 'main()'], ['v', 'n', '1']),
      S('Box box = new Box();', '', ['new', 'b1', 'Box', { v: '0' }], ['v', 'box', '@b1']),
      S('box.v = 1;', '', ['f', 'b1', 'v', '1']),
      S('change(n, box);', 'Java copies the VALUES into the parameters: the number 1, and the arrow to Box #1.', ['call', 'change(int n, Box b)', { n: '1', b: '@b1' }]),
      S('n = 99;', 'Changes only the copy. main’s n is untouched.', ['v', 'n', '99']),
      S('b.v = 99;', 'Follows the copied arrow → changes the SAME object main sees. ✅ visible outside', ['f', 'b1', 'v', '99']),
      S('b = new Box();', 'Re-points the local copy only. main’s box still points to #1. ❌ not visible outside', ['new', 'b2', 'Box', { v: '0' }], ['v', 'b', '@b2']),
      S('b.v = -1;', 'Changes the new object, which main can’t see.', ['f', 'b2', 'v', '-1']),
      S('System.out.println(n + " " + box.v);', 'Back in main. The temporary Box #2 is garbage.', ['ret'], ['p', '1 99'])
    ]
  });

  T('demo-arr', {
    code: code`
public class Main {
    public static void main(String[] args) {
        int[] a = new int[4];
        a[1] = 7;
        int[] b = a;
        b[2] = 5;
        String[] names = new String[3];
        names[0] = "Ana";
        for (int x : a) {
            x = 100;
        }
        System.out.println(a[0] + " " + a[1] + " " + a[2] + " " + names[1]);
    }
}`,
    expect: '0 7 5 null',
    steps: [
      S('int[] a = new int[4];', 'An array is an OBJECT on the heap. Elements get default values: 0 for numbers.', ['call', 'main()'], ['arr', 'A', 'int', ['0', '0', '0', '0']], ['v', 'a', '@A']),
      S('a[1] = 7;', 'Indexes run from 0 to length − 1.', ['f', 'A', 1, '7']),
      S('int[] b = a;', 'Copies the reference: same array, two names.', ['v', 'b', '@A']),
      S('b[2] = 5;', 'Visible through a as well.', ['f', 'A', 2, '5']),
      S('String[] names = new String[3];', 'Arrays of objects start full of null.', ['arr', 'N', 'String', ['null', 'null', 'null']], ['v', 'names', '@N']),
      S('names[0] = "Ana";', '', ['f', 'N', 0, '"Ana"']),
      S('for (int x : a) {', 'for-each copies each element into x…', ['v', 'x', '0'], ['ptr', 'A', 'x', 0]),
      S('x = 100;', '…so changing x does NOT change the array.', ['v', 'x', '100']),
      S('for (int x : a) {', '(and so on for every element)', ['vd', 'x'], ['ptr', 'A', 'x', null]),
      S('System.out.println(a[0]', 'names[1] was never set → null', ['p', '0 7 5 null'])
    ]
  });

  // ------------------------------------------------------------------ quizzes
  Qz.q1 = { q: '<p>How many objects exist after this code?</p>' + c('Student a = new Student();\nStudent b = a;\nStudent c = b;\nStudent[] arr = new Student[5];'), opts: ['1', '2', '3', '8'], ans: 1, why: '<p>One Student (only one <code>new Student()</code>) plus one <b>array</b> object. <code>new Student[5]</code> creates the array with 5 null slots, not 5 students.</p>' };
  Qz.q2 = { q: '<p>A class has only <code>Car(String model)</code>. What happens with <code>new Car()</code>?</p>', opts: ['Works: Java adds a default constructor', 'Compile error', 'Runtime NullPointerException', 'model is set to null'], ans: 1, why: '<p>Java only adds the default no-arg constructor when you write <b>no</b> constructors at all.</p>' };
  Qz.q3 = { q: '<p>Where must <code>this(...)</code> appear inside a constructor?</p>', opts: ['Anywhere', 'The first statement', 'The last statement', 'Only in the no-arg constructor'], ans: 1, why: '<p>It must be the very first statement. That’s also why you can’t have both <code>this(...)</code> and <code>super(...)</code> in one constructor.</p>' };
  Qz.q4 = { q: '<p>Inside a <code>static</code> method you write <code>System.out.println(name);</code>, where <code>name</code> is an instance field. Result?</p>', opts: ['Prints null', 'Prints the last object’s name', 'Compile error', 'Prints ""'], ans: 2, why: '<p>A static method belongs to the class and has no <code>this</code>, so it can’t know <i>which</i> object’s name you mean. "Non-static variable cannot be referenced from a static context."</p>' };
  Qz.q5 = { q: '<p>What does this print?</p>' + c('System.out.println(1 + 2 + "3" + 4 + 5);'), opts: ['15', '3345', '12345', '339'], ans: 1, why: '<p>Left to right: 1 + 2 = 3 → 3 + "3" = "33" → "334" → "3345".</p>' };
  Qz.q6 = { q: '<p><code>final int[] a = {1, 2, 3};</code> Which line is a compile error?</p>', opts: ['a[0] = 10;', 'a = new int[3];', 'Both', 'Neither'], ans: 1, why: '<p><code>final</code> freezes the reference (the arrow), not the contents. You can change elements but not re-point a.</p>' };
  Qz.q7 = { q: '<p><code>int[][] m = new int[3][];</code> What is <code>m[1]</code>?</p>', opts: ['0', 'An empty array', 'null', 'Compile error'], ans: 2, why: '<p>Only the outer array (3 row references) exists. Each row is null until you write <code>m[1] = new int[k];</code>.</p>' };
  Qz.q8 = { q: '<p>Which two methods can be in the same class?</p>', opts: ['int f(int a) and double f(int b)', 'void f(int a, double b) and void f(double a, int b)', 'void f(int a) and void f(int b)', 'None of these'], ans: 1, why: '<p>Overloads must differ in parameter <b>types</b> (or count, or order). The return type and parameter names don’t count.</p>' };

  // ------------------------------------------------------------------ Class & Object page
  page('class-object', {
    title: '📦 Class &amp; Object',
    intro: '<p class="muted">Everything the mid asks about classes and objects, in the order the topics build on each other. Each section ends with links to the past questions on that topic.</p>',
    sections: [
      {
        id: 'basics', title: 'Class, object, reference', qlinks: 'class-basics',
        html: `<ul><li><b>Class</b>: a blueprint/type. It describes fields (data) and methods (behaviour). Written once.</li>
<li><b>Object</b>: a real instance of the class, created at runtime with <code>new</code>. It lives on the <b>heap</b>, and each object has its own copy of the instance fields.</li>
<li><b>Reference</b>: a variable that stores the <i>address</i> of an object. Think of it as an <b>arrow</b>. Local variables (including references) live on the <b>stack</b>.</li></ul>
<div class="callout note"><b class="t">The sentence to remember</b><code>Student s = new Student();</code> = create an object on the heap, then store an arrow to it in the variable s.</div>
<p>Step through this and watch the arrows. This picture is how you answer every reference/GC question:</p>
<div data-trace="demo-ref"></div>
<div data-widget="quiz" data-id="q1"></div>
<h3>Default values of fields</h3>
<div class="table-wrap"><table><tr><th>Type</th><th>Default</th><th>Printed as</th></tr><tr><td>int, long, short, byte</td><td>0</td><td>0</td></tr><tr><td>double, float</td><td>0.0</td><td>0.0</td></tr><tr><td>boolean</td><td>false</td><td>false</td></tr><tr><td>char</td><td>'\\u0000'</td><td>(invisible)</td></tr><tr><td>String / any object</td><td>null</td><td>null</td></tr></table></div>
<div class="callout trap"><b class="t">Trap</b>Only <b>fields</b> get default values. A local variable inside a method must be assigned before use, or it is a compile error.</div>`
      },
      {
        id: 'constructors', title: 'Constructors, <code>this</code> and <code>this(...)</code>', qlinks: 'constructors',
        html: `<p>A constructor has the <b>same name as the class</b> and <b>no return type</b> (not even void). It runs once, right after <code>new</code> allocates the object.</p>
${c(`class Point {
    int x, y;
    Point() { this(0, 0); }                 // chain to the 2-arg constructor
    Point(int x, int y) {
        this.x = x;                         // this.x = field, x = parameter
        this.y = y;
    }
    Point(Point other) {                    // copy constructor
        this(other.x, other.y);
    }
}`)}
<h3>Rules the exam tests</h3><ol>
<li>If you write <b>no</b> constructor, Java gives you a default no-arg one. Write <b>any</b> constructor and that free one disappears → <code>new Point()</code> breaks unless you write it.</li>
<li><code>this.x = x</code>: when a parameter has the same name as a field, the bare name means the <b>parameter</b>. <code>x = x</code> does nothing.</li>
<li><code>this(...)</code> calls another constructor of the same class. It must be the <b>first statement</b>.</li>
<li>Constructor chains run like nested calls: the called constructor finishes completely, then the caller continues with its remaining lines.</li>
<li>If <code>void</code> is written before it, it is a method, not a constructor. That is a classic "find the error".</li></ol>
<div data-widget="quiz" data-id="q2"></div><div data-widget="quiz" data-id="q3"></div>`
      },
      {
        id: 'init-order', title: 'Initialization order: the #1 output question', qlinks: 'init-order',
        html: `<p>Almost every recent paper has a "write the output" question built on this order. Learn it exactly:</p>
<ol class="order-list">
<li><span><b>Class loading (once per class, on first use):</b> static variable initializers and <code>static { }</code> blocks run <b>top to bottom</b> in the order they are written. The class holding <code>main</code> is loaded <i>before</i> main runs.</span></li>
<li><span><b><code>new</code>:</b> memory is allocated and every field is set to its default (0, false, null).</span></li>
<li><span>The constructor is called. If its first line is <code>this(...)</code>, go to that constructor first (repeat).</span></li>
<li><span>In the constructor that does <b>not</b> start with <code>this(...)</code>: (super constructor), then <b>field initializers and instance blocks <code>{ }</code>, top to bottom</b>, exactly once.</span></li>
<li><span>That constructor’s body runs, then each calling constructor finishes its remaining lines on the way back.</span></li></ol>
<div class="callout tip"><b class="t">Exam trick</b>Make a table with one column per static variable and one column per object. Update it line by line, and write each println as you reach it.</div>
<div data-trace="demo-init"></div>
<div class="callout trap"><b class="t">Traps seen in the papers</b><ul><li>A static block written at the <b>bottom</b> of the class still runs first (Summer 2023, Summer 2025).</li><li>An instance block written <b>after</b> the constructor still runs before the constructor body (Fall 2022, Spring 2025).</li><li>Inside a constructor, <code>x</code> means the parameter if one is named x (Summer/Fall 2024 "Sum").</li><li>A second class is loaded only when first touched (Summer 2025).</li></ul></div>`
      },
      {
        id: 'static', title: '<code>static</code> vs instance', qlinks: 'static',
        html: `<div class="table-wrap"><table><tr><th></th><th>instance (no static)</th><th>static</th></tr>
<tr><td>Belongs to</td><td>each object</td><td>the class</td></tr>
<tr><td>Copies</td><td>one per object</td><td><b>exactly one</b>, shared</td></tr>
<tr><td>Access</td><td><code>obj.x</code></td><td><code>ClassName.x</code> (also <code>obj.x</code>, same variable!)</td></tr>
<tr><td>Created</td><td>at <code>new</code></td><td>when the class loads</td></tr>
<tr><td>Can use <code>this</code>?</td><td>yes</td><td><b>no</b></td></tr></table></div>
<ul><li>A <b>static method</b> can use only static fields/methods directly. To use instance members it needs an object: <code>obj.name</code>.</li>
<li>An <b>instance method</b> can use both.</li>
<li><code>t2.count += 10</code> where count is static changes it for <b>everyone</b>.</li>
<li>Counting objects / auto IDs: <code>static int next = 1001;</code> and in the constructor <code>id = next++;</code></li></ul>
<div data-widget="quiz" data-id="q4"></div>
<div class="callout trap"><b class="t">Trap</b>Static methods are <b>hidden</b>, not overridden. The version that runs depends on the declared type of the reference (Spring 2023 Q4).</div>`
      },
      {
        id: 'references', title: 'References &amp; pass-by-value', qlinks: 'references',
        html: `<p>Java is <b>always pass-by-value</b>. For objects, the value that gets copied is the <b>reference</b>. So a method can:</p>
<ul><li>✅ change the object’s fields through the copy: <code>b.v = 99</code> (the caller sees it)</li>
<li>❌ not make the caller’s variable point somewhere else: <code>b = new Box()</code> (the caller doesn’t see it)</li></ul>
<div data-trace="demo-pass"></div>
<div class="callout tip"><b class="t">One-line test</b>Look at each line inside the method. <code>param = …</code> → no effect outside. <code>param.field = …</code> → visible outside.</div>
<p>This is why a swap method that swaps two parameters never works (Spring 2019 Q6, Spring 2022 Q5). To swap two objects inside a method you must swap their <b>fields</b> (Spring 2018 Q1, Fall 2017 Q2).</p>`
      },
      {
        id: 'gc', title: 'Garbage collection &amp; reference diagrams', qlinks: 'gc',
        html: `<p>An object becomes <b>eligible for garbage collection</b> when <b>no live reference</b> can reach it. You can’t force GC; you can only make objects unreachable.</p>
<h3>Four ways an object becomes unreachable</h3><ol>
<li><b>Set to null:</b> <code>s = null;</code> (only if s was the last reference)</li>
<li><b>Re-assign:</b> <code>s1 = s2;</code> (s1’s old object may be lost)</li>
<li><b>Anonymous object:</b> <code>new Student("X");</code> as a statement, or <code>method(new Student())</code> once the method returns</li>
<li><b>Method ends:</b> objects referenced only by that method’s local variables</li></ol>
<div class="callout tip"><b class="t">How to count in the exam</b>1. Draw every object as a box (number them). 2. Process the assignments in order, moving arrows. 3. At the end, count boxes with <b>zero</b> incoming arrows from live variables. Don’t count objects that are still reachable through another object’s field or an array.</div>
<div class="callout trap"><b class="t">Trap</b>Copying a field value (<code>this.val = a.val</code>) does not keep the other object alive (Fall 2020 Q1b).</div>`
      },
      {
        id: 'encapsulation', title: 'Encapsulation, access modifiers, getters &amp; setters', qlinks: 'encapsulation',
        html: `<p>Encapsulation = make the fields <code>private</code> and expose controlled access through methods. That lets the class enforce its own rules (balance ≥ 0, age not negative, read-only id).</p>
${c(`public class Account {
    private double balance;                 // hidden

    public double getBalance() {            // getter: read access
        return balance;
    }
    public void setBalance(double balance) {// setter: write access with validation
        if (balance >= 0) this.balance = balance;
        else System.out.println("Invalid balance");
    }
}`)}
<div class="table-wrap"><table><tr><th>Modifier</th><th>Same class</th><th>Same package</th><th>Subclass (other package)</th><th>Everywhere</th></tr>
<tr><td><code>private</code></td><td>✅</td><td>❌</td><td>❌</td><td>❌</td></tr>
<tr><td>(default, none)</td><td>✅</td><td>✅</td><td>❌</td><td>❌</td></tr>
<tr><td><code>protected</code></td><td>✅</td><td>✅</td><td>✅</td><td>❌</td></tr>
<tr><td><code>public</code></td><td>✅</td><td>✅</td><td>✅</td><td>✅</td></tr></table></div>
<ul><li><b>Read-only</b> field: a getter only (often plus <code>final</code>). <b>Write-only</b>: a setter only.</li>
<li>Getter for a boolean is usually <code>isX()</code>.</li>
<li>To use a class from another package it must be <code>public</code> and imported, and so must the constructor/method you call.</li>
<li>A sub-package (<code>M1.M2</code>) is a <b>different</b> package. It gets no default access to <code>M1</code>.</li></ul>`
      },
      {
        id: 'overloading', title: 'Method overloading', qlinks: 'overloading',
        html: `<p>Same method name, <b>different parameter lists</b> (number, types, or order of types). The compiler picks the version whose parameters match the arguments.</p>
<ul><li><b>Signature</b> = name + parameter types. Return type and parameter names are not part of it.</li>
<li>Exact match wins. Otherwise Java widens: <code>int → long → float → double</code>; <code>char → int</code>.</li>
<li><code>4.8</code> is a <b>double</b> literal; <code>4.8f</code> is a float; <code>5</code> is an int.</li>
<li>Constructors can be overloaded too, which is the basis of every this() chain question.</li></ul>
<div data-widget="quiz" data-id="q8"></div>`
      },
      {
        id: 'final', title: '<code>final</code>', qlinks: 'final',
        html: `<div class="table-wrap"><table><tr><th>final on…</th><th>Means</th></tr>
<tr><td>local variable / field</td><td>assigned exactly once</td></tr>
<tr><td>reference</td><td>can’t be re-pointed; the <b>object can still change</b></td></tr>
<tr><td>instance field</td><td>must be set by the end of <b>every</b> constructor (or at declaration / in an instance block)</td></tr>
<tr><td>static field</td><td>must be set at declaration or in a static block</td></tr>
<tr><td>method</td><td>can’t be overridden</td></tr>
<tr><td>class</td><td>can’t be extended</td></tr></table></div>
<div data-widget="quiz" data-id="q6"></div>`
      },
      {
        id: 'strings', title: 'String <code>+</code> and printing tricks', qlinks: 'strings',
        html: `<p><code>+</code> is evaluated <b>left to right</b>. While both sides are numbers it adds; once one side is a String, it joins text. A <code>char</code> in arithmetic is its number code ('a' = 97, 'A' = 65, '0' = 48).</p>
<div data-widget="concat"></div>
<ul><li><code>println(obj)</code> calls <code>obj.toString()</code>. Without your own toString you get something like <code>Student@1b6d3586</code>.</li>
<li><code>null</code> joined to a String prints the word <code>null</code>.</li>
<li>doubles print with at least one decimal: <code>5</code> stored in a double prints <code>5.0</code>; <code>3.70</code> prints <code>3.7</code>.</li>
<li><code>print</code> vs <code>println</code>: watch for line breaks in the expected output.</li></ul>
<div data-widget="quiz" data-id="q5"></div>`
      },
      {
        id: 'access', title: 'Packages', qlinks: 'access',
        html: `<p>A package is both a <b>naming</b> mechanism (two classes can share a simple name in different packages) and a <b>visibility</b> mechanism (default-access members are visible only inside their package).</p>
${c(`// File: shop/Item.java
package shop;
public class Item {            // public → usable from other packages
    public Item() { }          // public constructor too!
}

// File: app/Main.java
package app;
import shop.Item;              // or: import shop.*;
public class Main { ... }`)}
<div class="callout trap"><b class="t">Trap</b>A class in another package needs: the class to be <code>public</code>, an <code>import</code>, and a <code>public</code> (or, for subclasses, <code>protected</code>) constructor/method. Missing any one of them is a "find the error" mark.</div>`
      }
    ]
  });

  // ------------------------------------------------------------------ Arrays page
  page('arrays', {
    title: '🔢 Arrays',
    intro: '<p class="muted">Arrays are objects. Once you see them that way, 2D arrays, arrays of objects and "array passed to a method" questions all follow the same rules as the Class &amp; Object chapter.</p>',
    sections: [
      {
        id: 'basics', title: 'Declare, create, initialise', qlinks: 'array-1d',
        html: `${c(`int[] a;                         // declare a reference (no array yet)
a = new int[5];                  // create: 5 ints, all 0
int[] b = {4, 8, 15};            // declare + create + initialise (only in a declaration)
int[] c = new int[]{4, 8, 15};   // anonymous array: works anywhere, e.g. as an argument
double[] d = new double[3];      // {0.0, 0.0, 0.0}
String[] s = new String[2];      // {null, null}`)}
<ul><li>Size is fixed at creation. Valid indexes: <code>0 … a.length - 1</code>. Anything else → <code>ArrayIndexOutOfBoundsException</code> at runtime.</li>
<li><code>a.length</code> is a <b>field</b> (no parentheses). <code>s.length()</code> is a <b>String method</b>.</li>
<li><code>int c[], x;</code> → c is an array, x is an int. <code>int[] c, x;</code> → both are arrays.</li></ul>
<div data-trace="demo-arr"></div>`
      },
      {
        id: 'loops', title: 'for vs for-each',
        html: `<div class="table-wrap"><table><tr><th></th><th><code>for (int i = 0; i &lt; a.length; i++)</code></th><th><code>for (int x : a)</code></th></tr>
<tr><td>Gives you</td><td>the index i (and a[i])</td><td>a <b>copy</b> of each element</td></tr>
<tr><td>Can modify the array?</td><td>✅ <code>a[i] = …</code></td><td>❌ assigning x changes only the copy</td></tr>
<tr><td>Can go backwards / skip?</td><td>✅</td><td>❌ always first → last</td></tr>
<tr><td>Use when</td><td>you need positions, or need to write</td><td>you only read every element (sum, max, search)</td></tr></table></div>
<div class="callout tip"><b class="t">Exam wording</b>"Using enhanced for loop" / "for-each" → you must write <code>for (type x : array)</code>, or you lose the mark even if the logic is right.</div>`
      },
      {
        id: 'methods', title: 'Arrays in methods',
        html: `<p>Passing an array passes a copy of the <b>reference</b>, so a method can change the caller’s array contents (sorting, reversing). Returning an array returns a reference to it.</p>
${c(`static void doubleAll(int[] arr) {      // changes the caller's array
    for (int i = 0; i < arr.length; i++) arr[i] *= 2;
}
static int[] copyOf(int[] arr) {        // returns a NEW array
    int[] c = new int[arr.length];
    for (int i = 0; i < arr.length; i++) c[i] = arr[i];
    return c;
}`)}
<p>See it move: <a href="#/p/p-copy">copy vs alias visualiser</a>, <a href="#/p/p-reverse">reverse in place</a>.</p>`
      },
      {
        id: 'jagged', title: '2D and jagged arrays', qlinks: 'array-2d',
        html: `<p>A 2D array is an <b>array of arrays</b>: the outer array holds references to row arrays. Because each row is its own object, rows can have different lengths. That is called a <b>jagged</b> (ragged) array.</p>
${c(`int[][] m = new int[3][4];          // 3 rows × 4 cols, all 0
int[][] j = new int[3][];           // 3 rows, each row still null
j[0] = new int[2];
j[1] = new int[4];
j[2] = new int[1];

for (int i = 0; i < j.length; i++) {            // rows
    for (int k = 0; k < j[i].length; k++) {     // columns OF THIS ROW
        System.out.print(j[i][k] + " ");
    }
    System.out.println();
}`)}
<div data-widget="quiz" data-id="q7"></div>
<p>The "create the following multidimensional array" question has appeared at least 4 times. Build any picture here:</p>
<div data-widget="jagged"></div>`
      },
      {
        id: 'objects', title: 'Arrays of objects', qlinks: 'array-obj',
        html: `${c(`Student[] list = new Student[3];   // 3 null references, ZERO students
list[0] = new Student("Ana", 3.9); // now one Student exists
list[1].getName();                 // NullPointerException: list[1] is null

Student[] list2 = {                // create + fill in one go
    new Student("Ana", 3.9),
    new Student("Ben", 3.2)
};`)}
<ul><li>An array of objects stores <b>references</b>. Sorting such an array swaps references; the objects don’t move.</li>
<li><b>Heterogeneous array</b>: the declared type is a parent, and the elements are different subclasses. <code>Shape[] s = {new Circle(), new Square()};</code> Calling <code>s[i].draw()</code> runs each object’s own version.</li>
<li>To call a method that exists only in the child, check with <code>instanceof</code> and cast: <code>if (s instanceof Circle) ((Circle) s).radius()</code>.</li></ul>
<p>Practice: <a href="#/p/p-top-student">highest CGPA</a>, <a href="#/p/p-sort-students">sort students</a>, <a href="#/q/252-q1">Seat hall (Summer 2025)</a>.</p>`
      },
      {
        id: 'patterns', title: 'The patterns that solve 90% of array questions',
        html: `<div class="table-wrap"><table><tr><th>Pattern</th><th>Skeleton</th><th>Practice</th></tr>
<tr><td>Accumulate</td><td><code>sum += x</code></td><td><a href="#/p/p-sum-avg">sum/avg</a></td></tr>
<tr><td>Best so far</td><td><code>if (x &gt; max) max = x</code> (start at a[0])</td><td><a href="#/p/p-max-min">max/min</a></td></tr>
<tr><td>Flag</td><td><code>found = true; break;</code> decide after the loop</td><td><a href="#/p/p-linear-search">search</a></td></tr>
<tr><td>Two pointers</td><td><code>i = 0, j = n-1; while (i &lt; j)</code></td><td><a href="#/p/p-reverse">reverse</a>, <a href="#/p/p-palindrome">palindrome</a></td></tr>
<tr><td>Write pointer</td><td><code>arr[k++] = arr[i]</code></td><td><a href="#/p/p-remove-dup">dedupe</a>, <a href="#/p/p-move-zeros">move zeros</a></td></tr>
<tr><td>Nested pairs</td><td><code>for i … for j = i+1 …</code></td><td><a href="#/p/p-two-sum">pairs</a></td></tr>
<tr><td>Swap</td><td><code>t = a[i]; a[i] = a[j]; a[j] = t;</code></td><td><a href="#/p/p-bubble">sorts</a></td></tr>
<tr><td>2D walk</td><td><code>for i &lt; m.length, for j &lt; m[i].length</code></td><td><a href="#/p/p-2d-sum">2D sum</a></td></tr></table></div>`
      }
    ]
  });

  // ------------------------------------------------------------------ cheatsheet
  page('cheatsheet', {
    html: `<p class="muted">Every trap below has actually appeared in a past paper. Read this the night before the exam.</p>
<div class="grid cols-2">
<div class="card"><h3 style="margin-top:0">🔁 Initialization order</h3><ol>
<li>static fields + static blocks (top→bottom, once, on first use; main’s class first)</li>
<li><code>new</code> → defaults (0 / false / null)</li>
<li>follow <code>this(...)</code> to the constructor that doesn’t call this()</li>
<li>field initializers + instance blocks (top→bottom, once per object)</li>
<li>constructor bodies, innermost first, then back out</li></ol></div>
<div class="card"><h3 style="margin-top:0">🧭 References</h3><ul>
<li><code>a = b</code> copies the arrow, never the object</li>
<li>method params are copies: <code>p = new X()</code> ❌ outside; <code>p.f = 1</code> ✅ outside</li>
<li>swap two objects = swap their <b>fields</b></li>
<li>GC-eligible = no arrow from any live variable (stack, static, or a reachable object/array)</li>
<li><code>new X();</code> alone → garbage immediately</li></ul></div>
<div class="card"><h3 style="margin-top:0">📌 static</h3><ul>
<li>one copy per class; <code>obj.staticVar</code> is still that one copy</li>
<li>static method: no <code>this</code>, no instance fields</li>
<li><code>ClassName.method()</code> in main ⇒ method must be static</li>
<li>auto id: <code>static int next = 1001; id = next++;</code></li>
<li>static methods are hidden, chosen by declared type</li></ul></div>
<div class="card"><h3 style="margin-top:0">🏗️ Constructors</h3><ul>
<li>no return type; same name as class</li>
<li>write any constructor → the default one disappears</li>
<li><code>this(...)</code>/<code>super(...)</code> must be the first line</li>
<li><code>x = x</code> in a setter does nothing → <code>this.x = x</code></li>
<li>parameter named like a field shadows it (Sum, Currency, FirstClass)</li>
<li>parent has only a param constructor ⇒ child must call <code>super(args)</code></li></ul></div>
<div class="card"><h3 style="margin-top:0">🔒 Access / final</h3><ul>
<li>private &lt; default (package) &lt; protected &lt; public</li>
<li>other package ⇒ public class + import + public constructor/method</li>
<li>sub-package is a different package</li>
<li>final ref: can’t re-point, can modify the object</li>
<li>final method: no override. final class: no extends</li>
<li>final static: set at declaration or in a static block</li></ul></div>
<div class="card"><h3 style="margin-top:0">🖨️ Printing</h3><ul>
<li><code>"Sum: " + 2 + 3</code> → Sum: 23; <code>"Sum: " + (2+3)</code> → Sum: 5</li>
<li><code>'a' + 2</code> → 99</li>
<li>double prints <code>.0</code>: 5 → 5.0, 3.70 → 3.7</li>
<li><code>4 / 3</code> → 1 (int division); <code>4.0 / 3</code> → 1.333…</li>
<li><code>println(obj)</code> → toString(); null → "null"</li>
<li>copy expected strings exactly (typos and spacing included)</li></ul></div>
<div class="card"><h3 style="margin-top:0">🔢 Arrays</h3><ul>
<li><code>arr.length</code> (field) vs <code>str.length()</code> (method)</li>
<li>indexes 0 … length−1</li>
<li>for-each = read-only copies; needed when the question says "enhanced for"</li>
<li><code>new T[n]</code> for objects = n nulls</li>
<li>jagged: inner loop bound <code>a[i].length</code></li>
<li><code>int c[], x</code> → x is an int</li></ul></div>
<div class="card"><h3 style="margin-top:0">✍️ Exam technique</h3><ul>
<li>For output questions keep a variable table; write each printed line immediately</li>
<li>For "fix the error" list: <i>line → error → why → fix</i></li>
<li>If the paper’s expected output contradicts its description, follow the code you write, and add one line noting the mismatch</li>
<li>Getter/setter/constructor questions are free marks: practise until they take 2 minutes</li></ul></div>
</div>
<h2>Try the + evaluator</h2><div data-widget="concat"></div>`
  });
})();
