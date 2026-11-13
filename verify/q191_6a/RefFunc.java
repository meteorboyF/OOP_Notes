class SwapFunc {
    static void swapReference(RefFunc a, RefFunc b) {
        RefFunc c = a;
        a = b;
        b = c;
    }
}
public class RefFunc {
    int a;
    int b;
    public RefFunc(int a, int b) {
        this.a = a;
        this.b = b;
    }
    public static void main(String[] args) {
        RefFunc obj1 = new RefFunc(5, 6);
        RefFunc obj2 = new RefFunc(7, 8);
        SwapFunc.swapReference(obj1, obj2);
        System.out.println(obj1.a + "\t" + obj2.b);
    }
}
