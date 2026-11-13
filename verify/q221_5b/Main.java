class Point {
    int x, y;
}
class Functions {
    void swapPoints1(Point a, Point b) {
        Point t = a;
        a = b;
        b = t;
    }
    void swapPoints2(Point a, Point b) {
        int x = a.x;
        int y = a.y;
        a.x = b.x;
        a.y = b.y;
        b.x = x;
        b.y = y;
    }
}
class Main {
    public static void main(String[] args) {
        Functions fnc = new Functions();
        Point p1 = new Point();
        p1.x = 10;
        p1.y = 15;
        Point p2 = new Point();
        p2.x = 20;
        p2.y = 25;
        fnc.swapPoints1(p1, p2);
        System.out.println(p1.x + ", " + p1.y);
        fnc.swapPoints2(p1, p2);
        System.out.println(p1.x + ", " + p1.y);
        new Point();
        Point p3 = p2;
        p2 = new Point();
        p3 = p1;
        p1 = p2;
    }
}
