public class MaxMin {
    static void findMaxMin(int[] arr) {
        int max = arr[0], min = arr[0];
        int maxIdx = 0, minIdx = 0;
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                max = arr[i];
                maxIdx = i;
            }
            if (arr[i] < min) {
                min = arr[i];
                minIdx = i;
            }
        }
        System.out.println("Max " + max + " at index " + maxIdx);
        System.out.println("Min " + min + " at index " + minIdx);
    }

    public static void main(String[] args) {
        int[] arr = {7, -2, 19, 4, 19, -8, 3};
        findMaxMin(arr);
    }
}
