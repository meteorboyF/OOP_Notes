public class DoubleArray {
    public static void main(String[] args) {
        double[] nums = {2.5, 12.0, 7.5, 15.25, 9.9, 3.1, 20.0, 1.0};
        double sum = 0;
        for (double d : nums) {
            if (d < 10.0) {
                sum += d;
            }
        }
        System.out.println("Sum of elements < 10: " + sum);
        System.out.println("Size: " + nums.length);
    }
}
