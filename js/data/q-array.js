// Arrays: every array question from the past mids, with traces.
(function () {
  const { Q, code } = OOP;
  const S = (l, n, ...o) => ({ l, n, o });

  // ---- helper to generate a for-each scan trace over an int array ----
  function scanSteps(arr, opts) {
    // opts: {init:[name,val], body(x, st) -> {ops, note, lines}, after}
    const steps = [];
    steps.push(S(opts.arrLine, 'The array object is created on the heap; arr holds a reference to it.', ['call', 'main()'], ['arr', 'A', 'int', arr.map(String)], ['v', 'arr', '@A']));
    if (opts.init) steps.push(S(opts.init.line, opts.init.note, ['v', opts.init.name, String(opts.init.val)]));
    for (let i = 0; i < arr.length; i++) {
      const r = opts.body(arr[i], i, steps);
      if (r === 'stop') break;
    }
    return steps;
  }

  // ======================= Fall 2018 Q1(a): min with for-each =======================
  (function () {
    const arr = [2, 3, 9, 8, 13, 1, 5, 19, 15];
    let min = arr[0];
    const steps = scanSteps(arr, {
      arrLine: 'int[] arr = {',
      init: { line: 'int min = arr[0];', note: 'Start with the first element as the current minimum (never start with 0, because every element might be bigger than 0).', name: 'min', val: min },
      body(x, i, st) {
        st.push(S('for (int x : arr) {', 'for-each copies element [' + i + '] into x.', ['v', 'x', String(x)], ['ptr', 'A', 'x', i]));
        if (x < min) {
          min = x;
          st.push(S('min = x;', x + ' is smaller → new minimum.', ['v', 'min', String(min)], ['mark', 'A', i, 'hl2']));
        } else {
          st.push(S('if (x < min) {', x + ' < ' + min + '? No → skip.'));
        }
      }
    });
    steps.push(S('System.out.println("Minimum: " + min);', 'Loop finished.', ['ptr', 'A', 'x', null], ['vd', 'x'], ['p', 'Minimum: ' + min]));
    Q({
      id: '183-q1a', paper: '183', qno: '1(a)', marks: 2, topic: 'array', sub: ['array-1d'], type: 'code',
      title: 'Find the minimum with an enhanced for loop',
      prompt: '<p>Write a Java program that goes through the items of an array and finds the <b>min</b> value using an <b>enhanced for loop</b>. Initial values: {2, 3, 9, 8, 13, 1, 5, 19, 15}.</p>',
      answer: {
        code: code`
public class FindMin {
    public static void main(String[] args) {
        int[] arr = {2, 3, 9, 8, 13, 1, 5, 19, 15};
        int min = arr[0];
        for (int x : arr) {
            if (x < min) {
                min = x;
            }
        }
        System.out.println("Minimum: " + min);
    }
}`,
        output: 'Minimum: 1'
      },
      tips: ['For max, flip the comparison: <code>if (x &gt; max)</code>.', 'An enhanced for gives you a <b>copy</b> of each element. You can read it, but assigning to x doesn’t change the array, and you don’t get the index.'],
      trace: { code: code`
public class FindMin {
    public static void main(String[] args) {
        int[] arr = {2, 3, 9, 8, 13, 1, 5, 19, 15};
        int min = arr[0];
        for (int x : arr) {
            if (x < min) {
                min = x;
            }
        }
        System.out.println("Minimum: " + min);
    }
}`, steps }
    });
  })();

  // ======================= Summer 2019 Q3(b): sum with for-each =======================
  (function () {
    const arr = [1, 3, 4, 8, 2, 7, 5, 9, 6];
    let sum = 0;
    const steps = scanSteps(arr, {
      arrLine: 'int[] arr = {',
      init: { line: 'int sum = 0;', note: 'Accumulator starts at 0.', name: 'sum', val: 0 },
      body(x, i, st) {
        st.push(S('for (int x : arr) {', 'x = arr[' + i + '] = ' + x, ['v', 'x', String(x)], ['ptr', 'A', 'x', i]));
        sum += x;
        st.push(S('sum += x;', 'sum = ' + (sum - x) + ' + ' + x + ' = ' + sum, ['v', 'sum', String(sum)], ['mark', 'A', i, 'done']));
      }
    });
    steps.push(S('System.out.println("Sum: " + sum);', '', ['ptr', 'A', 'x', null], ['vd', 'x'], ['p', 'Sum: ' + sum]));
    const src = code`
public class SumArray {
    public static void main(String[] args) {
        int[] arr = {1, 3, 4, 8, 2, 7, 5, 9, 6};
        int sum = 0;
        for (int x : arr) {
            sum += x;
        }
        System.out.println("Sum: " + sum);
    }
}`;
    Q({
      id: '192-q3b', paper: '192', qno: '3(b)', marks: 2, topic: 'array', sub: ['array-1d'], type: 'code',
      title: 'Sum of an array with an enhanced for loop',
      prompt: '<p>Write a Java program that goes through an array and finds the sum of its values using an <b>enhanced for loop</b>. Initial values: {1, 3, 4, 8, 2, 7, 5, 9, 6}.</p>',
      answer: { code: src, output: 'Sum: 45' },
      tips: ['Average = <code>(double) sum / arr.length</code>. Cast before dividing, or integer division drops the decimals.'],
      trace: { code: src, steps }
    });
  })();

  // ======================= Fall 2019 Q5(b): search =======================
  (function () {
    const src = code`
public class Search {
    public static void main(String[] args) {
        int[] arr = {1, 3, 2, 4, 1, 10, 19, 20, 5};
        int key = 12;
        boolean found = false;
        for (int x : arr) {
            if (x == key) {
                found = true;
                break;
            }
        }
        if (found) System.out.println("Found");
        else System.out.println("Not found");
    }
}`;
    const arr = [1, 3, 2, 4, 1, 10, 19, 20, 5];
    const steps = [S('int[] arr = {', '', ['call', 'main()'], ['arr', 'A', 'int', arr.map(String)], ['v', 'arr', '@A']), S('int key = 12;', 'Try changing this to 1 in your head: the loop would stop at index 0.', ['v', 'key', '12']), S('boolean found = false;', 'A flag: assume "not found" until proven otherwise.', ['v', 'found', 'false'])];
    arr.forEach((x, i) => {
      steps.push(S('for (int x : arr) {', '', ['v', 'x', String(x)], ['ptr', 'A', 'x', i]));
      steps.push(S('if (x == key) {', x + ' == 12? No.', ['mark', 'A', i, 'done']));
    });
    steps.push(S('else System.out.println("Not found");', 'The loop ended without finding 12, so found is still false.', ['ptr', 'A', 'x', null], ['vd', 'x'], ['p', 'Not found']));
    Q({
      id: '193-q5b', paper: '193', qno: '5(b)', marks: 2, topic: 'array', sub: ['array-1d'], type: 'code',
      title: 'Check if an item is in the array (for-each + flag)',
      prompt: '<p>Write a program that goes through a 1D array and checks whether a particular item is in it using an <b>enhanced for loop</b>. Array: {1, 3, 2, 4, 1, 10, 19, 20, 5}. Sample: 1 → Found; 12 → Not found.</p>',
      answer: { code: src, output: 'Not found', html: '<p>With <code>key = 1</code> it prints <b>Found</b>.</p>' },
      traps: ['Don’t print "Not found" inside the loop. That prints once for every element that doesn’t match. Decide <b>after</b> the loop using a boolean flag.'],
      trace: { code: src, steps }
    });
  })();

  // ======================= Fall 2020 Q2(b): double array sum < 10, length =======================
  (function () {
    const src = code`
public class DoubleArray {
    public static void main(String[] args) {
        double[] nums = {2.5, 12.0, 7.5, 15.25, 9.9, 3.1, 20.0, 1.0};
        double sum = 0;
        for (double d : nums) {
            if (d < 10.0) {
                sum += d;
            }
        }
        System.out.println("Sum of elements < 10: " + sum);
        System.out.println("Size: " + nums.length);
    }
}`;
    const arr = ['2.5', '12.0', '7.5', '15.25', '9.9', '3.1', '20.0', '1.0'];
    const steps = [S('double[] nums = {', 'Initialised during declaration (an array initializer).', ['call', 'main()'], ['arr', 'A', 'double', arr], ['v', 'nums', '@A']), S('double sum = 0;', '', ['v', 'sum', '0.0'])];
    const sums = ['2.5', null, '10.0', null, '19.9', '23.0', null, '24.0'];
    arr.forEach((x, i) => {
      steps.push(S('for (double d : nums) {', '', ['v', 'd', x], ['ptr', 'A', 'd', i]));
      if (sums[i]) steps.push(S('sum += d;', x + ' < 10.0 → add', ['v', 'sum', sums[i]], ['mark', 'A', i, 'done']));
      else steps.push(S('if (d < 10.0) {', x + ' is not less than 10.0 → skip'));
    });
    steps.push(S('System.out.println("Sum of elements', '', ['ptr', 'A', 'd', null], ['vd', 'd'], ['p', 'Sum of elements < 10: 24.0']));
    steps.push(S('System.out.println("Size: " + nums.length);', '<code>length</code> is a field (no parentheses) of every array.', ['p', 'Size: 8']));
    Q({
      id: '203-q2b', paper: '203', qno: '2(b)', marks: 4, topic: 'array', sub: ['array-1d'], type: 'code',
      title: 'double array: sum of elements < 10.0 and print size',
      prompt: '<p>I. Create a double array with at least 8 elements, initialized during declaration. II. Print the sum of the elements less than 10.0 using a for-each loop. III. Print the size of the array using the array reference variable.</p>',
      answer: { code: src, output: 'Sum of elements < 10: 24.0\nSize: 8' },
      traps: ['<code>arr.length</code> (field, no parentheses) for arrays; <code>str.length()</code> (method) for Strings.'],
      trace: { code: src, steps }
    });
  })();

  // ======================= Fall 2017 Q4(a) / Fall 2018 Q1(b) =======================
  Q({
    id: '183-q1b', paper: '183', qno: '1(b)', marks: 1, topic: 'array', sub: ['array-1d'], type: 'theory',
    title: 'int c[], x  vs  int[] c, x',
    prompt: '<p>What is the difference between these two declarations? (Also asked in Fall 2017 Q4(a).)</p><p>i. <code>int c[], x</code> &nbsp;&nbsp; ii. <code>int[] c, x</code></p>',
    answer: {
      html: `<table><tr><th>Declaration</th><th>c</th><th>x</th></tr>
<tr><td><code>int c[], x;</code></td><td>int array</td><td><b>plain int</b></td></tr>
<tr><td><code>int[] c, x;</code></td><td>int array</td><td><b>int array</b></td></tr></table>
<p>When <code>[]</code> is written after the <b>type</b>, it applies to every variable on the line. When it is written after a <b>name</b>, it applies to that variable only.</p>`
    },
    tips: ['Always write <code>int[] a</code> (brackets on the type). It is clearer and is the Java style.']
  });

  // ======================= Jagged int arrays =======================
  function jaggedQ(id, paper, qno, marks, rows, start, sameAs) {
    const total = rows.reduce((a, b) => a + b, 0);
    const lit = 'int[][] a = {\n' + rows.map((n, i) => '    {' + Array.from({ length: n }, (_, j) => start + rows.slice(0, i).reduce((x, y) => x + y, 0) + j).join(', ') + '}').join(',\n') + '\n};';
    const isUp = rows[0] < rows[rows.length - 1];
    const src = code`
public class Jagged {
    public static void main(String[] args) {
        int[][] a = new int[4][];
        int value = ${String(start)};
        for (int i = 0; i < a.length; i++) {
            a[i] = new int[${isUp ? 'i + 1' : '4 - i'}];
            for (int j = 0; j < a[i].length; j++) {
                a[i][j] = value++;
            }
        }
        for (int[] row : a) {
            for (int x : row) System.out.print(x + " ");
            System.out.println();
        }
    }
}`;
    const steps = [S('int[][] a = new int[4][];', 'Only the number of rows is fixed. Each row reference starts as <b>null</b>; rows don’t exist yet.', ['call', 'main()'], ['arr2', 'G', 'int', rows.map(() => null)], ['v', 'a', '@G']), S('int value = ', '', ['v', 'value', String(start)])];
    let v = start;
    rows.forEach((n, i) => {
      steps.push(S('for (int i = 0; i < a.length; i++) {', 'Row ' + i, ['v', 'i', String(i)], ['ptr', 'G', 'i', i]));
      steps.push(S('a[i] = new int[', 'Create row ' + i + ' with ' + n + ' cell(s), filled with 0.', ['f', 'G', i, Array(n).fill('0')]));
      for (let j = 0; j < n; j++) {
        steps.push(S('a[i][j] = value++;', 'a[' + i + '][' + j + '] = ' + v + ', then value becomes ' + (v + 1), ['v', 'j', String(j)], ['ptr', 'G', 'j', [i, j]], ['f', 'G', [i, j], String(v)], ['v', 'value', String(v + 1)]));
        v++;
      }
      steps.push(S('for (int j = 0; j < a[i].length; j++) {', 'j reached a[' + i + '].length = ' + n + ' → inner loop ends.', ['vd', 'j'], ['ptr', 'G', 'j', null]));
    });
    let start2 = start;
    rows.forEach(n => {
      steps.push(S('for (int x : row) System.out.print(x + " ");', 'Print one row.', ['ptr', 'G', 'i', null], ['vd', 'i'], ['pr', Array.from({ length: n }, (_, j) => (start2 + j) + ' ').join('')]));
      steps.push(S('System.out.println();', '', ['p', '']));
      start2 += n;
    });
    Q({
      id, paper, qno, marks, topic: 'array', sub: ['array-2d'], type: 'code',
      title: 'Create the jagged array ' + (isUp ? 'triangle 0…' + (start + total - 1) : 'staircase 1…' + (start + total - 1)),
      prompt: '<p>Write a code fragment to create this multidimensional integer array' + (sameAs ? ' (the same picture was asked in ' + sameAs + ')' : '') + ':</p>' +
        '<div class="grid2" style="padding:6px 0">' + rows.map((n, i) => '<div class="r"><div class="cells" style="padding:0">' + Array.from({ length: n }, (_, j) => '<div class="cell"><div class="bx">' + (start + rows.slice(0, i).reduce((x, y) => x + y, 0) + j) + '</div></div>').join('') + '</div></div>').join('') + '</div>',
      answer: {
        codeTitle: 'Answer (either way gets full marks)',
        code: '// Way 1: initializer list\n' + lit + '\n\n// Way 2: allocate each row, then fill\n' + src.split('\n').slice(3, 11).map(l => l.replace(/^ {8}/, '')).join('\n'),
        output: rows.map((n, i) => Array.from({ length: n }, (_, j) => start + rows.slice(0, i).reduce((x, y) => x + y, 0) + j).join(' ') + ' ').join('\n'),
        html: '<p>Each row is a <b>separate array object</b>, so rows can have different lengths. <code>a.length</code> is the number of rows (4); <code>a[i].length</code> is the length of row i.</p><p>Build any shape in the <a href="#/learn/arrays/jagged">jagged array builder</a>.</p>'
      },
      traps: ['The inner loop must use <code>a[i].length</code>. Using <code>a.length</code> crashes with ArrayIndexOutOfBoundsException on a short row.', '<code>new int[4][]</code> is legal (rows later). <code>new int[][4]</code> is not.'],
      trace: { code: src, steps }
    });
  }
  jaggedQ('173-q6a', '173', '6(a)', 2, [1, 2, 3, 4], 0, 'Fall 2018 Q1(c)');
  jaggedQ('182-q1a', '182', '1(a)', 2, [4, 3, 2, 1], 1, 'Summer 2019 Q3(a)');

  // ======================= Summer 2020 Q2(C): Student array =======================
  (function () {
    const src = code`
class Student {
    String name;
    double cgpa;
    public Student(String name, double cgpa) {
        this.name = name;
        this.cgpa = cgpa;
    }
}
class Test {
    public static void main(String[] args) {
        Student[] students = {
            new Student("Bashar", 3.78),
            new Student("Khaled", 3.66),
            new Student("Rafiq", 3.7)
        };
        for (Student student : students) {
            System.out.println(student.name + " " + student.cgpa);
        }
    }
}`;
    const names = [['Bashar', '3.78'], ['Khaled', '3.66'], ['Rafiq', '3.7']];
    const steps = [S('public static void main', '', ['call', 'main()'])];
    names.forEach(([n, c], i) => steps.push(S('new Student("' + n + '"', 'Each element expression creates a Student object.', ['new', 's' + i, 'Student', { name: '"' + n + '"', cgpa: c }])));
    steps.push(S('Student[] students = {', 'The array itself is ONE more object holding 3 references.', ['arr', 'A', 'Student', ['@s0', '@s1', '@s2']], ['v', 'students', '@A']));
    names.forEach(([n, c], i) => {
      steps.push(S('for (Student student : students) {', 'student = students[' + i + '] (a reference copy)', ['v', 'student', '@s' + i], ['ptr', 'A', 'student', i]));
      steps.push(S('System.out.println(student.name', '', ['p', n + ' ' + c]));
    });
    Q({
      id: '202-q2c', paper: '202', qno: '2(C)', marks: 2, topic: 'array', sub: ['array-obj'], type: 'code',
      title: 'Create a Student array named students',
      prompt: '<p>Create a student array named <code>students</code> so the code prints the output. You can’t remove lines.</p>',
      given: code`
class Student {
    String name;
    double cgpa;
    public Student(String name, double cgpa) {
        this.name = name;
        this.cgpa = cgpa;
    }
}
class Test {
    public static void main(String[] args) {
        /*
            Your code here
        */
        for (Student student : students) {
            System.out.println(student.name + " " + student.cgpa);
        }
    }
}`,
      givenOut: 'Bashar 3.78\nKhaled 3.66\nRafiq 3.7',
      answer: {
        code: code`
Student[] students = {
    new Student("Bashar", 3.78),
    new Student("Khaled", 3.66),
    new Student("Rafiq", 3.7)
};

// or, equivalently:
Student[] students = new Student[3];
students[0] = new Student("Bashar", 3.78);
students[1] = new Student("Khaled", 3.66);
students[2] = new Student("Rafiq", 3.7);`,
        output: 'Bashar 3.78\nKhaled 3.66\nRafiq 3.7'
      },
      traps: ['<code>3.70</code> prints as <code>3.7</code>: a double drops trailing zeros.'],
      trace: { code: src, steps }
    });
  })();

  // ======================= Fall 2020 Q1(a): School with Student[] =======================
  (function () {
    const src = code`
class Student {
    String name;
    float cgpa;
    Student(String name, float cgpa) {
        this.name = name;
        this.cgpa = cgpa;
    }
}
class School {
    Student[] students;
    School() {
        students = new Student[3];
    }
    void addStudent(int id, String name, float cgpa) {
        students[id] = new Student(name, cgpa);
    }
    void updateStudent(int id, float new_cgpa) {
        students[id].cgpa = new_cgpa;
    }
    void printStudentDetail(int id) {
        System.out.println(students[id].name + " " + students[id].cgpa);
    }
}
public class SchoolDemo {
    public static void main(String[] args) {
        School school = new School();
        school.addStudent(0, "Alice", 3.5f);
        school.addStudent(1, "Bob", 3.7f);
        school.addStudent(2, "Trudy", 3.2f);
        school.printStudentDetail(0);
        school.updateStudent(0, 3.7f);
        school.printStudentDetail(0);
    }
}`;
    const steps = [
      S('School school = new School();', '', ['call', 'main()'], ['new', 'sc', 'School', { students: 'null' }], ['call', 'School()', { this: '@sc' }]),
      S('students = new Student[3];', 'An array of 3 Student references, all null. No Student objects yet!', ['arr', 'A', 'Student', ['null', 'null', 'null']], ['f', 'sc', 'students', '@A']),
      S('School school = new School();', '', ['ret'], ['v', 'school', '@sc'])
    ];
    [['Alice', '3.5'], ['Bob', '3.7'], ['Trudy', '3.2']].forEach(([n, c], i) => {
      steps.push(S('school.addStudent(' + i, '', ['call', 'addStudent(int id, String name, float cgpa)', { this: '@sc', id: String(i), name: '"' + n + '"', cgpa: c }]));
      steps.push(S('students[id] = new Student(name, cgpa);', 'Create the Student and store its reference in slot ' + i + '.', ['new', 'st' + i, 'Student', { name: '"' + n + '"', cgpa: c }], ['f', 'A', i, '@st' + i], ['ret']));
    });
    steps.push(S('school.printStudentDetail(0);@1', '', ['call', 'printStudentDetail(int id)', { this: '@sc', id: '0' }], ['ptr', 'A', 'id', 0]));
    steps.push(S('System.out.println(students[id].name', 'students[0] → Alice', ['p', 'Alice 3.5'], ['ret'], ['ptr', 'A', 'id', null]));
    steps.push(S('school.updateStudent(0, 3.7f);', '', ['call', 'updateStudent(int id, float new_cgpa)', { this: '@sc', id: '0', new_cgpa: '3.7' }], ['ptr', 'A', 'id', 0]));
    steps.push(S('students[id].cgpa = new_cgpa;', 'Follow the reference in slot 0 and change that object.', ['f', 'st0', 'cgpa', '3.7'], ['ret']));
    steps.push(S('school.printStudentDetail(0);@2', '', ['call', 'printStudentDetail(int id)', { this: '@sc', id: '0' }]));
    steps.push(S('System.out.println(students[id].name', '', ['p', 'Alice 3.7'], ['ret'], ['ptr', 'A', 'id', null]));
    Q({
      id: '203-q1a', paper: '203', qno: '1(a)', marks: 3, topic: 'array', sub: ['array-obj', 'class-basics'], type: 'code',
      title: 'School: create Student, complete updateStudent / printStudentDetail',
      prompt: '<p>I. Create the class Student so the code works without errors (you can’t modify the given code). II. Complete <code>updateStudent(int id, float new_cgpa)</code> and <code>printStudentDetail(int id)</code> so the code produces the output.</p>',
      given: code`
class School {
    Student[] students;
    School() {
        students = new Student[3];
    }
    void addStudent(int id, String name, float cgpa) {
        students[id] = new Student(name, cgpa);
    }
    void updateStudent(int id, float new_cgpa) {
        // Complete this method
    }
    void printStudentDetail(int id) {
        // Complete this method
    }
}
public class SchoolDemo {
    public static void main(String[] args) {
        School school = new School();
        school.addStudent(0, "Alice", 3.5f);
        school.addStudent(1, "Bob", 3.7f);
        school.addStudent(2, "Trudy", 3.2f);
        school.printStudentDetail(0);
        school.updateStudent(0, 3.7f);
        school.printStudentDetail(0);
    }
}`,
      givenOut: 'Alice 3.5\nAlice 3.7',
      answer: {
        code: code`
class Student {
    String name;
    float cgpa;
    Student(String name, float cgpa) {
        this.name = name;
        this.cgpa = cgpa;
    }
}

void updateStudent(int id, float new_cgpa) {
    students[id].cgpa = new_cgpa;
}
void printStudentDetail(int id) {
    System.out.println(students[id].name + " " + students[id].cgpa);
}`,
        output: 'Alice 3.5\nAlice 3.7',
        html: '<p>The constructor must accept <code>(String, float)</code>, because that is how addStudent calls it. The id is used directly as the array index.</p>'
      },
      traps: ['<code>new Student[3]</code> creates the slots, not the students. Calling <code>students[0].cgpa</code> before addStudent would throw NullPointerException.'],
      trace: { code: src, steps }
    });
  })();

  // ======================= Summer 2021 Q3 =======================
  Q({
    id: '212-q3', paper: '212', qno: '3', marks: 4, topic: 'array', sub: ['array-obj'], type: 'code',
    title: 'DiscountedItem[]: getPrice() and total sales',
    prompt: '<p>a. Complete <code>getPrice()</code> in DiscountedItem: return the discounted price using price and discount (a percentage). b. Initialize the array <code>items</code> in main with DiscountedItem objects and use it to calculate the total sales value.</p>',
    given: code`
class Item {
    String name;
    double price;
    public double getPrice() {
        return price;
    }
}
class DiscountedItem extends Item {
    double discount;
    DiscountedItem(String name, double price, double discount) {
        this.name = name;
        this.price = price;
        this.discount = discount;
    }
    public double getPrice() {
        // Code 1: Calculate and return the discounted price
    }
}
class Shop {
    public static void main(String[] args) {
        Item[] items = new Item[5];
        // Code 2: Initialize items array and calculate the total price
    }
}`,
    answer: {
      code: code`
// Code 1
public double getPrice() {
    return price - price * discount / 100;
}

// Code 2
items[0] = new DiscountedItem("Pen", 100, 5);
items[1] = new DiscountedItem("Bag", 1500, 10);
items[2] = new DiscountedItem("Shoe", 2000, 20);
items[3] = new DiscountedItem("Cap", 400, 0);
items[4] = new DiscountedItem("Book", 600, 50);
double total = 0;
for (Item it : items) {
    total += it.getPrice();     // DiscountedItem's version runs
}
System.out.println("Total sales: " + total);`,
      output: 'Total sales: 3745.0',
      html: '<p>95 + 1350 + 1600 + 400 + 300 = 3745.0. The array is declared as <code>Item[]</code> but holds DiscountedItem objects. <code>it.getPrice()</code> calls the <b>object’s</b> version (DiscountedItem), so the discount is applied.</p>'
    },
    traps: ['<code>price * (discount / 100)</code> is fine for doubles, but if discount were an <b>int</b>, <code>discount / 100</code> would be 0. Multiply first: <code>price * discount / 100</code>.']
  });

  // ======================= Fall 2021 Q6 =======================
  (function () {
    const src = code`
public class Mid {
    public static double calculateTotalPrice(Item[] items) {
        double total = 0.0;
        for (Item item : items) {
            total += item.calculatePrice();
        }
        return total;
    }
    public static void main(String[] args) {
        Item[] items = new Item[3];
        items[0] = new WeightedItem("Rice", 10.0, 70.0);
        items[1] = new CountableItem("Egg", 12, 11.0);
        items[2] = new WeightedItem("Chicken", 0.7, 250.0);
        System.out.println("Total Price: " + calculateTotalPrice(items));
    }
}`;
    const steps = [
      S('Item[] items = new Item[3];', '', ['call', 'main()'], ['arr', 'A', 'Item', ['null', 'null', 'null']], ['v', 'items', '@A']),
      S('items[0] = new WeightedItem', '', ['new', 'r', 'WeightedItem', { name: '"Rice"', unit_price: '70.0', weight: '10.0' }], ['f', 'A', 0, '@r']),
      S('items[1] = new CountableItem', '', ['new', 'e', 'CountableItem', { name: '"Egg"', unit_price: '11.0', quantity: '12' }], ['f', 'A', 1, '@e']),
      S('items[2] = new WeightedItem', '', ['new', 'c', 'WeightedItem', { name: '"Chicken"', unit_price: '250.0', weight: '0.7' }], ['f', 'A', 2, '@c']),
      S('public static double calculateTotalPrice', 'The method receives a copy of the array reference: the same array.', ['call', 'calculateTotalPrice(Item[] items)', { items: '@A' }]),
      S('double total = 0.0;', '', ['v', 'total', '0.0']),
      S('for (Item item : items) {', '', ['v', 'item', '@r'], ['ptr', 'A', 'item', 0]),
      S('total += item.calculatePrice();', 'WeightedItem: 10.0 × 70.0 = 700.0', ['v', 'total', '700.0']),
      S('for (Item item : items) {', '', ['v', 'item', '@e'], ['ptr', 'A', 'item', 1]),
      S('total += item.calculatePrice();', 'CountableItem: 12 × 11.0 = 132.0', ['v', 'total', '832.0']),
      S('for (Item item : items) {', '', ['v', 'item', '@c'], ['ptr', 'A', 'item', 2]),
      S('total += item.calculatePrice();', 'WeightedItem: 0.7 × 250.0 = 175.0', ['v', 'total', '1007.0']),
      S('return total;', '', ['ptr', 'A', 'item', null]),
      S('System.out.println("Total Price: "', '', ['ret'], ['p', 'Total Price: 1007.0'])
    ];
    Q({
      id: '213-q6', paper: '213', qno: '6', marks: 5, topic: 'array', sub: ['array-obj'], type: 'code',
      title: 'WeightedItem / CountableItem + calculateTotalPrice(Item[])',
      prompt: '<p>Abstract class Item has name, unit_price and <code>abstract double calculatePrice()</code>. a. Write WeightedItem (field weight; constructor (name, weight, unit_price); price = weight × unit_price). b. Write CountableItem (field quantity; constructor (name, quantity, unit_price); price = quantity × unit_price). c. Complete <code>calculateTotalPrice(Item[] items)</code> with a for-each loop. main should print 1007.0.</p>',
      answer: {
        code: code`
class WeightedItem extends Item {
    double weight;
    WeightedItem(String name, double weight, double unit_price) {
        super(name, unit_price);           // note the parameter ORDER
        this.weight = weight;
    }
    double calculatePrice() {
        return weight * unit_price;
    }
}
class CountableItem extends Item {
    int quantity;
    CountableItem(String name, int quantity, double unit_price) {
        super(name, unit_price);
        this.quantity = quantity;
    }
    double calculatePrice() {
        return quantity * unit_price;
    }
}
// in class Mid:
public static double calculateTotalPrice(Item[] items) {
    double total = 0.0;
    for (Item item : items) {
        total += item.calculatePrice();
    }
    return total;
}`,
        output: 'Total Price: 1007.0'
      },
      traps: ['The constructor’s parameter order is (name, <b>weight</b>, unit_price), but Item’s constructor is (name, unit_price). Pass them in the right order to <code>super</code>.'],
      trace: { code: src, steps }
    });
  })();

  // ======================= Spring 2023 Q3 =======================
  (function () {
    const src = code`
class AdvancedCalculator extends Calculator {
    int[] numbers;
    AdvancedCalculator(int a, int b, int[] numbers) {
        super(a, b);
        this.numbers = numbers;
    }
    @Override
    public int subtract() {
        System.out.print("Subtraction result: ");
        return super.subtract();
    }
    @Override
    public int sum() {
        int total = super.sum();
        for (int n : numbers) {
            total += n;
        }
        System.out.print("Summation result: ");
        return total;
    }
}
public class main {
    public static void main(String[] args) {
        AdvancedCalculator c = new AdvancedCalculator(1, 2, new int[]{3, 4, 5});
        System.out.println(c.subtract());
        System.out.println(c.sum());
    }
}`;
    const steps = [
      S('AdvancedCalculator c = new AdvancedCalculator(1, 2, new int[]{3, 4, 5});', '<code>new int[]{3, 4, 5}</code> is an anonymous array created right in the argument list.', ['call', 'main()'], ['arr', 'N', 'int', ['3', '4', '5']], ['new', 'c', 'AdvancedCalculator', { a: '0', b: '0', numbers: 'null' }], ['call', 'AdvancedCalculator(int a, int b, int[] numbers)', { this: '@c', a: '1', b: '2', numbers: '@N' }]),
      S('super(a, b);', 'Parent constructor sets a and b.', ['f', 'c', 'a', '1'], ['f', 'c', 'b', '2']),
      S('this.numbers = numbers;', 'The field now references the same array.', ['f', 'c', 'numbers', '@N']),
      S('AdvancedCalculator c = new', '', ['ret'], ['v', 'c', '@c']),
      S('System.out.print("Subtraction result: ");', 'print (no newline) first…', ['call', 'subtract()', { this: '@c' }], ['pr', 'Subtraction result: ']),
      S('return super.subtract();', '…then return 1 − 2 = −1, which main’s println puts right after the label.', ['ret'], ['p', '-1']),
      S('int total = super.sum();', 'Parent sum: 1 + 2 = 3', ['call', 'sum()', { this: '@c' }], ['v', 'total', '3']),
      S('for (int n : numbers) {', '', ['v', 'n', '3'], ['ptr', 'N', 'n', 0]), S('total += n;', '', ['v', 'total', '6']),
      S('for (int n : numbers) {', '', ['v', 'n', '4'], ['ptr', 'N', 'n', 1]), S('total += n;', '', ['v', 'total', '10']),
      S('for (int n : numbers) {', '', ['v', 'n', '5'], ['ptr', 'N', 'n', 2]), S('total += n;', '', ['v', 'total', '15']),
      S('System.out.print("Summation result: ");', '', ['vd', 'n'], ['ptr', 'N', 'n', null], ['pr', 'Summation result: ']),
      S('return total;', '', ['ret'], ['p', '15'])
    ];
    Q({
      id: '231-q3', paper: '231', qno: '3', marks: 6, topic: 'array', sub: ['array-1d', 'constructors'], type: 'code',
      title: 'AdvancedCalculator with an int[] numbers field',
      prompt: '<p>Calculator has <code>a</code>, <code>b</code>, <code>sum()</code>, <code>subtract()</code>. Write AdvancedCalculator (a child of Calculator) whose constructor uses <code>this</code> to set an <code>int[] numbers</code> attribute, and which overrides <code>sum()</code>: use <code>super.sum()</code> for the first two numbers, then add every element of numbers.</p>',
      given: code`
public class main {
    public static void main(String[] args) {
        AdvancedCalculator c = new AdvancedCalculator(1, 2, new int[]{3, 4, 5});
        System.out.println(c.subtract());
        System.out.println(c.sum());
    }
}`,
      givenOut: 'Subtraction result: -1\nSummation result: 15',
      answer: {
        code: src.split('public class main')[0].trim(),
        output: 'Subtraction result: -1\nSummation result: 15',
        html: '<p>main only does <code>println(c.subtract())</code>, yet the output has labels. The trick: the overriding methods <code>print</code> (not println) the label and then <b>return</b> the number, and main’s println finishes the line. 1 + 2 + 3 + 4 + 5 = 15.</p>'
      },
      tips: ['Iterate an array field with for-each: <code>for (int n : numbers) total += n;</code>'],
      trace: { code: src, steps }
    });
  })();

  // ======================= Spring 2023 Q6 =======================
  Q({
    id: '231-q6', paper: '231', qno: '6', marks: 6, topic: 'array', sub: ['array-obj'], type: 'code',
    title: 'Cake[]: OrderCake & ReadymadeCake with calcPrice / printDetails',
    prompt: '<p>a. Override <code>calcPrice()</code> (OrderCake: rate × weight; ReadymadeCake: rate × quantity) and <code>printDetails()</code> (Name / Rate / Weight-or-Quantity / Total Price) in both subclasses. b. In main, create an array of three cakes: two OrderCake and one ReadymadeCake, and print them using the given loop.</p>',
    given: code`
public class Cake {
    protected String name;
    protected double rate;
    public Cake(String n, double r) {
        name = n;
        rate = r;
    }
    public double calcPrice() {
        System.out.println("Print the calculated price.");
    }
    public printDetails() {
        System.out.println("Prints the detail.");
    }
}
class OrderCake extends Cake {
    double weight;
    public OrderCake(String n, double r, double w) {
        super(n, r);
        weight = w;
    }
    //override calcPrice & printDetails
}
class ReadymadeCake extends Cake {
    int quantity;
    public ReadymadeCake(String n, double r, int q) {
        super(n, r);
        quantity = q;
    }
    //override calcPrice & printDetails
}
class Main {
    public static void main(String[] args) {
        Cake cake[];
        // Complete the code
        for (int i = 0; i < cake.length; i++) {
            cake[i].printDetails();
        }
    }
}`,
    answer: {
      code: code`
// (Base class bugs: calcPrice must return a double, and printDetails needs "void".)
public double calcPrice() { return 0; }
public void printDetails() { System.out.println("Prints the detail."); }

// OrderCake
@Override
public double calcPrice() { return rate * weight; }
@Override
public void printDetails() {
    System.out.println("Name: " + name);
    System.out.println("Rate: " + rate);
    System.out.println("Weight: " + weight);
    System.out.println("Total Price: " + calcPrice());
}

// ReadymadeCake
@Override
public double calcPrice() { return rate * quantity; }
@Override
public void printDetails() {
    System.out.println("Name: " + name);
    System.out.println("Rate: " + rate);
    System.out.println("Quantity: " + quantity);
    System.out.println("Total Price: " + calcPrice());
}

// main
Cake cake[];
cake = new Cake[3];
cake[0] = new OrderCake("OrderCake", 150, 3);
cake[1] = new OrderCake("OrderCake", 120, 2.5);
cake[2] = new ReadymadeCake("ReadymadeCake", 200, 2);
for (int i = 0; i < cake.length; i++) {
    cake[i].printDetails();
}`,
      output: `Name: OrderCake
Rate: 150.0
Weight: 3.0
Total Price: 450.0
Name: OrderCake
Rate: 120.0
Weight: 2.5
Total Price: 300.0
Name: ReadymadeCake
Rate: 200.0
Quantity: 2
Total Price: 400.0`,
      html: '<p>The paper’s sample shows "Rate: 150". Because rate is a <code>double</code>, Java really prints 150.0. Write what Java prints.</p>'
    },
    traps: ['<code>Cake cake[];</code> only declares the variable. You still need <code>cake = new Cake[3];</code> before using <code>cake.length</code>.']
  });

  // ======================= Summer 2023 Q3 =======================
  Q({
    id: '232-q3', paper: '232', qno: '3', marks: 8, topic: 'array', sub: ['array-obj'], type: 'code',
    title: 'Myobject[]: Sphere, Cylinder, Cone volumes (heterogeneous collection)',
    prompt: '<p>Myobject has a private radius r and <code>findVolume()</code> returning −1.0. Sphere (v = 4/3 πr³), Cylinder (private h, v = πr²h) and Cone extends Cylinder (v = ⅓πr²h). Add only the needed getters and parameterized constructors. In main, make 5 objects in a <code>Myobject</code> array (Sphere 2.5; Cone 1.9, 8.9; Cylinder 1.5, 6.5; Cone 2.7, 5.7; Sphere 3.5) and sum the volumes.</p>',
    answer: {
      code: code`
class Myobject {
    private double r;
    Myobject(double r) { this.r = r; }
    public double getR() { return r; }               // children can't read private r directly
    public double findVolume() { return -1.0; }
}
class Sphere extends Myobject {
    Sphere(double r) { super(r); }
    public double findVolume() { return 4.0 / 3.0 * Math.PI * Math.pow(getR(), 3); }
}
class Cylinder extends Myobject {
    private double h;
    Cylinder(double r, double h) { super(r); this.h = h; }
    public double getH() { return h; }
    public double findVolume() { return Math.PI * getR() * getR() * h; }
}
class Cone extends Cylinder {
    Cone(double r, double h) { super(r, h); }
    public double findVolume() { return Math.PI * getR() * getR() * getH() / 3.0; }
}
public class Main {
    public static void main(String[] args) {
        Myobject[] shapes = new Myobject[5];
        shapes[0] = new Sphere(2.5);
        shapes[1] = new Cone(1.9, 8.9);
        shapes[2] = new Cylinder(1.5, 6.5);
        shapes[3] = new Cone(2.7, 5.7);
        shapes[4] = new Sphere(3.5);
        double total = 0;
        for (Myobject m : shapes) {
            double v = m.findVolume();
            System.out.printf("%.2f%n", v);
            total += v;
        }
        System.out.printf("Total volume = %.2f%n", total);
    }
}`,
      output: `65.45
33.65
45.95
43.51
179.59
Total volume = 368.15`
    },
    traps: ['<code>4 / 3 * Math.PI * …</code> is WRONG: 4 / 3 is integer division = 1. Write <code>4.0 / 3.0</code>.', 'Cone extends Cylinder, and h is private in Cylinder, so Cone must use <code>getH()</code>.']
  });

  // ======================= Summer / Fall 2024 Q5 =======================
  (function () {
    const src = code`
public class Test {
    public static void main(String[] args) {
        Shape[] s = new Shape[3];
        s[0] = new Rectangle();
        s[1] = new Circle();
        s[2] = new Triangle();
        for (int i = 0; i < s.length; i++) {
            s[i].draw();
        }
    }
}`;
    const steps = [
      S('Shape[] s = new Shape[3];', 'Three empty (null) Shape slots.', ['call', 'main()'], ['arr', 'A', 'Shape', ['null', 'null', 'null']], ['v', 's', '@A']),
      S('s[0] = new Rectangle();', 'A Rectangle IS-A Shape, so it fits in a Shape slot.', ['new', 'r', 'Rectangle', {}], ['f', 'A', 0, '@r']),
      S('s[1] = new Circle();', '', ['new', 'c', 'Circle', {}], ['f', 'A', 1, '@c']),
      S('s[2] = new Triangle();', 'Heterogeneous = different object types in one array.', ['new', 't', 'Triangle', {}], ['f', 'A', 2, '@t'])
    ];
    ['rectangle', 'circle', 'triangle'].forEach((n, i) => {
      steps.push(S('for (int i = 0; i < s.length; i++) {', 'i = ' + i, ['v', 'i', String(i)], ['ptr', 'A', 'i', i]));
      steps.push(S('s[i].draw();', 'The object’s own draw() runs (dynamic binding).', ['p', 'drawing ' + n + '...']));
    });
    Q({
      id: '242-q5', paper: '242', qno: '5', marks: 6, topic: 'array', sub: ['array-obj'], type: 'code',
      title: 'Heterogeneous Shape array: s[0] Rectangle, s[1] Circle, s[2] Triangle',
      prompt: '<p>Shape has <code>draw()</code>; Rectangle, Circle and Triangle override it. Write class Test with main: create a heterogeneous array <code>s</code> of Shape with length 3 (s[0] Rectangle, s[1] Circle, s[2] Triangle) and loop to call draw() on each.</p>',
      given: code`
class Shape {
    void draw() { System.out.println("drawing..."); }
}
class Rectangle extends Shape {
    void draw() { System.out.println("drawing rectangle..."); }
}
class Circle extends Shape {
    void draw() { System.out.println("drawing circle..."); }
}
class Triangle extends Shape {
    void draw() { System.out.println("drawing triangle..."); }
}`,
      answer: { code: src, output: 'drawing rectangle...\ndrawing circle...\ndrawing triangle...' },
      tips: ['“Heterogeneous array” = an array of the <b>parent</b> type holding different <b>child</b> objects.'],
      trace: { code: src, steps }
    });
  })();
  Q({
    id: '243-q5', paper: '243', qno: '5', marks: 6, topic: 'array', sub: ['array-obj'], type: 'code',
    title: 'Heterogeneous Figure array: Square, Oval, Polygon',
    prompt: '<p>Figure has <code>render()</code>; Square, Oval and Polygon override it. Write class Demo with main: create a heterogeneous array <code>f</code> of Figure with length 3 (f[0] Square, f[1] Oval, f[2] Polygon) and loop to call render().</p>',
    answer: {
      code: code`
public class Demo {
    public static void main(String[] args) {
        Figure[] f = new Figure[3];
        f[0] = new Square();
        f[1] = new Oval();
        f[2] = new Polygon();
        for (Figure fig : f) {
            fig.render();
        }
    }
}`,
      output: 'rendering square...\nrendering oval...\nrendering polygon...'
    },
    tips: ['This is the Summer 2024 Q5 question with different names. The same pattern repeats.']
  });

  // ======================= Summer 2025 Q1: Seat hall =======================
  (function () {
    const src = code`
class Seat {
    private int row;
    private int number;
    private String tag;
    public Seat(int row, int number, String tag) {
        this.row = row;
        this.number = number;
        this.tag = tag;
    }
    public void setTag(String tag) {
        this.tag = tag;
    }
    @Override
    public String toString() {
        return "R" + row + "-S" + number + " (" + tag + ")";
    }
}
public class Cineplex {
    public static void main(String[] args) {
        Seat[][] hall = new Seat[3][];
        hall[0] = new Seat[2];
        hall[1] = new Seat[3];
        hall[2] = new Seat[1];
        for (int r = 0; r < hall.length; r++) {
            for (int c = 0; c < hall[r].length; c++) {
                hall[r][c] = new Seat(r, c, "Row" + r + ",Seat" + c);
            }
        }
        for (int r = 0; r < hall.length; r++) {
            for (int c = 0; c < hall[r].length; c++) {
                System.out.print(hall[r][c] + " ");
            }
            System.out.println();
        }
        Seat temp = hall[1][2];
        temp.setTag("VIP");
        System.out.println(hall[1][2]);
    }
}`;
    const sizes = [2, 3, 1];
    const steps = [S('Seat[][] hall = new Seat[3][];', '3 row slots, all null.', ['call', 'main()'], ['arr2', 'H', 'Seat', [null, null, null]], ['v', 'hall', '@H'])];
    sizes.forEach((n, r) => steps.push(S('hall[' + r + '] = new Seat[' + n + '];', 'Row ' + r + ' gets ' + n + ' empty (null) Seat references.', ['f', 'H', r, Array(n).fill('null')])));
    sizes.forEach((n, r) => {
      steps.push(S('for (int r = 0; r < hall.length; r++) {@1', '', ['v', 'r', String(r)], ['ptr', 'H', 'r', r]));
      for (let c = 0; c < n; c++) {
        steps.push(S('hall[r][c] = new Seat(r, c, "Row" + r + ",Seat" + c);', 'new Seat(' + r + ', ' + c + ', "Row' + r + ',Seat' + c + '")', ['v', 'c', String(c)], ['ptr', 'H', 'c', [r, c]], ['new', 's' + r + c, 'Seat', { row: String(r), number: String(c), tag: '"Row' + r + ',Seat' + c + '"' }], ['f', 'H', [r, c], '@s' + r + c]));
      }
    });
    steps.push(S('for (int r = 0; r < hall.length; r++) {@2', 'Print each row on one line (toString() is called automatically).', ['vd', 'c'], ['ptr', 'H', 'c', null]));
    sizes.forEach((n, r) => {
      let line = '';
      for (let c = 0; c < n; c++) line += 'R' + r + '-S' + c + ' (Row' + r + ',Seat' + c + ') ';
      steps.push(S('System.out.print(hall[r][c] + " ");', 'Row ' + r, ['v', 'r', String(r)], ['ptr', 'H', 'r', r], ['pr', line]));
      steps.push(S('System.out.println();', '', ['p', '']));
    });
    steps.push(S('Seat temp = hall[1][2];', 'temp copies the reference stored at hall[1][2]: same Seat object, two references.', ['vd', 'r'], ['vd', 'c'], ['ptr', 'H', 'r', null], ['v', 'temp', '@s12'], ['ptr', 'H', 'temp', [1, 2]]));
    steps.push(S('temp.setTag("VIP");', 'Changing it through temp changes the object in the hall.', ['f', 's12', 'tag', '"VIP"']));
    steps.push(S('System.out.println(hall[1][2]);', '', ['p', 'R1-S2 (VIP)']));
    Q({
      id: '252-q1', paper: '252', qno: '1', marks: 6, topic: 'array', sub: ['array-2d', 'array-obj', 'references'], type: 'code',
      title: 'Seat hall: jagged 2D array of objects + shared reference',
      prompt: '<p>(a) In main of Cineplex, make a 2D array <code>hall</code> with 3 rows: row 0 has 2 seats, row 1 has 3, row 2 has 1. (b) Use nested loops to fill it with <code>new Seat(r, c, "Row" + r + ",Seat" + c)</code>, then print each seat (this uses toString()). (c) Create a Seat reference <code>temp</code> that refers to hall[1][2], update its tag to "VIP" and print hall[1][2].</p>',
      given: code`
class Seat {
    private int row;
    private int number;
    private String tag;
    public Seat(int row, int number, String tag) {
        this.row = row;
        this.number = number;
        this.tag = tag;
    }
    public void setTag(String tag) {
        this.tag = tag;
    }
    @Override
    public String toString() {
        return "R" + row + "-S" + number + " (" + tag + ")";
    }
}`,
      answer: {
        code: src.split('public class Cineplex')[1].replace(/^ \{\n/, '').replace(/\}\s*$/, '').trim(),
        codeTitle: 'Code inside class Cineplex',
        output: 'R0-S0 (Row0,Seat0) R0-S1 (Row0,Seat1) \nR1-S0 (Row1,Seat0) R1-S1 (Row1,Seat1) R1-S2 (Row1,Seat2) \nR2-S0 (Row2,Seat0) \nR1-S2 (VIP)',
        html: '<p>The expected output prints a whole row per line, so use <code>print</code> inside the inner loop and <code>println()</code> after it. Part (c) shows that <code>temp</code> and <code>hall[1][2]</code> are two references to <b>one</b> object.</p>'
      },
      tips: ['<code>System.out.print(obj)</code> and <code>"" + obj</code> both call <code>obj.toString()</code> automatically.'],
      trace: { code: src, steps }
    });
  })();

  // ======================= Summer 2025 Q5 =======================
  Q({
    id: '252-q5', paper: '252', qno: '5', marks: 6, topic: 'array', sub: ['array-obj'], type: 'output',
    title: 'Shape/Rectangle/Square casts + printTotalArea(Shape[])',
    prompt: '<p>(a) Examine the seven println statements and write their outputs. For a compile-time or runtime error, write the number and the reason instead. (b) Implement <code>printTotalArea</code> to total the area of all objects that define an area (ignore plain Shape objects).</p>',
    given: code`
class Shape {
    protected String className = "Shape";
    String getClassName() {
        return this.className;
    }
}
class Rectangle extends Shape {
    double width, height;
    Rectangle(double width, double height) {
        this.className = "Rectangle";
        this.width = width;
        this.height = height;
    }
    protected double getArea() {
        return width * height;
    }
}
class Square extends Rectangle {
    Square(double side) {
        super(side, side);
    }
    @Override
    String getClassName() {
        return "Square";
    }
}
public class Main {
    public static void main(String[] args) {
        Shape godel = new Shape();
        Shape escher = new Rectangle(2, 3);
        Rectangle bach = new Square(4);
        System.out.println("0: " + godel.nonExistingMethod()); // Error!
        System.out.println("1: " + godel.getClassName());
        System.out.println("2: " + escher.getClassName());
        System.out.println("3: " + bach.getClassName());
        System.out.println("4: " + ((Shape) escher).getClassName());
        System.out.println("5: " + ((Square) escher).getClassName());
        System.out.println("6: " + ((Square) bach).getClassName());
        Shape[] shapeArray = {godel, escher, bach};
        printTotalArea(shapeArray);
    }
    static void printTotalArea(Shape[] shapesArray) {
        double totalArea = 0;
        // complete the code
        System.out.println("Total Area is: " + totalArea);
    }
}`,
    answer: {
      output: `0: ERROR, method nonExistingMethod() does not exist (compile-time)
1: Shape
2: Rectangle
3: Square
4: Rectangle
5: ERROR, ClassCastException at runtime: escher is a Rectangle, not a Square
6: Square
Total Area is: 22.0`,
      code: code`
static void printTotalArea(Shape[] shapesArray) {
    double totalArea = 0;
    for (Shape s : shapesArray) {
        if (s instanceof Rectangle) {          // Square is also a Rectangle
            totalArea += ((Rectangle) s).getArea();
        }
    }
    System.out.println("Total Area is: " + totalArea);
}`,
      html: `<ul><li>2: the Rectangle constructor overwrote the inherited field <code>className</code> with "Rectangle".</li>
<li>4: casting <b>up</b> to Shape doesn’t change the object, so it still says "Rectangle".</li>
<li>5: casting <b>down</b> compiles (Square is a subtype of Shape), but the object is only a Rectangle → <code>ClassCastException</code>.</li>
<li>Total = 2 × 3 + 4 × 4 = 6 + 16 = 22.0. godel is skipped because it is not a Rectangle.</li></ul>`
    },
    traps: ['A cast never changes the object. It only changes what the compiler lets you call. A downcast to the wrong type compiles and then fails at runtime.']
  });

  // ======================= Fall 2025 Q1: jagged Student[][] with Scanner =======================
  (function () {
    const src = code`
import java.util.Scanner;
class Student {
    String name;
    int id;
    double cgpa;
    Student(String name, int id, double cgpa) {
        this.name = name;
        this.id = id;
        this.cgpa = cgpa;
    }
}
public class StudentArray {
    public static void main(String[] args) {
        Scanner scn = new Scanner(System.in);
        Student[][] students = new Student[3][];
        students[0] = new Student[2];
        students[1] = new Student[1];
        students[2] = new Student[3];
        for (int i = 0; i < students.length; i++) {
            for (int j = 0; j < students[i].length; j++) {
                String name = scn.next();
                int id = scn.nextInt();
                double cgpa = scn.nextDouble();
                students[i][j] = new Student(name, id, cgpa);
            }
        }
        scn.close();
    }
}`;
    const input = [['Anwar', 501, '3.65'], ['Bithi', 502, '3.8'], ['Choton', 503, '3.2'], ['Dipa', 504, '3.95'], ['Emon', 505, '2.9'], ['Farah', 506, '3.55']];
    const sizes = [2, 1, 3];
    const steps = [
      S('Scanner scn = new Scanner(System.in);', 'Sample input typed by the user:<br><code>Anwar 501 3.65 / Bithi 502 3.80 / Choton 503 3.20 / Dipa 504 3.95 / Emon 505 2.90 / Farah 506 3.55</code>', ['call', 'main()'], ['new', 'sc', 'Scanner', {}], ['v', 'scn', '@sc']),
      S('Student[][] students = new Student[3][];', '(b) 3 rows, sizes not decided yet.', ['arr2', 'G', 'Student', [null, null, null]], ['v', 'students', '@G'])
    ];
    sizes.forEach((n, i) => steps.push(S('students[' + i + '] = new Student[' + n + '];', '(c) Row ' + i + ' → ' + n + ' slot(s).', ['f', 'G', i, Array(n).fill('null')])));
    let k = 0;
    sizes.forEach((n, i) => {
      steps.push(S('for (int i = 0; i < students.length; i++) {', 'Row ' + i, ['v', 'i', String(i)], ['ptr', 'G', 'i', i]));
      for (let j = 0; j < n; j++) {
        const [nm, id, cg] = input[k++];
        steps.push(S('for (int j = 0; j < students[i].length; j++) {', 'j = ' + j + ' (row ' + i + ' has length ' + n + ')', ['v', 'j', String(j)], ['ptr', 'G', 'j', [i, j]]));
        steps.push(S('String name = scn.next();', 'Read name, then id, then cgpa (that order!).', ['v', 'name', '"' + nm + '"'], ['v', 'id', String(id)], ['v', 'cgpa', cg]));
        steps.push(S('students[i][j] = new Student(name, id, cgpa);', '', ['new', 'st' + k, 'Student', { name: '"' + nm + '"', id: String(id), cgpa: cg }], ['f', 'G', [i, j], '@st' + k]));
      }
    });
    steps.push(S('scn.close();', 'Every slot of the jagged array now refers to a Student.', ['vd', 'name'], ['vd', 'id'], ['vd', 'cgpa'], ['vd', 'i'], ['vd', 'j'], ['ptr', 'G', 'i', null], ['ptr', 'G', 'j', null]));
    Q({
      id: '253-q1', paper: '253', qno: '1', marks: 5, topic: 'array', sub: ['array-2d', 'array-obj', 'constructors'], type: 'code',
      title: 'Jagged Student[][] filled from Scanner input',
      prompt: '<p>(a) Write a Student constructor so <code>new Student("Anwar", 501, 3.65)</code> works. (b) Declare a jagged 2D array of Student with 3 rows. (c) Allocate row 0 → 2, row 1 → 1, row 2 → 3 students. (d) With nested loops, read name (String), id (int), cgpa (double) for each student and store new Student objects in every position.</p>',
      given: code`
import java.util.Scanner;
class Student {
    String name;
    int id;
    double cgpa;
    // Task A: Write a suitable constructor here
}
public class StudentArray {
    public static void main(String[] args) {
        Scanner scn = new Scanner(System.in);
        // Task B: Declare a jagged 2D array of Student with 3 rows
        // Task C: Allocate each row with the fixed sizes
        // Task D: Nested loops -> take input -> create objects -> store in array
        scn.close();
    }
}`,
      answer: { code: src },
      traps: ['Read input in the order the question gives: <code>next()</code> for a one-word String, <code>nextInt()</code>, <code>nextDouble()</code>.', 'Inner loop bound is <code>students[i].length</code>.'],
      trace: { code: src, steps }
    });
  })();

  // ======================= Fall 2025 Q5: Demon array =======================
  Q({
    id: '253-q5', paper: '253', qno: '5', marks: 6, topic: 'array', sub: ['array-obj', 'overloading'], type: 'output',
    title: 'Demon[]: for-each summon() + overloads in UpperMoon',
    prompt: '<p>(a) Find the exact output of the for-each loop. (b) Modify only UpperMoon so the last two calls print "Muzan summoned Akaza to beat Gyomei" and "Akaza was replaced by Kokushibo to beat Gyomei".</p>',
    given: code`
class Demon {
    public String name;
    public int rank;
    public String category = "Demon";
    public Demon(String name) {
        this.name = name;
    }
    public void summon() {
        System.out.println("Muzan summoned " + category + " " + rank);
    }
}
class LowerMoon extends Demon {
    public LowerMoon(String name, int rank) {
        super(name);
        this.rank = rank;
        this.category = "Lower";
    }
}
class UpperMoon extends LowerMoon {
    public UpperMoon(String name, int rank) {
        super(name, rank);
        this.category = "Upper";
    }
    public void summon() {
        super.summon();
        System.out.println("twanggg");
    }
    // add your codes here
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
        demon[2].summon("Gyomei");
        demon[2].summon(demon[3], "Gyomei");
    }
}`,
    answer: {
      output: `Muzan summoned Demon 0
Muzan summoned Lower 5
Muzan summoned Upper 3
twanggg
Muzan summoned Upper 1
twanggg`,
      code: code`
// (b) add to UpperMoon:
public void summon(String enemy) {
    System.out.println("Muzan summoned " + name + " to beat " + enemy);
}
public void summon(Demon other, String enemy) {
    System.out.println(name + " was replaced by " + other.name + " to beat " + enemy);
}

// ⚠ demon[2] is declared as Demon, and Demon has no summon(String).
// The compiler checks the DECLARED type, so the calls must be cast:
((UpperMoon) demon[2]).summon("Gyomei");
((UpperMoon) demon[2]).summon(demon[3], "Gyomei");`,
      html: `<p><b>(a)</b> The Slasher demon’s rank was never set, so it is 0. Each UpperMoon runs its own summon(): the parent line plus "twanggg".</p>
<p><b>(b)</b> Overloads in UpperMoon give exactly the required lines (verified). But "modify only UpperMoon" isn’t enough on its own: <code>demon[2].summon("Gyomei")</code> doesn’t compile, because the reference type is Demon. Mention this and show the cast. That is the point the examiner is testing.</p>`
    },
    traps: ['Which methods you may <b>call</b> is decided by the reference (declared) type. Which version <b>runs</b> is decided by the object.']
  });

  // ======================= Spring 2026 Q4 =======================
  (function () {
    const src = code`
class Employee {
    String problem;
    void assignProblem(String problem) {
        this.problem = problem;
    }
}
class Manager extends Employee {
    void solveProblem() {
        System.out.println("Manager is solving " + this.problem);
    }
}
class Engineer extends Employee {
    void solveProblem() {
        System.out.println("Engineer is solving " + this.problem);
    }
}
public class Driver {
    static void solveProblem(Employee[] employeeList) {
        for (Employee emp : employeeList) {
            if (emp instanceof Manager) {
                ((Manager) emp).solveProblem();
            } else if (emp instanceof Engineer) {
                ((Engineer) emp).solveProblem();
            }
        }
    }
    public static void main(String[] args) {
        Manager m = new Manager();
        m.assignProblem("Budget planning issue");
        Engineer e = new Engineer();
        e.assignProblem("Server bug");
        Employee[] employeeList = {m, e};
        solveProblem(employeeList);
    }
}`;
    const steps = [
      S('Manager m = new Manager();', '', ['call', 'main()'], ['new', 'm', 'Manager', { problem: 'null' }], ['v', 'm', '@m']),
      S('m.assignProblem("Budget planning issue");', 'Inherited from Employee.', ['f', 'm', 'problem', '"Budget planning issue"']),
      S('Engineer e = new Engineer();', '', ['new', 'e', 'Engineer', { problem: 'null' }], ['v', 'e', '@e']),
      S('e.assignProblem("Server bug");', '', ['f', 'e', 'problem', '"Server bug"']),
      S('Employee[] employeeList = {m, e};', 'The array stores the two references (no new employees).', ['arr', 'A', 'Employee', ['@m', '@e']], ['v', 'employeeList', '@A']),
      S('solveProblem(employeeList);', '', ['call', 'solveProblem(Employee[] employeeList)', { employeeList: '@A' }]),
      S('for (Employee emp : employeeList) {', '', ['v', 'emp', '@m'], ['ptr', 'A', 'emp', 0]),
      S('if (emp instanceof Manager) {', 'Object #1 is a Manager → true'),
      S('((Manager) emp).solveProblem();', 'Cast needed: Employee has no solveProblem().', ['p', 'Manager is solving Budget planning issue']),
      S('for (Employee emp : employeeList) {', '', ['v', 'emp', '@e'], ['ptr', 'A', 'emp', 1]),
      S('} else if (emp instanceof Engineer) {', 'Not a Manager; is an Engineer → true'),
      S('((Engineer) emp).solveProblem();', '', ['p', 'Engineer is solving Server bug'])
    ];
    Q({
      id: '261-q4', paper: '261', qno: '4', marks: 5, topic: 'array', sub: ['array-obj'], type: 'code',
      title: 'Complete main: Employee[] for solveProblem() (no prints in main)',
      prompt: '<p>Complete main so the output is produced. No print statements in main: all output must come from <code>solveProblem(Employee[] employeeList)</code>.</p>',
      given: src.replace(/public static void main[\s\S]*$/, 'public static void main(String[] args) {\n        // Complete the rest of the main method.\n        // You may use only the classes and methods already given.\n    }\n}'),
      givenOut: 'Manager is solving Budget planning issue\nEngineer is solving Server bug',
      answer: {
        code: code`
public static void main(String[] args) {
    Manager m = new Manager();
    m.assignProblem("Budget planning issue");
    Engineer e = new Engineer();
    e.assignProblem("Server bug");
    Employee[] employeeList = {m, e};      // order matters: Manager first
    solveProblem(employeeList);
}`,
        output: 'Manager is solving Budget planning issue\nEngineer is solving Server bug'
      },
      trace: { code: src, steps }
    });
  })();
})();
