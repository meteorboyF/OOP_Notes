public class PairSum {
    static void printPairs(int[] arr, int target) {
        boolean found = false;
        for (int i = 0; i < arr.length; i++) {
            for (int j = i + 1; j < arr.length; j++) {
                if (arr[i] + arr[j] == target) {
                    System.out.println("(" + arr[i] + ", " + arr[j] + ")");
                    found = true;
                }
            }
        }
        if (!found) System.out.println("No pair");
    }

    public static void main(String[] args) {
        int[] arr = {2, 7, 4, 5, 11, 3};
        printPairs(arr, 9);
    }
}
