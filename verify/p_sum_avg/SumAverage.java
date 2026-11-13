public class SumAverage {
    static double average(int[] arr) {
        int sum = 0;
        for (int i = 0; i < arr.length; i++) {
            sum += arr[i];
        }
        double avg = (double) sum / arr.length;
        return avg;
    }

    public static void main(String[] args) {
        int[] arr = {4, 8, 15, 16, 23, 43};
        System.out.println("Average: " + average(arr));
    }
}
