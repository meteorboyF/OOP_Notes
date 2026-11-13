class Time {
    private int hour, minute, second;
    public Time() { this(0, 0, 0); }
    public Time(int hour, int minute) { this(hour, minute, 0); }
    public Time(int hour, int minute, int second) { this.hour = hour; this.minute = minute; this.second = second; }
    public static void swap(Time a, Time b) {
        int h = a.hour, m = a.minute, s = a.second;
        a.hour = b.hour; a.minute = b.minute; a.second = b.second;
        b.hour = h;      b.minute = m;        b.second = s;
    }
    public void add(int h, int m, int s) {
        int total = (hour * 3600 + minute * 60 + second) + (h * 3600 + m * 60 + s);
        total %= 24 * 3600;
        hour = total / 3600; minute = (total % 3600) / 60; second = total % 60;
    }
    public void add(int m, int s) { add(0, m, s); }
    public void add(Time t) { add(t.hour, t.minute, t.second); }
    public String toString() {
        int h12 = hour % 12 == 0 ? 12 : hour % 12;
        String ampm = hour < 12 ? "AM" : "PM";
        return String.format("%02d:%02d:%02d %s", h12, minute, second, ampm);
    }
}
class TimeTest {
    static void timeSwap(Time a, Time b) { Time.swap(a, b); }
    public static void main(String[] args) {
        Time t1 = new Time();
        Time t2 = new Time(12, 20);
        Time t3 = new Time(23, 11, 12);
        System.out.println(t1); System.out.println(t2); System.out.println(t3);
        timeSwap(t1, t3);
        System.out.println("After swap");
        System.out.println(t1); System.out.println(t2); System.out.println(t3);
        System.out.println("After add 1"); t3.add(t1); System.out.println(t3);
        System.out.println("After add 2"); t2.add(45, 0); System.out.println(t2);
        System.out.println("After add 3"); t1.add(1, 10, 20); System.out.println(t1);
    }
}
