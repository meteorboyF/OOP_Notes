public class CopyArray {
    static int[] copyArray(int[] arr) {
        int[] copy = new int[arr.length];
        for (int i = 0; i < arr.length; i++) {
            copy[i] = arr[i];
        }
        return copy;
    }
    public static void main(String[] args) {
        int[] a = {1, 2, 3};
        int[] alias = a;
        int[] copy = copyArray(a);
        alias[0] = 99;
        System.out.println(a[0] + " " + copy[0]);
    }
}
