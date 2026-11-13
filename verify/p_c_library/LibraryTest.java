
class LibraryBook {
    String title;
    String author;
    boolean available = true;

    LibraryBook(String title, String author) {
        this.title = title;
        this.author = author;
    }
    void borrowBook() {
        if (available) {
            available = false;
            System.out.println("You borrowed \"" + title + "\"");
        } else {
            System.out.println("Sorry, \"" + title + "\" is already borrowed");
        }
    }
    void returnBook() {
        if (!available) {
            available = true;
            System.out.println("\"" + title + "\" returned");
        } else {
            System.out.println("\"" + title + "\" was not borrowed");
        }
    }
}
public class LibraryTest {
    public static void main(String[] args) {
        LibraryBook b1 = new LibraryBook("Java: The Complete Reference", "Herbert Schildt");
        LibraryBook b2 = new LibraryBook("Clean Code", "Robert C. Martin");
        b1.borrowBook();
        b1.borrowBook();
        b1.returnBook();
        b2.returnBook();
        b1.borrowBook();
    }
}
