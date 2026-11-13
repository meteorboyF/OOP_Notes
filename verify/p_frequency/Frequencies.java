public class Frequencies {
    static void frequencies(int[] arr) {
        boolean[] counted = new boolean[arr.length];
        for (int i = 0; i < arr.length; i++) {
            if (counted[i]) continue;
            int count = 1;
            for (int j = i + 1; j < arr.length; j++) {
                if (arr[j] == arr[i]) {
                    count++;
                    counted[j] = true;
                }
            }
            System.out.println(arr[i] + " appears " + count + " time(s)");
        }
    }

    public static void main(String[] args) {
        int[] arr = {4, 2, 4, 5, 2, 4};
        frequencies(arr);
    }
}
