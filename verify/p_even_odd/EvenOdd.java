public class EvenOdd {
    static void countEvenOdd(int[] arr) {
        int even = 0, odd = 0;
        for (int x : arr) {
            if (x % 2 == 0) {
                even++;
            } else {
                odd++;
            }
        }
        System.out.println("Even: " + even + ", Odd: " + odd);
    }

    public static void main(String[] args) {
        int[] arr = {3, 8, -5, 0, 14, 21, -6};
        countEvenOdd(arr);
    }
}
