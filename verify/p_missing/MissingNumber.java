public class MissingNumber {
    static int findMissing(int[] arr) {
        int n = arr.length + 1;
        int expected = n * (n + 1) / 2;
        int actual = 0;
        for (int x : arr) {
            actual += x;
        }
        return expected - actual;
    }

    public static void main(String[] args) {
        int[] arr = {3, 7, 1, 2, 8, 4, 5};
        System.out.println("Missing: " + findMissing(arr));
    }
}
