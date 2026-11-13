public class FindMin {
    public static void main(String[] args) {
        int[] arr = {2, 3, 9, 8, 13, 1, 5, 19, 15};
        int min = arr[0];
        for (int x : arr) {
            if (x < min) {
                min = x;
            }
        }
        System.out.println("Minimum: " + min);
    }
}
