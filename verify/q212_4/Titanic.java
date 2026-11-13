public class Titanic {
    String directorName; String featuredSong;
    { System.out.println("Titanic sank in the North Atlantic Ocean on 15 April 1912 after striking an iceberg"); }
    public Titanic(String directorName, String featuredSong) { this.directorName = directorName; this.featuredSong = featuredSong; }
    void showDetails() { System.out.println("Director: " + directorName); System.out.println("Featured song: " + featuredSong); }
    public static void main(String[] args) { Titanic t = new Titanic("James Cameron", "My Heart Will Go On"); t.showDetails(); }
}
