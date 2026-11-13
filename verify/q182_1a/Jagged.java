public class Jagged {
    public static void main(String[] args) {
        int[][] a = new int[4][];
        int value = 1;
        for (int i = 0; i < a.length; i++) {
            a[i] = new int[4 - i];
            for (int j = 0; j < a[i].length; j++) {
                a[i][j] = value++;
            }
        }
        for (int[] row : a) {
            for (int x : row) System.out.print(x + " ");
            System.out.println();
        }
    }
}
