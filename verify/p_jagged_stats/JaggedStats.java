public class JaggedStats {
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
    }

    public static void main(String[] args) {
        int[][] a = {{5, 1}, {7, 2, 9, 4}, {3}, {8, 8, 8}};
        jaggedStats(a);
    }
}
