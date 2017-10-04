
import java.util.Scanner;

public class Message extends Encryption{
  
  public static Scanner sc = new Scanner(System.in);

  public Message(String s,int k) {
	super(s,k);
  }


  public static void main(String[] arg) {
	  String s = "012";
	  for (int i = 0; i < 100; i++) {
		  s+="This is a test"; // This will change to illegable wording when encoded
	  }
	  System.out.println(s);
	  long start = System.nanoTime();
	  int k = 2;
	  Message m = new Message(s,k);
	  System.out.println(m.getMessage());
	  m.toEncrypt();
	  System.out.println(m.getMessage());
	  m.toDecrypt();
	  System.out.println(m.getMessage());
	  long end = System.nanoTime();
	  long dur = (end - start);
	  System.out.println(dur/1000000);
	 
	  System.out.println((m.strip())[2]);
  }
}
