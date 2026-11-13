
public class Main {
    public static void main(String[] args) {
        int[] a = new int[4];
        a[1] = 7;
        int[] b = a;
        b[2] = 5;
        String[] names = new String[3];
        names[0] = "Ana";
        for (int x : a) {
            x = 100;
        }
        System.out.println(a[0] + " " + a[1] + " " + a[2] + " " + names[1]);
    }
}
