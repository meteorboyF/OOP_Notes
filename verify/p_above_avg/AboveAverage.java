public class AboveAverage {
    static int countAboveAverage(int[] arr) {
        int sum = 0;
        for (int x : arr) sum += x;
        double avg = (double) sum / arr.length;
        int count = 0;
        for (int x : arr) {
            if (x > avg) count++;
        }
        return count;
    }

    public static void main(String[] args) {
        int[] arr = {5, 1, 9, 3, 7};
        System.out.println(countAboveAverage(arr));
    }
}
