public class LinearSearch {
    static int linearSearch(int[] arr, int key) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == key) {
                return i;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] arr = {12, 7, 33, 7, 50};
        System.out.println("Index: " + linearSearch(arr, 33));
    }
}
