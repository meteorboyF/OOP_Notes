public class Spiral {
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
    }

    public static void main(String[] args) {
        int[][] m = {{1, 2, 3, 4}, {5, 6, 7, 8}, {9, 10, 11, 12}};
        spiral(m);
    }
}
