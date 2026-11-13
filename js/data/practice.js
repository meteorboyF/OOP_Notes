// Array "write the code" practice: basic → medium → hard.
// Each problem's visualiser is generated from the input you type (input.build), and its default
// run prints exactly what the full Java program prints (checked by verify/check-traces.js).
(function () {
  const { code } = OOP;
  const { nums, matrix } = OOP.Tracer;
  const fmt = x => (Number.isInteger(x) ? x + '.0' : String(x)); // Java double → String
  const str = a => '[' + a.join(', ') + ']';                         // Arrays.toString
  const lit = a => '{' + a.join(', ') + '}';
  const indent = (s, n) => s.replace(/^\n/, '').split('\n').map(l => (l ? ' '.repeat(n) + l : l)).join('\n');

  function prob(o) {
    o.full = (o.imports ? o.imports + '\n\n' : '') + (o.extra ? o.extra.replace(/^\n/, '') + '\n\n' : '') +
      'public class ' + o.cls + ' {\n' + indent(o.code, 4) +
      (o.main.length ? '\n\n    public static void main(String[] args) {\n' + o.main.map(l => '        ' + l).join('\n') + '\n    }' : '') + '\n}';
    OOP.P(o);
  }
  const arrField = (def, label) => ({ key: 'arr', label: label || 'Array', def });
  // common opening: array object on the heap + the method's frame
  function open(t, line, sig, a, extra, note) {
    const vars = Object.assign({ arr: '@A' }, extra || {});
    t.s(line, note || 'The method receives a copy of the <b>reference</b>: it works on the caller’s array.', ['arr', 'A', 'int', a.map(String)], ['call', sig, vars]);
  }

  // =============================== BASIC ===============================
  prob({
    id: 'p-sum-avg', level: 'basic', title: 'Sum and average', short: 'Accumulator pattern + (double) cast', mid: 'Summer 2019', complexity: 'O(n)', cls: 'SumAverage',
    prompt: '<p>Write <code>static double average(int[] arr)</code> that returns the average of the elements.</p>',
    idea: '<p>Keep a running total, then divide by <code>arr.length</code>. Cast to <code>double</code> <b>before</b> dividing, or integer division throws the decimals away.</p>',
    code: code`
static double average(int[] arr) {
    int sum = 0;
    for (int i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    double avg = (double) sum / arr.length;
    return avg;
}`,
    main: ['int[] arr = {4, 8, 15, 16, 23, 43};', 'System.out.println("Average: " + average(arr));'],
    output: 'Average: 18.166666666666668',
    tips: ['<code>sum / arr.length</code> with two ints = integer division (109 / 6 = 18). Write <code>(double) sum / arr.length</code>.', 'With a for-each loop: <code>for (int x : arr) sum += x;</code>'],
    input: {
      fields: [arrField('4 8 15 16 23 43')],
      build(inp, t) {
        const a = nums(inp.arr); let sum = 0;
        open(t, 'static double average', 'average(int[] arr)', a);
        t.s('int sum = 0;', '', ['v', 'sum', '0']);
        a.forEach((x, i) => {
          t.s('for (int i = 0; i < arr.length; i++) {', 'i = ' + i + ' < ' + a.length + ' ✓', ['v', 'i', String(i)], ['ptr', 'A', 'i', i]);
          sum += x;
          t.s('sum += arr[i];', 'sum = ' + (sum - x) + ' + ' + x + ' = ' + sum, ['v', 'sum', String(sum)], ['mark', 'A', i, 'done']);
        });
        t.s('for (int i = 0; i < arr.length; i++) {', 'i = ' + a.length + ' → condition false, loop ends.', ['v', 'i', String(a.length)], ['ptr', 'A', 'i', null]);
        const avg = sum / a.length;
        t.s('double avg = (double) sum / arr.length;', sum + ' / ' + a.length + ' = ' + fmt(avg), ['vd', 'i'], ['v', 'avg', fmt(avg)]);
        t.s('return avg;', 'main prints the returned value.', ['p', 'Average: ' + fmt(avg)]);
      }
    }
  });

  prob({
    id: 'p-max-min', level: 'basic', title: 'Largest and smallest (with index)', short: 'Start from arr[0], not 0', mid: 'Fall 2018', complexity: 'O(n)', cls: 'MaxMin',
    prompt: '<p>Print the largest and smallest element and the index where each one is.</p>',
    idea: '<p>Assume the first element is both the max and the min, then compare every other element against them.</p>',
    code: code`
static void findMaxMin(int[] arr) {
    int max = arr[0], min = arr[0];
    int maxIdx = 0, minIdx = 0;
    for (int i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
            maxIdx = i;
        }
        if (arr[i] < min) {
            min = arr[i];
            minIdx = i;
        }
    }
    System.out.println("Max " + max + " at index " + maxIdx);
    System.out.println("Min " + min + " at index " + minIdx);
}`,
    main: ['int[] arr = {7, -2, 19, 4, 19, -8, 3};', 'findMaxMin(arr);'],
    output: 'Max 19 at index 2\nMin -8 at index 5',
    tips: ['Initialising <code>max = 0</code> fails for an all-negative array. Always start with <code>arr[0]</code>.', 'With <code>&gt;</code> you keep the <b>first</b> position of a tie; with <code>&gt;=</code> you get the last.'],
    input: {
      fields: [arrField('7 -2 19 4 19 -8 3')],
      build(inp, t) {
        const a = nums(inp.arr);
        open(t, 'static void findMaxMin', 'findMaxMin(int[] arr)', a);
        let max = a[0], min = a[0], mx = 0, mn = 0;
        t.s('int max = arr[0], min = arr[0];', 'Both start at the first element.', ['v', 'max', String(max)], ['v', 'min', String(min)], ['ptr', 'A', 'max', 0], ['ptr', 'A', 'min', 0]);
        t.s('int maxIdx = 0, minIdx = 0;', '', ['v', 'maxIdx', '0'], ['v', 'minIdx', '0']);
        for (let i = 1; i < a.length; i++) {
          t.s('for (int i = 1; i < arr.length; i++) {', 'i = ' + i, ['v', 'i', String(i)], ['ptr', 'A', 'i', i]);
          if (a[i] > max) { max = a[i]; mx = i; t.s('max = arr[i];', a[i] + ' > old max → new max', ['v', 'max', String(max)], ['v', 'maxIdx', String(i)], ['ptr', 'A', 'max', i]); }
          else t.s('if (arr[i] > max) {', a[i] + ' > ' + max + '? no');
          if (a[i] < min) { min = a[i]; mn = i; t.s('min = arr[i];', a[i] + ' < old min → new min', ['v', 'min', String(min)], ['v', 'minIdx', String(i)], ['ptr', 'A', 'min', i]); }
          else t.s('if (arr[i] < min) {', a[i] + ' < ' + min + '? no');
        }
        t.s('System.out.println("Max "', '', ['ptr', 'A', 'i', null], ['vd', 'i'], ['p', 'Max ' + max + ' at index ' + mx]);
        t.s('System.out.println("Min "', '', ['p', 'Min ' + min + ' at index ' + mn]);
      }
    }
  });

  prob({
    id: 'p-linear-search', level: 'basic', title: 'Linear search (return the index)', short: 'Return early, -1 if absent', mid: 'Fall 2019', complexity: 'O(n)', cls: 'LinearSearch',
    prompt: '<p>Write <code>static int linearSearch(int[] arr, int key)</code> returning the index of the first occurrence of key, or <code>-1</code>.</p>',
    idea: '<p>Check elements one by one. Return as soon as you find it. Only after checking <b>all</b> of them can you say "not found".</p>',
    code: code`
static int linearSearch(int[] arr, int key) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == key) {
            return i;
        }
    }
    return -1;
}`,
    main: ['int[] arr = {12, 7, 33, 7, 50};', 'System.out.println("Index: " + linearSearch(arr, 33));'],
    output: 'Index: 2',
    tips: ['<code>return -1</code> goes <b>after</b> the loop, never in an else inside it.'],
    input: {
      fields: [arrField('12 7 33 7 50'), { key: 'key', label: 'key', def: '33', short: true }],
      build(inp, t) {
        const a = nums(inp.arr), key = nums(inp.key)[0];
        open(t, 'static int linearSearch', 'linearSearch(int[] arr, int key)', a, { key: String(key) });
        for (let i = 0; i < a.length; i++) {
          t.s('for (int i = 0; i < arr.length; i++) {', 'i = ' + i, ['v', 'i', String(i)], ['ptr', 'A', 'i', i]);
          if (a[i] === key) { t.s('return i;', 'arr[' + i + '] == ' + key + ' → found!', ['mark', 'A', i, 'hl2'], ['p', 'Index: ' + i]); return; }
          t.s('if (arr[i] == key) {', a[i] + ' == ' + key + '? no', ['mark', 'A', i, 'done']);
        }
        t.s('return -1;', 'Checked every element: not present.', ['ptr', 'A', 'i', null], ['p', 'Index: -1']);
      }
    }
  });

  prob({
    id: 'p-even-odd', level: 'basic', title: 'Count even and odd numbers', short: 'x % 2 == 0', complexity: 'O(n)', cls: 'EvenOdd',
    prompt: '<p>Count how many elements are even and how many are odd.</p>',
    idea: '<p>An integer is even when <code>x % 2 == 0</code>. Everything else is odd, including negatives: <code>-3 % 2</code> is <b>-1</b>, not 1.</p>',
    code: code`
static void countEvenOdd(int[] arr) {
    int even = 0, odd = 0;
    for (int x : arr) {
        if (x % 2 == 0) {
            even++;
        } else {
            odd++;
        }
    }
    System.out.println("Even: " + even + ", Odd: " + odd);
}`,
    main: ['int[] arr = {3, 8, -5, 0, 14, 21, -6};', 'countEvenOdd(arr);'],
    output: 'Even: 4, Odd: 3',
    tips: ['Test odd as <code>x % 2 != 0</code>, not <code>x % 2 == 1</code>, which fails for negative numbers.'],
    input: {
      fields: [arrField('3 8 -5 0 14 21 -6')],
      build(inp, t) {
        const a = nums(inp.arr); let e = 0, o = 0;
        open(t, 'static void countEvenOdd', 'countEvenOdd(int[] arr)', a);
        t.s('int even = 0, odd = 0;', '', ['v', 'even', '0'], ['v', 'odd', '0']);
        a.forEach((x, i) => {
          t.s('for (int x : arr) {', 'x = ' + x, ['v', 'x', String(x)], ['ptr', 'A', 'x', i]);
          if (x % 2 === 0) { e++; t.s('even++;', x + ' % 2 = 0 → even', ['v', 'even', String(e)], ['mark', 'A', i, 'done']); }
          else { o++; t.s('odd++;', x + ' % 2 = ' + (x % 2) + ' → odd', ['v', 'odd', String(o)], ['mark', 'A', i, 'hl2']); }
        });
        t.s('System.out.println("Even: "', '', ['ptr', 'A', 'x', null], ['vd', 'x'], ['p', 'Even: ' + e + ', Odd: ' + o]);
      }
    }
  });

  prob({
    id: 'p-count-key', level: 'basic', title: 'Frequency of a value', short: 'Count matches', complexity: 'O(n)', cls: 'CountKey',
    prompt: '<p>Return how many times <code>key</code> appears in the array.</p>',
    idea: '<p>Same as linear search, but instead of returning on a match, add 1 to a counter and keep going.</p>',
    code: code`
static int countOccurrences(int[] arr, int key) {
    int count = 0;
    for (int x : arr) {
        if (x == key) {
            count++;
        }
    }
    return count;
}`,
    main: ['int[] arr = {2, 5, 2, 9, 2, 5};', 'System.out.println("2 appears " + countOccurrences(arr, 2) + " times");'],
    output: '2 appears 3 times',
    input: {
      fields: [arrField('2 5 2 9 2 5'), { key: 'key', label: 'key', def: '2', short: true }],
      build(inp, t) {
        const a = nums(inp.arr), key = nums(inp.key)[0]; let c = 0;
        open(t, 'static int countOccurrences', 'countOccurrences(int[] arr, int key)', a, { key: String(key) });
        t.s('int count = 0;', '', ['v', 'count', '0']);
        a.forEach((x, i) => {
          t.s('for (int x : arr) {', '', ['v', 'x', String(x)], ['ptr', 'A', 'x', i]);
          if (x === key) { c++; t.s('count++;', 'match', ['v', 'count', String(c)], ['mark', 'A', i, 'hl2']); }
          else t.s('if (x == key) {', x + ' ≠ ' + key);
        });
        t.s('return count;', '', ['ptr', 'A', 'x', null], ['vd', 'x'], ['p', key + ' appears ' + c + ' times']);
      }
    }
  });

  prob({
    id: 'p-reverse-print', level: 'basic', title: 'Print in reverse order', short: 'i from length-1 down to 0', complexity: 'O(n)', cls: 'ReversePrint',
    prompt: '<p>Print the elements from last to first (don’t modify the array).</p>',
    idea: '<p>The last index is <code>arr.length - 1</code>. Count down while <code>i &gt;= 0</code>.</p>',
    code: code`
static void printReverse(int[] arr) {
    for (int i = arr.length - 1; i >= 0; i--) {
        System.out.print(arr[i] + " ");
    }
    System.out.println();
}`,
    main: ['int[] arr = {10, 20, 30, 40, 50};', 'printReverse(arr);'],
    output: '50 40 30 20 10 ',
    tips: ['Starting at <code>arr.length</code> (without -1) throws ArrayIndexOutOfBoundsException.'],
    input: {
      fields: [arrField('10 20 30 40 50')],
      build(inp, t) {
        const a = nums(inp.arr);
        open(t, 'static void printReverse', 'printReverse(int[] arr)', a);
        for (let i = a.length - 1; i >= 0; i--) {
          t.s('for (int i = arr.length - 1; i >= 0; i--) {', 'i = ' + i, ['v', 'i', String(i)], ['ptr', 'A', 'i', i]);
          t.s('System.out.print(arr[i] + " ");', '', ['pr', a[i] + ' '], ['mark', 'A', i, 'done']);
        }
        t.s('System.out.println();', 'i = -1 → loop ends.', ['ptr', 'A', 'i', null], ['vd', 'i'], ['p', '']);
      }
    }
  });

  prob({
    id: 'p-copy', level: 'basic', title: 'Copy an array (and why b = a is NOT a copy)', short: 'Aliasing vs a real copy', complexity: 'O(n)', cls: 'CopyArray',
    prompt: '<p>Write <code>static int[] copyArray(int[] arr)</code> that returns a new array with the same values. Show the difference between <code>alias = a</code> and a real copy.</p>',
    idea: '<p>Arrays are objects. <code>int[] b = a;</code> copies the <b>reference</b>, so both names point to the same array. A real copy needs <code>new int[a.length]</code> plus a loop (or <code>a.clone()</code> / <code>Arrays.copyOf</code>).</p>',
    code: code`
static int[] copyArray(int[] arr) {
    int[] copy = new int[arr.length];
    for (int i = 0; i < arr.length; i++) {
        copy[i] = arr[i];
    }
    return copy;
}
public static void main(String[] args) {
    int[] a = {1, 2, 3};
    int[] alias = a;
    int[] copy = copyArray(a);
    alias[0] = 99;
    System.out.println(a[0] + " " + copy[0]);
}`,
    main: [],
    output: '99 1',
    tips: ['This is the array version of the reference questions: <code>alias[0] = 99</code> changes <code>a[0]</code> too.'],
    input: {
      fields: [],
      build(inp, t) {
        t.s('int[] a = {1, 2, 3};', '', ['call', 'main()'], ['arr', 'A', 'int', ['1', '2', '3']], ['v', 'a', '@A']);
        t.s('int[] alias = a;', 'No new array: alias points to the same one.', ['v', 'alias', '@A']);
        t.s('int[] copy = copyArray(a);', '', ['call', 'copyArray(int[] arr)', { arr: '@A' }]);
        t.s('int[] copy = new int[arr.length];', 'A brand-new array of 3 zeros.', ['arr', 'C', 'int', ['0', '0', '0']], ['v', 'copy', '@C']);
        [1, 2, 3].forEach((x, i) => {
          t.s('for (int i = 0; i < arr.length; i++) {', '', ['v', 'i', String(i)], ['ptr', 'A', 'i', i], ['ptr', 'C', 'i', i]);
          t.s('copy[i] = arr[i];', '', ['f', 'C', i, String(x)]);
        });
        t.s('return copy;', '', ['ptr', 'A', 'i', null], ['ptr', 'C', 'i', null]);
        t.s('int[] copy = copyArray(a);', 'main receives the reference to the new array.', ['ret'], ['v', 'copy', '@C']);
        t.s('alias[0] = 99;', 'Writes into the ONE array that both a and alias point to.', ['f', 'A', 0, '99']);
        t.s('System.out.println(a[0] + " " + copy[0]);', 'a[0] changed through alias; the real copy is independent.', ['p', '99 1']);
      }
    }
  });

  prob({
    id: 'p-above-avg', level: 'basic', title: 'Count elements above the average', short: 'Two passes over the array', complexity: 'O(n)', cls: 'AboveAverage',
    prompt: '<p>Return how many elements are strictly greater than the average.</p>',
    idea: '<p>You can’t know the average until you’ve seen every element, so loop twice: first sum, then count.</p>',
    code: code`
static int countAboveAverage(int[] arr) {
    int sum = 0;
    for (int x : arr) sum += x;
    double avg = (double) sum / arr.length;
    int count = 0;
    for (int x : arr) {
        if (x > avg) count++;
    }
    return count;
}`,
    main: ['int[] arr = {5, 1, 9, 3, 7};', 'System.out.println(countAboveAverage(arr));'],
    output: '2',
    input: {
      fields: [arrField('5 1 9 3 7')],
      build(inp, t) {
        const a = nums(inp.arr); let sum = 0;
        open(t, 'static int countAboveAverage', 'countAboveAverage(int[] arr)', a);
        t.s('int sum = 0;', '', ['v', 'sum', '0']);
        a.forEach((x, i) => { sum += x; t.s('for (int x : arr) sum += x;', 'Pass 1', ['v', 'x', String(x)], ['ptr', 'A', 'x', i], ['v', 'sum', String(sum)]); });
        const avg = sum / a.length;
        t.s('double avg = (double) sum / arr.length;', '', ['vd', 'x'], ['ptr', 'A', 'x', null], ['v', 'avg', fmt(avg)]);
        t.s('int count = 0;', '', ['v', 'count', '0']);
        let c = 0;
        a.forEach((x, i) => {
          t.s('for (int x : arr) {', 'Pass 2', ['v', 'x', String(x)], ['ptr', 'A', 'x', i]);
          if (x > avg) { c++; t.s('if (x > avg) count++;', x + ' > ' + fmt(avg) + ' ✓', ['v', 'count', String(c)], ['mark', 'A', i, 'hl2']); }
          else t.s('if (x > avg) count++;', x + ' > ' + fmt(avg) + '? no');
        });
        t.s('return count;', '', ['vd', 'x'], ['ptr', 'A', 'x', null], ['p', String(c)]);
      }
    }
  });

  prob({
    id: 'p-2d-sum', level: 'basic', title: 'Print a 2D array and its total', short: 'Nested loops, a[i].length', mid: 'Fall 2017 / Summer 2025', complexity: 'O(rows × cols)', cls: 'Sum2D',
    prompt: '<p>Print the matrix row by row, and return the sum of all elements. Works for jagged arrays too.</p>',
    idea: '<p>Outer loop over rows (<code>m.length</code>), inner loop over the columns of <b>that</b> row (<code>m[i].length</code>).</p>',
    code: code`
static int sum2D(int[][] m) {
    int total = 0;
    for (int i = 0; i < m.length; i++) {
        for (int j = 0; j < m[i].length; j++) {
            System.out.print(m[i][j] + " ");
            total += m[i][j];
        }
        System.out.println();
    }
    return total;
}`,
    main: ['int[][] m = {{1, 2, 3}, {4, 5}, {6}};', 'System.out.println("Total = " + sum2D(m));'],
    output: '1 2 3 \n4 5 \n6 \nTotal = 21',
    input: {
      fields: [{ key: 'm', label: 'Rows (use ; between rows)', def: '1 2 3; 4 5; 6' }],
      build(inp, t) {
        const m = matrix(inp.m); let total = 0;
        t.s('static int sum2D', 'A 2D array is an array of row arrays.', ['arr2', 'M', 'int', m.map(r => r.map(String))], ['call', 'sum2D(int[][] m)', { m: '@M' }]);
        t.s('int total = 0;', '', ['v', 'total', '0']);
        m.forEach((r, i) => {
          t.s('for (int i = 0; i < m.length; i++) {', 'row ' + i, ['v', 'i', String(i)], ['ptr', 'M', 'i', i]);
          r.forEach((x, j) => {
            t.s('for (int j = 0; j < m[i].length; j++) {', 'j = ' + j + ' (row ' + i + ' has length ' + r.length + ')', ['v', 'j', String(j)], ['ptr', 'M', 'j', [i, j]]);
            total += x;
            t.s('total += m[i][j];', '', ['pr', x + ' '], ['v', 'total', String(total)], ['mark', 'M', [i, j], 'done']);
          });
          t.s('System.out.println();', '', ['vd', 'j'], ['ptr', 'M', 'j', null], ['p', '']);
        });
        t.s('return total;', '', ['vd', 'i'], ['ptr', 'M', 'i', null], ['p', 'Total = ' + total]);
      }
    }
  });

  // =============================== MEDIUM ===============================
  prob({
    id: 'p-reverse', level: 'medium', title: 'Reverse an array in place', short: 'Two pointers + swap', complexity: 'O(n), O(1) extra', cls: 'ReverseInPlace', imports: 'import java.util.Arrays;',
    prompt: '<p>Reverse the array without creating a second array.</p>',
    idea: '<p>Swap the first and last elements, then move both pointers inward. Stop when they meet.</p>',
    code: code`
static void reverse(int[] arr) {
    int left = 0, right = arr.length - 1;
    while (left < right) {
        int temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;
        left++;
        right--;
    }
}`,
    main: ['int[] arr = {1, 2, 3, 4, 5, 6, 7};', 'reverse(arr);', 'System.out.println(Arrays.toString(arr));'],
    output: '[7, 6, 5, 4, 3, 2, 1]',
    tips: ['A swap always needs a <code>temp</code>. <code>a = b; b = a;</code> loses a value.', 'Loop while <code>left &lt; right</code>. Going to the end would reverse it twice (back to the original).'],
    input: {
      fields: [arrField('1 2 3 4 5 6 7')],
      build(inp, t) {
        const a = nums(inp.arr);
        open(t, 'static void reverse', 'reverse(int[] arr)', a);
        let l = 0, r = a.length - 1;
        t.s('int left = 0, right = arr.length - 1;', '', ['v', 'left', '0'], ['v', 'right', String(r)], ['ptr', 'A', 'L', 0], ['ptr', 'A', 'R', r]);
        while (l < r) {
          t.s('while (left < right) {', l + ' < ' + r + ' ✓');
          const tmp = a[l];
          t.s('int temp = arr[left];', '', ['v', 'temp', String(tmp)]);
          a[l] = a[r]; t.s('arr[left] = arr[right];', '', ['f', 'A', l, String(a[l])]);
          a[r] = tmp; t.s('arr[right] = temp;', '', ['f', 'A', r, String(tmp)], ['mark', 'A', l, 'done'], ['mark', 'A', r, 'done']);
          l++; r--;
          t.s('right--;', 'Move inward.', ['v', 'left', String(l)], ['v', 'right', String(r)], ['ptr', 'A', 'L', l], ['ptr', 'A', 'R', r], ['vd', 'temp']);
        }
        t.s('while (left < right) {', l + ' < ' + r + '? no → done.', ['ptr', 'A', 'L', null], ['ptr', 'A', 'R', null], ['p', str(a)]);
      }
    }
  });

  prob({
    id: 'p-second-largest', level: 'medium', title: 'Second largest element', short: 'Track first and second in one pass', complexity: 'O(n)', cls: 'SecondLargest',
    prompt: '<p>Return the second largest <b>distinct</b> value.</p>',
    idea: '<p>Keep <code>first</code> and <code>second</code>. When a new maximum arrives, the old first moves down to second.</p>',
    code: code`
static int secondLargest(int[] arr) {
    int first = Integer.MIN_VALUE, second = Integer.MIN_VALUE;
    for (int x : arr) {
        if (x > first) {
            second = first;
            first = x;
        } else if (x > second && x != first) {
            second = x;
        }
    }
    return second;
}`,
    main: ['int[] arr = {12, 35, 1, 10, 34, 35, 1};', 'System.out.println("Second largest: " + secondLargest(arr));'],
    output: 'Second largest: 34',
    tips: ['Sorting and taking <code>arr[n-2]</code> is wrong when the maximum repeats (35, 35).'],
    input: {
      fields: [arrField('12 35 1 10 34 35 1')],
      build(inp, t) {
        const a = nums(inp.arr); const MIN = -2147483648;
        let f = MIN, s = MIN;
        open(t, 'static int secondLargest', 'secondLargest(int[] arr)', a);
        t.s('int first = Integer.MIN_VALUE', 'Start lower than any int.', ['v', 'first', String(f)], ['v', 'second', String(s)]);
        a.forEach((x, i) => {
          t.s('for (int x : arr) {', '', ['v', 'x', String(x)], ['ptr', 'A', 'x', i]);
          if (x > f) { s = f; f = x; t.s('first = x;', 'New max: old first (' + s + ') becomes second.', ['v', 'second', String(s)], ['v', 'first', String(f)]); }
          else if (x > s && x !== f) { s = x; t.s('second = x;', 'Between second and first.', ['v', 'second', String(s)]); }
          else t.s('} else if (x > second && x != first) {', 'No change.');
        });
        t.s('return second;', '', ['vd', 'x'], ['ptr', 'A', 'x', null], ['p', 'Second largest: ' + s]);
      }
    }
  });

  prob({
    id: 'p-remove-dup', level: 'medium', title: 'Remove duplicates from a sorted array', short: 'Write pointer k', complexity: 'O(n)', cls: 'RemoveDuplicates',
    prompt: '<p>The array is sorted. Move the unique values to the front and return how many there are.</p>',
    idea: '<p>In a sorted array, duplicates sit next to each other. <code>k</code> is where the next unique value should be written; compare each element with the last unique value <code>arr[k-1]</code>.</p>',
    code: code`
static int removeDuplicates(int[] arr) {
    if (arr.length == 0) return 0;
    int k = 1;
    for (int i = 1; i < arr.length; i++) {
        if (arr[i] != arr[k - 1]) {
            arr[k] = arr[i];
            k++;
        }
    }
    return k;
}`,
    main: ['int[] arr = {1, 1, 2, 3, 3, 3, 4, 5, 5};', 'int k = removeDuplicates(arr);', 'for (int i = 0; i < k; i++) System.out.print(arr[i] + " ");', 'System.out.println();'],
    output: '1 2 3 4 5 ',
    input: {
      fields: [arrField('1 1 2 3 3 3 4 5 5', 'Sorted array')],
      build(inp, t) {
        const a = nums(inp.arr).sort((x, y) => x - y);
        open(t, 'static int removeDuplicates', 'removeDuplicates(int[] arr)', a, null, 'Input sorted first (this algorithm needs sorted data).');
        let k = 1;
        t.s('int k = 1;', 'arr[0] is always unique.', ['v', 'k', '1'], ['ptr', 'A', 'k', 1], ['mark', 'A', 0, 'done']);
        for (let i = 1; i < a.length; i++) {
          t.s('for (int i = 1; i < arr.length; i++) {', '', ['v', 'i', String(i)], ['ptr', 'A', 'i', i]);
          if (a[i] !== a[k - 1]) {
            a[k] = a[i];
            t.s('arr[k] = arr[i];', a[i] + ' is new → write it at index ' + k, ['f', 'A', k, String(a[i])], ['mark', 'A', k, 'done']);
            k++;
            t.s('k++;', '', ['v', 'k', String(k)], ['ptr', 'A', 'k', k < a.length ? k : null]);
          } else t.s('if (arr[i] != arr[k - 1]) {', a[i] + ' is a duplicate → skip');
        }
        t.s('return k;', 'The first ' + k + ' cells are the answer (the rest is leftover).', ['ptr', 'A', 'i', null], ['ptr', 'A', 'k', null], ['vd', 'i'], ['p', a.slice(0, k).map(x => x + ' ').join('')]);
      }
    }
  });

  prob({
    id: 'p-rotate', level: 'medium', title: 'Rotate left by k positions', short: 'Index (i + k) % n', complexity: 'O(n)', cls: 'RotateLeft', imports: 'import java.util.Arrays;',
    prompt: '<p>Rotate the array to the left by k: {1,2,3,4,5} with k = 2 → {3,4,5,1,2}.</p>',
    idea: '<p>New position i takes the element that was k places to the right: <code>arr[(i + k) % n]</code>. The <code>%</code> wraps around the end.</p>',
    code: code`
static void rotateLeft(int[] arr, int k) {
    int n = arr.length;
    k = k % n;
    int[] temp = new int[n];
    for (int i = 0; i < n; i++) {
        temp[i] = arr[(i + k) % n];
    }
    for (int i = 0; i < n; i++) {
        arr[i] = temp[i];
    }
}`,
    main: ['int[] arr = {1, 2, 3, 4, 5, 6};', 'rotateLeft(arr, 2);', 'System.out.println(Arrays.toString(arr));'],
    output: '[3, 4, 5, 6, 1, 2]',
    tips: ['Right rotation by k = left rotation by n − k.', '<code>k = k % n</code> handles k larger than the array.'],
    input: {
      fields: [arrField('1 2 3 4 5 6'), { key: 'k', label: 'k', def: '2', short: true }],
      build(inp, t) {
        const a = nums(inp.arr), n = a.length; let k = nums(inp.k)[0];
        open(t, 'static void rotateLeft', 'rotateLeft(int[] arr, int k)', a, { k: String(k) });
        t.s('int n = arr.length;', '', ['v', 'n', String(n)]);
        k = ((k % n) + n) % n;
        t.s('k = k % n;', '', ['v', 'k', String(k)]);
        t.s('int[] temp = new int[n];', '', ['arr', 'T', 'int', Array(n).fill('0')], ['v', 'temp', '@T']);
        const tmp = [];
        for (let i = 0; i < n; i++) {
          const src = (i + k) % n; tmp[i] = a[src];
          t.s('temp[i] = arr[(i + k) % n];', 'temp[' + i + '] = arr[(' + i + ' + ' + k + ') % ' + n + '] = arr[' + src + ']', ['v', 'i', String(i)], ['ptr', 'T', 'i', i], ['ptr', 'A', 'src', src], ['f', 'T', i, String(tmp[i])]);
        }
        t.s('for (int i = 0; i < n; i++) {@2', 'Copy back.', ['ptr', 'A', 'src', null], ['ptr', 'T', 'i', null]);
        for (let i = 0; i < n; i++) t.s('arr[i] = temp[i];', '', ['v', 'i', String(i)], ['ptr', 'A', 'i', i], ['f', 'A', i, String(tmp[i])]);
        t.s('rotateLeft(int[] arr, int k) {', 'Done. The temp array becomes garbage after return.', ['ptr', 'A', 'i', null], ['vd', 'i'], ['p', str(tmp)]);
      }
    }
  });

  prob({
    id: 'p-merge', level: 'medium', title: 'Merge two sorted arrays', short: 'Three indices i, j, k', complexity: 'O(n + m)', cls: 'MergeSorted', imports: 'import java.util.Arrays;',
    prompt: '<p>Given two sorted arrays, return one sorted array containing all elements.</p>',
    idea: '<p>Compare the fronts of both arrays and take the smaller one. When one array runs out, copy the rest of the other.</p>',
    code: code`
static int[] merge(int[] a, int[] b) {
    int[] c = new int[a.length + b.length];
    int i = 0, j = 0, k = 0;
    while (i < a.length && j < b.length) {
        if (a[i] <= b[j]) {
            c[k++] = a[i++];
        } else {
            c[k++] = b[j++];
        }
    }
    while (i < a.length) c[k++] = a[i++];
    while (j < b.length) c[k++] = b[j++];
    return c;
}`,
    main: ['int[] a = {1, 4, 7, 9};', 'int[] b = {2, 3, 8};', 'System.out.println(Arrays.toString(merge(a, b)));'],
    output: '[1, 2, 3, 4, 7, 8, 9]',
    tips: ['<code>c[k++] = a[i++];</code> uses the old k and i, then increments both.'],
    input: {
      fields: [{ key: 'a', label: 'a (sorted)', def: '1 4 7 9' }, { key: 'b', label: 'b (sorted)', def: '2 3 8' }],
      build(inp, t) {
        const a = nums(inp.a).sort((x, y) => x - y), b = nums(inp.b).sort((x, y) => x - y);
        const c = Array(a.length + b.length).fill(0);
        t.s('static int[] merge', '', ['arr', 'A', 'int', a.map(String)], ['arr', 'B', 'int', b.map(String)], ['call', 'merge(int[] a, int[] b)', { a: '@A', b: '@B' }]);
        t.s('int[] c = new int[a.length + b.length];', '', ['arr', 'C', 'int', c.map(String)], ['v', 'c', '@C']);
        let i = 0, j = 0, k = 0;
        const ptrs = () => [['v', 'i', String(i)], ['v', 'j', String(j)], ['v', 'k', String(k)], ['ptr', 'A', 'i', i < a.length ? i : null], ['ptr', 'B', 'j', j < b.length ? j : null], ['ptr', 'C', 'k', k < c.length ? k : null]];
        t.s('int i = 0, j = 0, k = 0;', '', ...ptrs());
        while (i < a.length && j < b.length) {
          if (a[i] <= b[j]) { c[k] = a[i]; t.s('c[k++] = a[i++];', a[i] + ' ≤ ' + b[j] + ' → take from a', ['f', 'C', k, String(a[i])]); k++; i++; }
          else { c[k] = b[j]; t.s('c[k++] = b[j++];@1', a[i] + ' > ' + b[j] + ' → take from b', ['f', 'C', k, String(b[j])]); k++; j++; }
          t.s('while (i < a.length && j < b.length) {', '', ...ptrs());
        }
        while (i < a.length) { c[k] = a[i]; t.s('while (i < a.length) c[k++] = a[i++];', 'b is used up → copy the rest of a', ['f', 'C', k, String(a[i])]); k++; i++; t.s('while (i < a.length) c[k++] = a[i++];', '', ...ptrs()); }
        while (j < b.length) { c[k] = b[j]; t.s('while (j < b.length) c[k++] = b[j++];', 'a is used up → copy the rest of b', ['f', 'C', k, String(b[j])]); k++; j++; t.s('while (j < b.length) c[k++] = b[j++];', '', ...ptrs()); }
        t.s('return c;', '', ['p', str(c)]);
      }
    }
  });

  prob({
    id: 'p-binary-search', level: 'medium', title: 'Binary search', short: 'Halve the range each step', complexity: 'O(log n)', cls: 'BinarySearch',
    prompt: '<p>Search a <b>sorted</b> array for key and return its index, or -1.</p>',
    idea: '<p>Look at the middle element. If the key is bigger, it can only be in the right half; if smaller, in the left half. Each step throws away half the remaining range.</p>',
    code: code`
static int binarySearch(int[] arr, int key) {
    int low = 0, high = arr.length - 1;
    while (low <= high) {
        int mid = (low + high) / 2;
        if (arr[mid] == key) {
            return mid;
        } else if (arr[mid] < key) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return -1;
}`,
    main: ['int[] arr = {3, 8, 15, 21, 30, 42, 57, 64, 90};', 'System.out.println("Index: " + binarySearch(arr, 57));'],
    output: 'Index: 6',
    tips: ['Only works on sorted arrays.', 'The condition is <code>low &lt;= high</code> (with =), otherwise a 1-element range is never checked.'],
    input: {
      fields: [arrField('3 8 15 21 30 42 57 64 90', 'Sorted array'), { key: 'key', label: 'key', def: '57', short: true }],
      build(inp, t) {
        const a = nums(inp.arr).sort((x, y) => x - y), key = nums(inp.key)[0];
        open(t, 'static int binarySearch', 'binarySearch(int[] arr, int key)', a, { key: String(key) });
        let lo = 0, hi = a.length - 1;
        const shade = () => a.map((_, i) => ['mark', 'A', i, i < lo || i > hi ? 'done' : null]);
        t.s('int low = 0, high = arr.length - 1;', '', ['v', 'low', '0'], ['v', 'high', String(hi)], ['ptr', 'A', 'low', 0], ['ptr', 'A', 'high', hi]);
        while (lo <= hi) {
          const mid = Math.floor((lo + hi) / 2);
          t.s('int mid = (low + high) / 2;', '(' + lo + ' + ' + hi + ') / 2 = ' + mid + ' (integer division)', ['v', 'mid', String(mid)], ['ptr', 'A', 'mid', mid]);
          if (a[mid] === key) { t.s('return mid;', 'arr[' + mid + '] == ' + key + ' → found', ['mark', 'A', mid, 'hl2'], ['p', 'Index: ' + mid]); return; }
          if (a[mid] < key) { lo = mid + 1; t.s('low = mid + 1;', a[mid] + ' < ' + key + ' → discard the left half', ['v', 'low', String(lo)], ['ptr', 'A', 'low', lo < a.length ? lo : null], ...shade()); }
          else { hi = mid - 1; t.s('high = mid - 1;', a[mid] + ' > ' + key + ' → discard the right half', ['v', 'high', String(hi)], ['ptr', 'A', 'high', hi >= 0 ? hi : null], ...shade()); }
          t.s('while (low <= high) {', lo + ' <= ' + hi + (lo <= hi ? ' ✓' : ' ✗'), ['vd', 'mid'], ['ptr', 'A', 'mid', null]);
        }
        t.s('return -1;', 'Range is empty → not found.', ['p', 'Index: -1']);
      }
    }
  });

  function sortProb(o) { prob(Object.assign({ imports: 'import java.util.Arrays;' }, o)); }
  sortProb({
    id: 'p-bubble', level: 'medium', title: 'Bubble sort', short: 'Swap neighbours; the largest bubbles to the end', complexity: 'O(n²)', cls: 'BubbleSort',
    prompt: '<p>Sort the array in ascending order using bubble sort.</p>',
    idea: '<p>Compare each pair of neighbours and swap if they are out of order. After pass i, the largest i + 1 elements are in their final place at the end, so the inner loop can stop earlier (<code>n - 1 - i</code>).</p>',
    code: code`
static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`,
    main: ['int[] arr = {5, 1, 4, 2, 8};', 'bubbleSort(arr);', 'System.out.println(Arrays.toString(arr));'],
    output: '[1, 2, 4, 5, 8]',
    tips: ['For descending order, flip to <code>arr[j] &lt; arr[j + 1]</code>.'],
    input: {
      fields: [arrField('5 1 4 2 8')],
      build(inp, t) {
        const a = nums(inp.arr, { max: 8 }), n = a.length;
        open(t, 'static void bubbleSort', 'bubbleSort(int[] arr)', a);
        t.s('int n = arr.length;', '', ['v', 'n', String(n)]);
        for (let i = 0; i < n - 1; i++) {
          t.s('for (int i = 0; i < n - 1; i++) {', 'Pass ' + (i + 1), ['v', 'i', String(i)]);
          for (let j = 0; j < n - 1 - i; j++) {
            t.s('if (arr[j] > arr[j + 1]) {', 'Compare arr[' + j + ']=' + a[j] + ' and arr[' + (j + 1) + ']=' + a[j + 1], ['v', 'j', String(j)], ['ptr', 'A', 'j', j], ['ptr', 'A', 'j+1', j + 1]);
            if (a[j] > a[j + 1]) {
              const tmp = a[j]; a[j] = a[j + 1]; a[j + 1] = tmp;
              t.s('arr[j + 1] = temp;', 'Out of order → swap', ['f', 'A', j, String(a[j])], ['f', 'A', j + 1, String(a[j + 1])]);
            }
          }
          t.s('for (int j = 0; j < n - 1 - i; j++) {', 'End of pass: ' + a[n - 1 - i] + ' is in its final place.', ['vd', 'j'], ['ptr', 'A', 'j', null], ['ptr', 'A', 'j+1', null], ['mark', 'A', n - 1 - i, 'done']);
        }
        t.s('bubbleSort(int[] arr) {', 'Sorted.', ['vd', 'i'], ['mark', 'A', 0, 'done'], ['p', str(a)]);
      }
    }
  });

  sortProb({
    id: 'p-selection', level: 'medium', title: 'Selection sort', short: 'Find the min, swap it to the front', complexity: 'O(n²)', cls: 'SelectionSort',
    prompt: '<p>Sort ascending using selection sort.</p>',
    idea: '<p>For each position i, find the index of the smallest element in the unsorted part (i…n-1), then swap it into position i. At most one swap per pass.</p>',
    code: code`
static void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        int temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
    }
}`,
    main: ['int[] arr = {29, 10, 14, 37, 13};', 'selectionSort(arr);', 'System.out.println(Arrays.toString(arr));'],
    output: '[10, 13, 14, 29, 37]',
    input: {
      fields: [arrField('29 10 14 37 13')],
      build(inp, t) {
        const a = nums(inp.arr, { max: 8 }), n = a.length;
        open(t, 'static void selectionSort', 'selectionSort(int[] arr)', a);
        t.s('int n = arr.length;', '', ['v', 'n', String(n)]);
        for (let i = 0; i < n - 1; i++) {
          let m = i;
          t.s('int minIdx = i;', 'Position ' + i + ': assume the smallest is here.', ['v', 'i', String(i)], ['ptr', 'A', 'i', i], ['v', 'minIdx', String(i)], ['ptr', 'A', 'min', i]);
          for (let j = i + 1; j < n; j++) {
            t.s('if (arr[j] < arr[minIdx]) {', a[j] + ' < ' + a[m] + '?', ['v', 'j', String(j)], ['ptr', 'A', 'j', j]);
            if (a[j] < a[m]) { m = j; t.s('minIdx = j;', 'New smallest.', ['v', 'minIdx', String(m)], ['ptr', 'A', 'min', m]); }
          }
          const tmp = a[i]; a[i] = a[m]; a[m] = tmp;
          t.s('arr[minIdx] = temp;', 'Swap arr[' + i + '] and arr[' + m + '].', ['vd', 'j'], ['ptr', 'A', 'j', null], ['f', 'A', i, String(a[i])], ['f', 'A', m, String(a[m])], ['mark', 'A', i, 'done']);
        }
        t.s('selectionSort(int[] arr) {', 'Sorted.', ['ptr', 'A', 'i', null], ['ptr', 'A', 'min', null], ['mark', 'A', n - 1, 'done'], ['p', str(a)]);
      }
    }
  });

  sortProb({
    id: 'p-insertion', level: 'medium', title: 'Insertion sort', short: 'Shift bigger elements right, insert key', complexity: 'O(n²), fast when nearly sorted', cls: 'InsertionSort',
    prompt: '<p>Sort ascending using insertion sort.</p>',
    idea: '<p>The left part is always sorted. Take the next element (key), shift every bigger element one step right, and drop key into the gap.</p>',
    code: code`
static void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
    main: ['int[] arr = {12, 11, 13, 5, 6};', 'insertionSort(arr);', 'System.out.println(Arrays.toString(arr));'],
    output: '[5, 6, 11, 12, 13]',
    input: {
      fields: [arrField('12 11 13 5 6')],
      build(inp, t) {
        const a = nums(inp.arr, { max: 8 });
        open(t, 'static void insertionSort', 'insertionSort(int[] arr)', a);
        for (let i = 1; i < a.length; i++) {
          const key = a[i]; let j = i - 1;
          t.s('int key = arr[i];', 'Insert ' + key + ' into the sorted part arr[0..' + (i - 1) + '].', ['v', 'i', String(i)], ['ptr', 'A', 'i', i], ['v', 'key', String(key)]);
          t.s('int j = i - 1;', '', ['v', 'j', String(j)], ['ptr', 'A', 'j', j]);
          while (j >= 0 && a[j] > key) {
            a[j + 1] = a[j];
            t.s('arr[j + 1] = arr[j];', a[j] + ' > ' + key + ' → shift right', ['f', 'A', j + 1, String(a[j])]);
            j--;
            t.s('j--;', '', ['v', 'j', String(j)], ['ptr', 'A', 'j', j >= 0 ? j : null]);
          }
          a[j + 1] = key;
          t.s('arr[j + 1] = key;', 'Drop ' + key + ' at index ' + (j + 1), ['f', 'A', j + 1, String(key)], ['ptr', 'A', 'j', null]);
        }
        t.s('insertionSort(int[] arr) {', 'Sorted.', ['ptr', 'A', 'i', null], ['p', str(a)]);
      }
    }
  });

  prob({
    id: 'p-row-col', level: 'medium', title: 'Row sums and column sums', short: 'Swap loop order for columns', complexity: 'O(rows × cols)', cls: 'RowColSums',
    prompt: '<p>Print the sum of every row and every column of a rectangular matrix.</p>',
    idea: '<p>Row sums: outer loop on rows. Column sums: outer loop on <b>columns</b> (<code>m[0].length</code>), inner loop on rows. Reset the sum inside the outer loop.</p>',
    code: code`
static void rowColSums(int[][] m) {
    for (int i = 0; i < m.length; i++) {
        int rowSum = 0;
        for (int j = 0; j < m[i].length; j++) {
            rowSum += m[i][j];
        }
        System.out.println("Row " + i + " sum = " + rowSum);
    }
    for (int j = 0; j < m[0].length; j++) {
        int colSum = 0;
        for (int i = 0; i < m.length; i++) {
            colSum += m[i][j];
        }
        System.out.println("Col " + j + " sum = " + colSum);
    }
}`,
    main: ['int[][] m = {{1, 2, 3}, {4, 5, 6}};', 'rowColSums(m);'],
    output: 'Row 0 sum = 6\nRow 1 sum = 15\nCol 0 sum = 5\nCol 1 sum = 7\nCol 2 sum = 9',
    tips: ['Declaring <code>int rowSum = 0;</code> <b>outside</b> the outer loop is the classic bug: the sums accumulate across rows.'],
    input: {
      fields: [{ key: 'm', label: 'Matrix (; between rows)', def: '1 2 3; 4 5 6' }],
      build(inp, t) {
        const m = matrix(inp.m);
        if (m.some(r => r.length !== m[0].length)) throw new Error('Rows must all have the same length for column sums.');
        t.s('static void rowColSums', '', ['arr2', 'M', 'int', m.map(r => r.map(String))], ['call', 'rowColSums(int[][] m)', { m: '@M' }]);
        m.forEach((r, i) => {
          let s = 0;
          t.s('int rowSum = 0;', 'Row ' + i, ['v', 'i', String(i)], ['v', 'rowSum', '0'], ['ptr', 'M', 'i', i]);
          r.forEach((x, j) => { s += x; t.s('rowSum += m[i][j];', '', ['v', 'j', String(j)], ['ptr', 'M', 'j', [i, j]], ['v', 'rowSum', String(s)]); });
          t.s('System.out.println("Row "', '', ['vd', 'j'], ['ptr', 'M', 'j', null], ['p', 'Row ' + i + ' sum = ' + s]);
        });
        t.s('for (int j = 0; j < m[0].length; j++) {', 'Now columns: j is the OUTER loop.', ['vd', 'i'], ['vd', 'rowSum'], ['ptr', 'M', 'i', null]);
        for (let j = 0; j < m[0].length; j++) {
          let s = 0;
          t.s('int colSum = 0;', 'Column ' + j, ['v', 'j', String(j)], ['v', 'colSum', '0']);
          m.forEach((r, i) => { s += r[j]; t.s('colSum += m[i][j];', '', ['v', 'i', String(i)], ['ptr', 'M', 'j', [i, j]], ['v', 'colSum', String(s)]); });
          t.s('System.out.println("Col "', '', ['vd', 'i'], ['p', 'Col ' + j + ' sum = ' + s]);
        }
      }
    }
  });

  prob({
    id: 'p-transpose', level: 'medium', title: 'Transpose a matrix', short: 't[j][i] = m[i][j]', complexity: 'O(rows × cols)', cls: 'Transpose', imports: 'import java.util.Arrays;',
    prompt: '<p>Return the transpose (rows become columns) of an r × c matrix. The result is c × r.</p>',
    idea: '<p>Allocate <code>new int[cols][rows]</code> (dimensions swapped), then copy each element to the mirrored position.</p>',
    code: code`
static int[][] transpose(int[][] m) {
    int rows = m.length, cols = m[0].length;
    int[][] t = new int[cols][rows];
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            t[j][i] = m[i][j];
        }
    }
    return t;
}`,
    main: ['int[][] m = {{1, 2, 3}, {4, 5, 6}};', 'System.out.println(Arrays.deepToString(transpose(m)));'],
    output: '[[1, 4], [2, 5], [3, 6]]',
    input: {
      fields: [{ key: 'm', label: 'Matrix (; between rows)', def: '1 2 3; 4 5 6' }],
      build(inp, t) {
        const m = matrix(inp.m), R = m.length, C = m[0].length;
        if (m.some(r => r.length !== C)) throw new Error('Rows must all have the same length.');
        const T = Array.from({ length: C }, () => Array(R).fill(0));
        t.s('static int[][] transpose', '', ['arr2', 'M', 'int', m.map(r => r.map(String))], ['call', 'transpose(int[][] m)', { m: '@M' }]);
        t.s('int rows = m.length, cols = m[0].length;', '', ['v', 'rows', String(R)], ['v', 'cols', String(C)]);
        t.s('int[][] t = new int[cols][rows];', 'Note the swapped dimensions: ' + C + ' × ' + R, ['arr2', 'T', 'int', T.map(r => r.map(String))], ['v', 't', '@T']);
        for (let i = 0; i < R; i++) for (let j = 0; j < C; j++) {
          T[j][i] = m[i][j];
          t.s('t[j][i] = m[i][j];', 't[' + j + '][' + i + '] = m[' + i + '][' + j + '] = ' + m[i][j], ['v', 'i', String(i)], ['v', 'j', String(j)], ['ptr', 'M', 'm', [i, j]], ['ptr', 'T', 't', [j, i]], ['f', 'T', [j, i], String(m[i][j])]);
        }
        t.s('return t;', '', ['ptr', 'M', 'm', null], ['ptr', 'T', 't', null], ['p', '[' + T.map(str).join(', ') + ']']);
      }
    }
  });

  prob({
    id: 'p-diagonal', level: 'medium', title: 'Main and anti-diagonal sums', short: 'm[i][i] and m[i][n-1-i]', complexity: 'O(n)', cls: 'Diagonals',
    prompt: '<p>For a square matrix, print the sum of the main diagonal (top-left → bottom-right) and the anti-diagonal (top-right → bottom-left).</p>',
    idea: '<p>Only one loop is needed: on row i, the main diagonal is column i, and the anti-diagonal is column n − 1 − i.</p>',
    code: code`
static void diagonalSums(int[][] m) {
    int n = m.length;
    int primary = 0, secondary = 0;
    for (int i = 0; i < n; i++) {
        primary += m[i][i];
        secondary += m[i][n - 1 - i];
    }
    System.out.println("Main diagonal: " + primary);
    System.out.println("Anti diagonal: " + secondary);
}`,
    main: ['int[][] m = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};', 'diagonalSums(m);'],
    output: 'Main diagonal: 15\nAnti diagonal: 15',
    input: {
      fields: [{ key: 'm', label: 'Square matrix', def: '1 2 3; 4 5 6; 7 8 9' }],
      build(inp, t) {
        const m = matrix(inp.m), n = m.length;
        if (m.some(r => r.length !== n)) throw new Error('The matrix must be square (n rows of n numbers).');
        t.s('static void diagonalSums', '', ['arr2', 'M', 'int', m.map(r => r.map(String))], ['call', 'diagonalSums(int[][] m)', { m: '@M' }]);
        t.s('int n = m.length;', '', ['v', 'n', String(n)]);
        let p = 0, s = 0;
        t.s('int primary = 0, secondary = 0;', '', ['v', 'primary', '0'], ['v', 'secondary', '0']);
        for (let i = 0; i < n; i++) {
          p += m[i][i];
          t.s('primary += m[i][i];', 'm[' + i + '][' + i + '] = ' + m[i][i], ['v', 'i', String(i)], ['ptr', 'M', 'd', [i, i]], ['v', 'primary', String(p)], ['mark', 'M', [i, i], 'done']);
          s += m[i][n - 1 - i];
          t.s('secondary += m[i][n - 1 - i];', 'm[' + i + '][' + (n - 1 - i) + '] = ' + m[i][n - 1 - i], ['ptr', 'M', 'a', [i, n - 1 - i]], ['v', 'secondary', String(s)], ['mark', 'M', [i, n - 1 - i], 'hl2']);
        }
        t.s('System.out.println("Main diagonal: " + primary);', '', ['ptr', 'M', 'd', null], ['ptr', 'M', 'a', null], ['vd', 'i'], ['p', 'Main diagonal: ' + p]);
        t.s('System.out.println("Anti diagonal: " + secondary);', '', ['p', 'Anti diagonal: ' + s]);
      }
    }
  });

  prob({
    id: 'p-palindrome', level: 'medium', title: 'Is the array a palindrome?', short: 'Compare from both ends', complexity: 'O(n)', cls: 'PalindromeArray',
    prompt: '<p>Return true if the array reads the same forwards and backwards.</p>',
    idea: '<p>Same two pointers as reverse-in-place, but compare instead of swapping. Return false at the first mismatch.</p>',
    code: code`
static boolean isPalindrome(int[] arr) {
    int i = 0, j = arr.length - 1;
    while (i < j) {
        if (arr[i] != arr[j]) {
            return false;
        }
        i++;
        j--;
    }
    return true;
}`,
    main: ['int[] arr = {1, 3, 5, 3, 1};', 'System.out.println(isPalindrome(arr));'],
    output: 'true',
    input: {
      fields: [arrField('1 3 5 3 1')],
      build(inp, t) {
        const a = nums(inp.arr);
        open(t, 'static boolean isPalindrome', 'isPalindrome(int[] arr)', a);
        let i = 0, j = a.length - 1;
        t.s('int i = 0, j = arr.length - 1;', '', ['v', 'i', '0'], ['v', 'j', String(j)], ['ptr', 'A', 'i', 0], ['ptr', 'A', 'j', j]);
        while (i < j) {
          if (a[i] !== a[j]) { t.s('return false;', a[i] + ' ≠ ' + a[j] + ' → not a palindrome', ['mark', 'A', i, 'hl2'], ['mark', 'A', j, 'hl2'], ['p', 'false']); return; }
          t.s('if (arr[i] != arr[j]) {', a[i] + ' == ' + a[j] + ' ✓', ['mark', 'A', i, 'done'], ['mark', 'A', j, 'done']);
          i++; j--;
          t.s('j--;', '', ['v', 'i', String(i)], ['v', 'j', String(j)], ['ptr', 'A', 'i', i], ['ptr', 'A', 'j', j]);
        }
        t.s('return true;', 'Pointers met with no mismatch.', ['ptr', 'A', 'i', null], ['ptr', 'A', 'j', null], ['p', 'true']);
      }
    }
  });

  // =============================== HARD ===============================
  prob({
    id: 'p-matmul', level: 'hard', title: 'Matrix multiplication', short: 'Triple loop, c[i][j] += a[i][k]·b[k][j]', complexity: 'O(n·m·p)', cls: 'MatrixMultiply', imports: 'import java.util.Arrays;',
    prompt: '<p>Multiply an n × p matrix a by a p × m matrix b. The result is n × m.</p>',
    idea: '<p>c[i][j] is the dot product of <b>row i of a</b> with <b>column j of b</b>. The inner k loop walks along both. Multiplication is only possible when a’s column count equals b’s row count.</p>',
    code: code`
static int[][] multiply(int[][] a, int[][] b) {
    int n = a.length, m = b[0].length, p = b.length;
    int[][] c = new int[n][m];
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            for (int k = 0; k < p; k++) {
                c[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    return c;
}`,
    main: ['int[][] a = {{1, 2}, {3, 4}};', 'int[][] b = {{5, 6}, {7, 8}};', 'System.out.println(Arrays.deepToString(multiply(a, b)));'],
    output: '[[19, 22], [43, 50]]',
    tips: ['Check <code>a[0].length == b.length</code> before multiplying.', 'Java zero-fills <code>new int[n][m]</code>, so <code>+=</code> starts from 0.'],
    input: {
      fields: [{ key: 'a', label: 'a', def: '1 2; 3 4' }, { key: 'b', label: 'b', def: '5 6; 7 8' }],
      build(inp, t) {
        const a = matrix(inp.a, { max: 4 }), b = matrix(inp.b, { max: 4 });
        if (a.some(r => r.length !== a[0].length) || b.some(r => r.length !== b[0].length)) throw new Error('Both matrices must be rectangular.');
        if (a[0].length !== b.length) throw new Error('a has ' + a[0].length + ' columns but b has ' + b.length + ' rows; they must match.');
        if (a.length > 4 || b.length > 4) throw new Error('Keep it to at most 4 rows each.');
        const n = a.length, m = b[0].length, p = b.length, c = Array.from({ length: n }, () => Array(m).fill(0));
        t.s('static int[][] multiply', '', ['arr2', 'X', 'int', a.map(r => r.map(String))], ['arr2', 'Y', 'int', b.map(r => r.map(String))], ['call', 'multiply(int[][] a, int[][] b)', { a: '@X', b: '@Y' }]);
        t.s('int n = a.length', '', ['v', 'n', String(n)], ['v', 'm', String(m)], ['v', 'p', String(p)]);
        t.s('int[][] c = new int[n][m];', '', ['arr2', 'Z', 'int', c.map(r => r.map(String))], ['v', 'c', '@Z']);
        for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
          t.s('for (int j = 0; j < m; j++) {', 'c[' + i + '][' + j + '] = row ' + i + ' of a · column ' + j + ' of b', ['v', 'i', String(i)], ['v', 'j', String(j)], ['ptr', 'Z', 'c', [i, j]]);
          for (let k = 0; k < p; k++) {
            c[i][j] += a[i][k] * b[k][j];
            t.s('c[i][j] += a[i][k] * b[k][j];', a[i][k] + ' × ' + b[k][j] + ' added → ' + c[i][j], ['v', 'k', String(k)], ['ptr', 'X', 'k', [i, k]], ['ptr', 'Y', 'k', [k, j]], ['f', 'Z', [i, j], String(c[i][j])]);
          }
          t.s('for (int k = 0; k < p; k++) {', 'Done with c[' + i + '][' + j + '].', ['vd', 'k'], ['ptr', 'X', 'k', null], ['ptr', 'Y', 'k', null], ['mark', 'Z', [i, j], 'done']);
        }
        t.s('return c;', '', ['ptr', 'Z', 'c', null], ['p', '[' + c.map(str).join(', ') + ']']);
      }
    }
  });

  prob({
    id: 'p-kadane', level: 'hard', title: 'Maximum subarray sum (Kadane)', short: 'Extend or restart', complexity: 'O(n)', cls: 'Kadane',
    prompt: '<p>Find the largest sum of a contiguous subarray. Example: {-2, 1, -3, 4, -1, 2, 1, -5, 4} → 6 (from 4, -1, 2, 1).</p>',
    idea: '<p>At each element, decide: is it better to <b>extend</b> the current subarray (<code>current + arr[i]</code>) or <b>restart</b> from this element (<code>arr[i]</code>)? Keep the best value seen so far.</p>',
    code: code`
static int maxSubarraySum(int[] arr) {
    int best = arr[0];
    int current = arr[0];
    for (int i = 1; i < arr.length; i++) {
        current = Math.max(arr[i], current + arr[i]);
        best = Math.max(best, current);
    }
    return best;
}`,
    main: ['int[] arr = {-2, 1, -3, 4, -1, 2, 1, -5, 4};', 'System.out.println("Max subarray sum: " + maxSubarraySum(arr));'],
    output: 'Max subarray sum: 6',
    tips: ['The brute-force version (two nested loops over every start/end) is O(n²) and also acceptable in an exam if you are short on time.'],
    input: {
      fields: [arrField('-2 1 -3 4 -1 2 1 -5 4')],
      build(inp, t) {
        const a = nums(inp.arr);
        open(t, 'static int maxSubarraySum', 'maxSubarraySum(int[] arr)', a);
        let best = a[0], cur = a[0], start = 0, bs = 0, be = 0;
        t.s('int best = arr[0];', '', ['v', 'best', String(best)]);
        t.s('int current = arr[0];', '', ['v', 'current', String(cur)], ['mark', 'A', 0, 'hl2']);
        for (let i = 1; i < a.length; i++) {
          const ext = cur + a[i];
          if (a[i] > ext) { cur = a[i]; start = i; } else cur = ext;
          const marks = a.map((_, k) => ['mark', 'A', k, k >= start && k <= i ? 'hl2' : null]);
          t.s('current = Math.max(arr[i], current + arr[i]);', 'restart with ' + a[i] + ' or extend to ' + ext + '? → ' + (cur === a[i] && start === i ? 'restart' : 'extend') + ' (current = ' + cur + ')', ['v', 'i', String(i)], ['ptr', 'A', 'i', i], ['v', 'current', String(cur)], ...marks);
          if (cur > best) { best = cur; bs = start; be = i; }
          t.s('best = Math.max(best, current);', 'best = ' + best, ['v', 'best', String(best)]);
        }
        t.s('return best;', 'Best subarray: indices ' + bs + '…' + be, ['ptr', 'A', 'i', null], ['vd', 'i'], ...a.map((_, k) => ['mark', 'A', k, k >= bs && k <= be ? 'done' : null]), ['p', 'Max subarray sum: ' + best]);
      }
    }
  });

  prob({
    id: 'p-two-sum', level: 'hard', title: 'All pairs that add up to a target', short: 'j starts at i + 1', complexity: 'O(n²)', cls: 'PairSum',
    prompt: '<p>Print every pair of elements (different positions) whose sum equals target, or "No pair".</p>',
    idea: '<p>Try every pair once: the inner loop starts at <code>i + 1</code>, so you never pair an element with itself and never print (a, b) and (b, a) twice.</p>',
    code: code`
static void printPairs(int[] arr, int target) {
    boolean found = false;
    for (int i = 0; i < arr.length; i++) {
        for (int j = i + 1; j < arr.length; j++) {
            if (arr[i] + arr[j] == target) {
                System.out.println("(" + arr[i] + ", " + arr[j] + ")");
                found = true;
            }
        }
    }
    if (!found) System.out.println("No pair");
}`,
    main: ['int[] arr = {2, 7, 4, 5, 11, 3};', 'printPairs(arr, 9);'],
    output: '(2, 7)\n(4, 5)',
    input: {
      fields: [arrField('2 7 4 5 11 3'), { key: 'k', label: 'target', def: '9', short: true }],
      build(inp, t) {
        const a = nums(inp.arr, { max: 8 }), target = nums(inp.k)[0]; let found = false;
        open(t, 'static void printPairs', 'printPairs(int[] arr, int target)', a, { target: String(target) });
        t.s('boolean found = false;', '', ['v', 'found', 'false']);
        for (let i = 0; i < a.length; i++) {
          t.s('for (int i = 0; i < arr.length; i++) {', '', ['v', 'i', String(i)], ['ptr', 'A', 'i', i]);
          for (let j = i + 1; j < a.length; j++) {
            if (a[i] + a[j] === target) {
              found = true;
              t.s('System.out.println("(" + arr[i]', a[i] + ' + ' + a[j] + ' = ' + target + ' ✓', ['v', 'j', String(j)], ['ptr', 'A', 'j', j], ['p', '(' + a[i] + ', ' + a[j] + ')'], ['v', 'found', 'true']);
            } else t.s('if (arr[i] + arr[j] == target) {', a[i] + ' + ' + a[j] + ' = ' + (a[i] + a[j]), ['v', 'j', String(j)], ['ptr', 'A', 'j', j]);
          }
          t.s('for (int j = i + 1; j < arr.length; j++) {', '', ['vd', 'j'], ['ptr', 'A', 'j', null]);
        }
        t.s('if (!found) System.out.println("No pair");', '', ['vd', 'i'], ['ptr', 'A', 'i', null], ...(found ? [] : [['p', 'No pair']]));
      }
    }
  });

  prob({
    id: 'p-move-zeros', level: 'hard', title: 'Move all zeros to the end (keep order)', short: 'Write pointer + swap', complexity: 'O(n)', cls: 'MoveZeros', imports: 'import java.util.Arrays;',
    prompt: '<p>Move every 0 to the end while keeping the order of the non-zero elements: {0, 1, 0, 3, 12} → {1, 3, 12, 0, 0}.</p>',
    idea: '<p><code>k</code> marks where the next non-zero element should go. Each time you see a non-zero, swap it into position k and advance k.</p>',
    code: code`
static void moveZeros(int[] arr) {
    int k = 0;
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] != 0) {
            int temp = arr[k];
            arr[k] = arr[i];
            arr[i] = temp;
            k++;
        }
    }
}`,
    main: ['int[] arr = {0, 1, 0, 3, 12};', 'moveZeros(arr);', 'System.out.println(Arrays.toString(arr));'],
    output: '[1, 3, 12, 0, 0]',
    input: {
      fields: [arrField('0 1 0 3 12')],
      build(inp, t) {
        const a = nums(inp.arr);
        open(t, 'static void moveZeros', 'moveZeros(int[] arr)', a);
        let k = 0;
        t.s('int k = 0;', '', ['v', 'k', '0'], ['ptr', 'A', 'k', 0]);
        for (let i = 0; i < a.length; i++) {
          t.s('for (int i = 0; i < arr.length; i++) {', '', ['v', 'i', String(i)], ['ptr', 'A', 'i', i]);
          if (a[i] !== 0) {
            const tmp = a[k]; a[k] = a[i]; a[i] = tmp;
            t.s('arr[i] = temp;', 'Non-zero ' + a[k] + ' → swap into position ' + k, ['f', 'A', k, String(a[k])], ['f', 'A', i, String(a[i])], ['mark', 'A', k, 'done']);
            k++;
            t.s('k++;', '', ['v', 'k', String(k)], ['ptr', 'A', 'k', k < a.length ? k : null]);
          } else t.s('if (arr[i] != 0) {', 'zero → skip');
        }
        t.s('moveZeros(int[] arr) {', '', ['ptr', 'A', 'i', null], ['ptr', 'A', 'k', null], ['vd', 'i'], ['p', str(a)]);
      }
    }
  });

  prob({
    id: 'p-frequency', level: 'hard', title: 'Frequency of every element', short: 'boolean[] counted to skip repeats', complexity: 'O(n²)', cls: 'Frequencies',
    prompt: '<p>Print how many times each distinct element occurs, in order of first appearance.</p>',
    idea: '<p>For each element not yet counted, count its later copies and mark those copies as counted, so they aren’t reported again.</p>',
    code: code`
static void frequencies(int[] arr) {
    boolean[] counted = new boolean[arr.length];
    for (int i = 0; i < arr.length; i++) {
        if (counted[i]) continue;
        int count = 1;
        for (int j = i + 1; j < arr.length; j++) {
            if (arr[j] == arr[i]) {
                count++;
                counted[j] = true;
            }
        }
        System.out.println(arr[i] + " appears " + count + " time(s)");
    }
}`,
    main: ['int[] arr = {4, 2, 4, 5, 2, 4};', 'frequencies(arr);'],
    output: '4 appears 3 time(s)\n2 appears 2 time(s)\n5 appears 1 time(s)',
    tips: ['A <code>boolean[]</code> is filled with <code>false</code> by default.'],
    input: {
      fields: [arrField('4 2 4 5 2 4')],
      build(inp, t) {
        const a = nums(inp.arr, { max: 10 }); const cnt = a.map(() => false);
        open(t, 'static void frequencies', 'frequencies(int[] arr)', a);
        t.s('boolean[] counted = new boolean[arr.length];', 'All false by default.', ['arr', 'B', 'boolean', cnt.map(String)], ['v', 'counted', '@B']);
        for (let i = 0; i < a.length; i++) {
          t.s('for (int i = 0; i < arr.length; i++) {@1', '', ['v', 'i', String(i)], ['ptr', 'A', 'i', i], ['ptr', 'B', 'i', i]);
          if (cnt[i]) { t.s('if (counted[i]) continue;', 'Already counted → skip'); continue; }
          let c = 1;
          t.s('int count = 1;', 'Counting ' + a[i], ['v', 'count', '1'], ['mark', 'A', i, 'hl2']);
          for (let j = i + 1; j < a.length; j++) {
            if (a[j] === a[i]) {
              c++; cnt[j] = true;
              t.s('counted[j] = true;', 'Another ' + a[i] + ' at index ' + j, ['v', 'j', String(j)], ['ptr', 'A', 'j', j], ['v', 'count', String(c)], ['f', 'B', j, 'true'], ['mark', 'A', j, 'done']);
            } else t.s('if (arr[j] == arr[i]) {', '', ['v', 'j', String(j)], ['ptr', 'A', 'j', j]);
          }
          t.s('System.out.println(arr[i] + " appears "', '', ['vd', 'j'], ['ptr', 'A', 'j', null], ['p', a[i] + ' appears ' + c + ' time(s)'], ['mark', 'A', i, 'done']);
        }
      }
    }
  });

  prob({
    id: 'p-spiral', level: 'hard', title: 'Print a matrix in spiral order', short: 'Shrink four boundaries', complexity: 'O(rows × cols)', cls: 'Spiral',
    prompt: '<p>Print the elements in clockwise spiral order, starting at the top-left.</p>',
    idea: '<p>Keep four boundaries: top, bottom, left, right. Walk right along the top row, down the right column, left along the bottom row, and up the left column. Shrink the boundary after each walk.</p>',
    code: code`
static void spiral(int[][] m) {
    int top = 0, bottom = m.length - 1;
    int left = 0, right = m[0].length - 1;
    while (top <= bottom && left <= right) {
        for (int j = left; j <= right; j++) System.out.print(m[top][j] + " ");
        top++;
        for (int i = top; i <= bottom; i++) System.out.print(m[i][right] + " ");
        right--;
        if (top <= bottom) {
            for (int j = right; j >= left; j--) System.out.print(m[bottom][j] + " ");
            bottom--;
        }
        if (left <= right) {
            for (int i = bottom; i >= top; i--) System.out.print(m[i][left] + " ");
            left++;
        }
    }
    System.out.println();
}`,
    main: ['int[][] m = {{1, 2, 3, 4}, {5, 6, 7, 8}, {9, 10, 11, 12}};', 'spiral(m);'],
    output: '1 2 3 4 8 12 11 10 9 5 6 7 ',
    input: {
      fields: [{ key: 'm', label: 'Matrix', def: '1 2 3 4; 5 6 7 8; 9 10 11 12' }],
      build(inp, t) {
        const m = matrix(inp.m);
        if (m.some(r => r.length !== m[0].length)) throw new Error('Rows must all have the same length.');
        t.s('static void spiral', '', ['arr2', 'M', 'int', m.map(r => r.map(String))], ['call', 'spiral(int[][] m)', { m: '@M' }]);
        let top = 0, bottom = m.length - 1, left = 0, right = m[0].length - 1;
        const bounds = () => [['v', 'top', String(top)], ['v', 'bottom', String(bottom)], ['v', 'left', String(left)], ['v', 'right', String(right)]];
        t.s('int left = 0, right = m[0].length - 1;', '', ...bounds());
        const visit = (line, note, i, j) => t.s(line, note, ['pr', m[i][j] + ' '], ['ptr', 'M', '•', [i, j]], ['mark', 'M', [i, j], 'done']);
        while (top <= bottom && left <= right) {
          for (let j = left; j <= right; j++) visit('for (int j = left; j <= right; j++)', '→ along row ' + top, top, j);
          top++; t.s('top++;', '', ...bounds());
          for (let i = top; i <= bottom; i++) visit('for (int i = top; i <= bottom; i++)', '↓ down column ' + right, i, right);
          right--; t.s('right--;', '', ...bounds());
          if (top <= bottom) {
            for (let j = right; j >= left; j--) visit('for (int j = right; j >= left; j--)', '← along row ' + bottom, bottom, j);
            bottom--; t.s('bottom--;', '', ...bounds());
          }
          if (left <= right) {
            for (let i = bottom; i >= top; i--) visit('for (int i = bottom; i >= top; i--)', '↑ up column ' + left, i, left);
            left++; t.s('left++;', '', ...bounds());
          }
        }
        t.s('System.out.println();', 'Boundaries crossed → done.', ['ptr', 'M', '•', null], ['p', '']);
      }
    }
  });

  prob({
    id: 'p-missing', level: 'hard', title: 'Find the missing number in 1…n', short: 'Expected sum − actual sum', complexity: 'O(n)', cls: 'MissingNumber',
    prompt: '<p>The array contains every number from 1 to n except one (in any order). Find the missing one.</p>',
    idea: '<p>1 + 2 + … + n = n(n + 1)/2. Subtract the actual sum; what is left is the missing number. The array has n − 1 elements, so <code>n = arr.length + 1</code>.</p>',
    code: code`
static int findMissing(int[] arr) {
    int n = arr.length + 1;
    int expected = n * (n + 1) / 2;
    int actual = 0;
    for (int x : arr) {
        actual += x;
    }
    return expected - actual;
}`,
    main: ['int[] arr = {3, 7, 1, 2, 8, 4, 5};', 'System.out.println("Missing: " + findMissing(arr));'],
    output: 'Missing: 6',
    input: {
      fields: [arrField('3 7 1 2 8 4 5', '1…n with one missing')],
      build(inp, t) {
        const a = nums(inp.arr);
        open(t, 'static int findMissing', 'findMissing(int[] arr)', a);
        const n = a.length + 1, exp = n * (n + 1) / 2;
        t.s('int n = arr.length + 1;', '', ['v', 'n', String(n)]);
        t.s('int expected = n * (n + 1) / 2;', n + ' × ' + (n + 1) + ' / 2', ['v', 'expected', String(exp)]);
        let s = 0;
        t.s('int actual = 0;', '', ['v', 'actual', '0']);
        a.forEach((x, i) => { s += x; t.s('actual += x;', '', ['v', 'x', String(x)], ['ptr', 'A', 'x', i], ['v', 'actual', String(s)]); });
        t.s('return expected - actual;', exp + ' − ' + s, ['vd', 'x'], ['ptr', 'A', 'x', null], ['p', 'Missing: ' + (exp - s)]);
      }
    }
  });

  // ---- arrays of objects ----
  const studentClass = code`
class Student {
    String name;
    double cgpa;
    Student(String name, double cgpa) {
        this.name = name;
        this.cgpa = cgpa;
    }
}`;
  function readStudents(inp) {
    const names = inp.names.split(/[\s,]+/).filter(Boolean), cg = nums(inp.cgpas, { max: 6 });
    if (names.length !== cg.length) throw new Error('Give the same number of names and CGPAs.');
    return names.map((n, i) => [n, cg[i]]);
  }
  function makeStudents(t, list, line) {
    const ops = list.map((s, i) => ['new', 's' + i, 'Student', { name: '"' + s[0] + '"', cgpa: fmt(s[1]) }]);
    t.s(line, 'An array of references: each cell points to a Student object.', ...ops, ['arr', 'L', 'Student', list.map((_, i) => '@s' + i)]);
  }
  prob({
    id: 'p-top-student', level: 'hard', title: 'Student with the highest CGPA (array of objects)', short: 'Keep a reference to the best object', mid: 'Fall 2025 / Summer 2020', complexity: 'O(n)', cls: 'TopStudent',
    prompt: '<p>Given <code>Student[] list</code>, return the Student with the highest CGPA.</p>',
    idea: '<p>Same as finding a max, except you keep a <b>reference</b> to the best object instead of a number, and compare <code>s.cgpa</code>.</p>',
    extra: studentClass,
    code: code`
static Student topStudent(Student[] list) {
    Student best = list[0];
    for (Student s : list) {
        if (s.cgpa > best.cgpa) {
            best = s;
        }
    }
    return best;
}`,
    main: ['Student[] list = {', '    new Student("Rafi", 3.45),', '    new Student("Mitu", 3.92),', '    new Student("Sami", 3.80)', '};', 'Student top = topStudent(list);', 'System.out.println(top.name + " " + top.cgpa);'],
    output: 'Mitu 3.92',
    tips: ['<code>best = s</code> copies a reference: no object is copied or created.'],
    input: {
      fields: [{ key: 'names', label: 'Names', def: 'Rafi Mitu Sami' }, { key: 'cgpas', label: 'CGPAs', def: '3.45 3.92 3.80' }],
      build(inp, t) {
        const list = readStudents(inp);
        makeStudents(t, list, 'static Student topStudent');
        t.s('static Student topStudent', '', ['call', 'topStudent(Student[] list)', { list: '@L' }]);
        let b = 0;
        t.s('Student best = list[0];', '', ['v', 'best', '@s0']);
        list.forEach((s, i) => {
          t.s('for (Student s : list) {', '', ['v', 's', '@s' + i], ['ptr', 'L', 's', i]);
          if (s[1] > list[b][1]) { b = i; t.s('best = s;', fmt(s[1]) + ' is higher → best now points here.', ['v', 'best', '@s' + i]); }
          else t.s('if (s.cgpa > best.cgpa) {', fmt(s[1]) + ' > ' + fmt(list[b][1]) + '? no');
        });
        t.s('return best;', '', ['vd', 's'], ['ptr', 'L', 's', null], ['p', list[b][0] + ' ' + fmt(list[b][1])]);
      }
    }
  });

  prob({
    id: 'p-sort-students', level: 'hard', title: 'Sort students by CGPA (descending)', short: 'Swap references inside the array', complexity: 'O(n²)', cls: 'SortStudents',
    prompt: '<p>Sort a <code>Student[]</code> from highest to lowest CGPA using selection sort.</p>',
    idea: '<p>Exactly like selection sort on ints, but compare <code>list[j].cgpa</code>, and the swap moves <b>references</b>. The Student objects themselves never move or change.</p>',
    extra: studentClass,
    code: code`
static void sortByCgpa(Student[] list) {
    for (int i = 0; i < list.length - 1; i++) {
        int maxIdx = i;
        for (int j = i + 1; j < list.length; j++) {
            if (list[j].cgpa > list[maxIdx].cgpa) {
                maxIdx = j;
            }
        }
        Student temp = list[i];
        list[i] = list[maxIdx];
        list[maxIdx] = temp;
    }
}`,
    main: ['Student[] list = {', '    new Student("Rafi", 3.45),', '    new Student("Mitu", 3.92),', '    new Student("Sami", 3.80),', '    new Student("Tania", 3.10)', '};', 'sortByCgpa(list);', 'for (Student s : list) System.out.println(s.name + " " + s.cgpa);'],
    output: 'Mitu 3.92\nSami 3.8\nRafi 3.45\nTania 3.1',
    tips: ['Watch the arrows in the visualiser: the array cells change, while the Student objects stay put.'],
    input: {
      fields: [{ key: 'names', label: 'Names', def: 'Rafi Mitu Sami Tania' }, { key: 'cgpas', label: 'CGPAs', def: '3.45 3.92 3.80 3.10' }],
      build(inp, t) {
        const list = readStudents(inp);
        makeStudents(t, list, 'static void sortByCgpa');
        t.s('static void sortByCgpa', '', ['call', 'sortByCgpa(Student[] list)', { list: '@L' }]);
        const idx = list.map((_, i) => i); // which student object each cell refers to
        for (let i = 0; i < idx.length - 1; i++) {
          let m = i;
          t.s('int maxIdx = i;', '', ['v', 'i', String(i)], ['ptr', 'L', 'i', i], ['v', 'maxIdx', String(i)]);
          for (let j = i + 1; j < idx.length; j++) {
            if (list[idx[j]][1] > list[idx[m]][1]) { m = j; t.s('maxIdx = j;', list[idx[j]][0] + ' has a higher CGPA', ['v', 'j', String(j)], ['ptr', 'L', 'j', j], ['v', 'maxIdx', String(m)]); }
            else t.s('if (list[j].cgpa > list[maxIdx].cgpa) {', '', ['v', 'j', String(j)], ['ptr', 'L', 'j', j]);
          }
          const tmp = idx[i]; idx[i] = idx[m]; idx[m] = tmp;
          t.s('list[maxIdx] = temp;', 'Swap the references in cells ' + i + ' and ' + m + '.', ['vd', 'j'], ['ptr', 'L', 'j', null], ['f', 'L', i, '@s' + idx[i]], ['f', 'L', m, '@s' + idx[m]], ['mark', 'L', i, 'done']);
        }
        t.s('sortByCgpa(Student[] list) {', '', ['vd', 'i'], ['ptr', 'L', 'i', null], ...idx.map(k => ['p', list[k][0] + ' ' + fmt(list[k][1])]));
      }
    }
  });

  prob({
    id: 'p-jagged-stats', level: 'hard', title: 'Jagged array: row sums and the longest row', short: 'a[i].length differs per row', mid: 'Fall 2025 / Summer 2025', complexity: 'O(total elements)', cls: 'JaggedStats',
    prompt: '<p>For a jagged int array, print each row’s length and sum, then the index of the longest row.</p>',
    idea: '<p>A for-each over a row (<code>for (int x : a[i])</code>) adapts to that row’s length. Compare <code>a[i].length</code> to find the longest.</p>',
    code: code`
static void jaggedStats(int[][] a) {
    int longest = 0;
    for (int i = 0; i < a.length; i++) {
        int sum = 0;
        for (int x : a[i]) {
            sum += x;
        }
        System.out.println("Row " + i + " (length " + a[i].length + ") sum = " + sum);
        if (a[i].length > a[longest].length) {
            longest = i;
        }
    }
    System.out.println("Longest row: " + longest);
}`,
    main: ['int[][] a = {{5, 1}, {7, 2, 9, 4}, {3}, {8, 8, 8}};', 'jaggedStats(a);'],
    output: 'Row 0 (length 2) sum = 6\nRow 1 (length 4) sum = 22\nRow 2 (length 1) sum = 3\nRow 3 (length 3) sum = 24\nLongest row: 1',
    input: {
      fields: [{ key: 'm', label: 'Rows (; between rows)', def: '5 1; 7 2 9 4; 3; 8 8 8' }],
      build(inp, t) {
        const a = matrix(inp.m); let L = 0;
        t.s('static void jaggedStats', '', ['arr2', 'J', 'int', a.map(r => r.map(String))], ['call', 'jaggedStats(int[][] a)', { a: '@J' }]);
        t.s('int longest = 0;', '', ['v', 'longest', '0']);
        a.forEach((r, i) => {
          let s = 0;
          t.s('int sum = 0;', 'Row ' + i + ' has ' + r.length + ' element(s).', ['v', 'i', String(i)], ['ptr', 'J', 'i', i], ['v', 'sum', '0']);
          r.forEach((x, j) => { s += x; t.s('sum += x;', '', ['v', 'x', String(x)], ['ptr', 'J', 'x', [i, j]], ['v', 'sum', String(s)]); });
          t.s('System.out.println("Row "', '', ['vd', 'x'], ['ptr', 'J', 'x', null], ['p', 'Row ' + i + ' (length ' + r.length + ') sum = ' + s]);
          if (r.length > a[L].length) { L = i; t.s('longest = i;', 'Longer than row ' + L + '?', ['v', 'longest', String(i)]); }
        });
        t.s('System.out.println("Longest row: " + longest);', '', ['vd', 'i'], ['vd', 'sum'], ['ptr', 'J', 'i', null], ['p', 'Longest row: ' + L]);
      }
    }
  });
})();
