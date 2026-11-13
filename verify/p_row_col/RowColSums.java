public class RowColSums {
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
    }

    public static void main(String[] args) {
        int[][] m = {{1, 2, 3}, {4, 5, 6}};
        rowColSums(m);
    }
}
