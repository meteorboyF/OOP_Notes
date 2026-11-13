class Movie {
    String name; int year; String duration;
    Movie(String name, int year, String duration) { this.name = name; this.year = year; this.duration = duration; }
    void play() { System.out.println("Playing: " + name + " [" + year + "]"); }
    static void movieInfo(Movie m) { System.out.println("Movie name: " + m.name + ", year: " + m.year + ", Duration: " + m.duration); }
}
public class MovieTheater {
    public static void main(String[] args) {
        Movie m_Debi = new Movie("Debi", 2018, "1hr 30min"); Movie m_Venom = new Movie("Venom", 2018, "1hr");
        m_Debi.play(); m_Venom.play(); Movie.movieInfo(m_Debi);
    }
}
