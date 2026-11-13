import java.util.Arrays;

public class RotateLeft {
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
    }

    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5, 6};
        rotateLeft(arr, 2);
        System.out.println(Arrays.toString(arr));
    }
}
