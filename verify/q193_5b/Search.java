public class Search {
    public static void main(String[] args) {
        int[] arr = {1, 3, 2, 4, 1, 10, 19, 20, 5};
        int key = 12;
        boolean found = false;
        for (int x : arr) {
            if (x == key) {
                found = true;
                break;
            }
        }
        if (found) System.out.println("Found");
        else System.out.println("Not found");
    }
}
