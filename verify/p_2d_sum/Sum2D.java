public class Sum2D {
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
    }

    public static void main(String[] args) {
        int[][] m = {{1, 2, 3}, {4, 5}, {6}};
        System.out.println("Total = " + sum2D(m));
    }
}
