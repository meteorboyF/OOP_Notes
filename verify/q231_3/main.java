class Calculator {
    public int a;
    public int b;
    Calculator(int firstNumber, int secondNumber) {
        this.a = firstNumber;
        this.b = secondNumber;
    }
    public int sum() { return a + b; }
    public int subtract() { return a - b; }
}
class AdvancedCalculator extends Calculator {
    int[] numbers;
    AdvancedCalculator(int a, int b, int[] numbers) {
        super(a, b);
        this.numbers = numbers;
    }
    @Override
    public int subtract() {
        System.out.print("Subtraction result: ");
        return super.subtract();
    }
    @Override
    public int sum() {
        int total = super.sum();
        for (int n : numbers) {
            total += n;
        }
        System.out.print("Summation result: ");
        return total;
    }
}
public class main {
    public static void main(String[] args) {
        AdvancedCalculator c = new AdvancedCalculator(1, 2, new int[]{3, 4, 5});
        System.out.println(c.subtract());
        System.out.println(c.sum());
    }
}
