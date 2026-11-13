public class Diagonals {
    static void diagonalSums(int[][] m) {
        int n = m.length;
        int primary = 0, secondary = 0;
        for (int i = 0; i < n; i++) {
            primary += m[i][i];
            secondary += m[i][n - 1 - i];
        }
        System.out.println("Main diagonal: " + primary);
        System.out.println("Anti diagonal: " + secondary);
    }

    public static void main(String[] args) {
        int[][] m = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
        diagonalSums(m);
    }
}
