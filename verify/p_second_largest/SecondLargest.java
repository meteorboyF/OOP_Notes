public class SecondLargest {
    static int secondLargest(int[] arr) {
        int first = Integer.MIN_VALUE, second = Integer.MIN_VALUE;
        for (int x : arr) {
            if (x > first) {
                second = first;
                first = x;
            } else if (x > second && x != first) {
                second = x;
            }
        }
        return second;
    }

    public static void main(String[] args) {
        int[] arr = {12, 35, 1, 10, 34, 35, 1};
        System.out.println("Second largest: " + secondLargest(arr));
    }
}
