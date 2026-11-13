class Seat {
    private int row;
    private int number;
    private String tag;
    public Seat(int row, int number, String tag) {
        this.row = row;
        this.number = number;
        this.tag = tag;
    }
    public void setTag(String tag) {
        this.tag = tag;
    }
    @Override
    public String toString() {
        return "R" + row + "-S" + number + " (" + tag + ")";
    }
}
public class Cineplex {
    public static void main(String[] args) {
        Seat[][] hall = new Seat[3][];
        hall[0] = new Seat[2];
        hall[1] = new Seat[3];
        hall[2] = new Seat[1];
        for (int r = 0; r < hall.length; r++) {
            for (int c = 0; c < hall[r].length; c++) {
                hall[r][c] = new Seat(r, c, "Row" + r + ",Seat" + c);
            }
        }
        for (int r = 0; r < hall.length; r++) {
            for (int c = 0; c < hall[r].length; c++) {
                System.out.print(hall[r][c] + " ");
            }
            System.out.println();
        }
        Seat temp = hall[1][2];
        temp.setTag("VIP");
        System.out.println(hall[1][2]);
    }
}
