public class CountKey {
    static int countOccurrences(int[] arr, int key) {
        int count = 0;
        for (int x : arr) {
            if (x == key) {
                count++;
            }
        }
        return count;
    }

    public static void main(String[] args) {
        int[] arr = {2, 5, 2, 9, 2, 5};
        System.out.println("2 appears " + countOccurrences(arr, 2) + " times");
    }
}
