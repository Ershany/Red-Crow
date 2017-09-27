import java.util.Scanner;

public class Message extends encryption{

  public static Scanner sc = new Scanner(System.in);

  public static void main(String[] args){
	char[] c = new char[100];
	for (int i = 0; i < 100; i++) {
		c[i] = 'a';
	}
    int k = 10;
    System.out.println(c);
    
    encrypt(c,k);
     System.out.println(c);
  }
}
