class FlightBooking {
    private String passengerName;
    private int seatNumber;
    private boolean confirm = false;
    public FlightBooking(String passengerName, int seatNumber) { this.passengerName = passengerName; this.seatNumber = seatNumber; }
    public boolean isConfirm() { return confirm; }
    public void setConfirm(boolean confirm) { this.confirm = confirm; }
    public int getSeatNumber() { return seatNumber; }
    public void setSeatNumber(int seatNumber) { this.seatNumber = seatNumber; }
}
class FTest {
    public static void main(String[] args) {
        FlightBooking f1 = new FlightBooking("John", 12);
        FlightBooking f2 = new FlightBooking("Maria", 3);
        if (f1.isConfirm() == false) { f1.setConfirm(true); f1.setSeatNumber(32); }
        System.out.println("seat number of Maria: " + f2.getSeatNumber());
        System.out.println("seat number of John: " + f1.getSeatNumber());
    }
}
