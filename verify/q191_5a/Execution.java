class CrazyVars {
    static int i;
    int j;
    void incrementI() { CrazyVars.i++; }
    void incrementJ() { this.j++; }
}
public class Execution {
    public static void main(String[] args) {
        CrazyVars workerOne = new CrazyVars();
        CrazyVars workerTwo = new CrazyVars();
        workerOne.incrementI();
        workerTwo.incrementJ();
        workerTwo.incrementI();
        workerOne.incrementJ();
        System.out.println(workerOne.i + workerTwo.j);
    }
}
