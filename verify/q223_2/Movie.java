public class Movie {
    private String name; protected String origin; public String genre; public Float rating;
    public Movie(String name, String origin, String genre, Float rating) { this.name = name; this.origin = origin; this.genre = genre; this.rating = rating; }
    public Movie(String name, String genre) { this.name = name; this.genre = genre; }
    void Details() {
        System.out.println("You are watching " + name.toUpperCase());
        System.out.println("Origin: " + origin);
        System.out.println("Genre: " + genre);
        System.out.println("Rating: " + rating);
    }
    public static void main(String[] args) { new Movie("Shutter Island", "USA", "Thriller", 8.2f).Details(); }
}
