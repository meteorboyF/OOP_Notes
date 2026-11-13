
public class ScopeDemo {
    static int bonusPoints(int score) {
        int points = 0;
        for (int i = 1; i <= 3; i++) {
            int bonus = i * score;
            points += bonus;
        }
        // i and bonus do not exist here any more
        return points;
    }
    public static void main(String[] args) {
        int total = bonusPoints(10);
        System.out.println(total);
    }
}
