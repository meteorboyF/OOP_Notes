class SpiderMan {
    String movieName; String directedBy;
    public SpiderMan(String movieName, String directedBy) { this.movieName = movieName; this.directedBy = directedBy; }
    public void show() { System.out.println("Movie: " + movieName); System.out.println("Directed by: " + directedBy); }
}
public class SuperMan { public static void main(String[] args) { SpiderMan s = new SpiderMan("The Amazing Spider-Man 2", "Marc Webb"); s.show(); } }
