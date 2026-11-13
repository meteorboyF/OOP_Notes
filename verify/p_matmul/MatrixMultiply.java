import java.util.Arrays;

public class MatrixMultiply {
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
    }

    public static void main(String[] args) {
        int[][] a = {{1, 2}, {3, 4}};
        int[][] b = {{5, 6}, {7, 8}};
        System.out.println(Arrays.deepToString(multiply(a, b)));
    }
}
