import java.util.Scanner;

public class Message extends encryption{
  
  public static Scanner sc = new Scanner(System.in);

  public Message(String s,int k) {
	super(s,k);
  }


  public static void main(String[] arg) {
	  String s = "TEST 123";
	  int k = 2;
	  Message m = new Message(s,k);
	  System.out.println(m.getMessage());
	  m.toEncrypt();
	  System.out.println(m.getMessage());
	  m.toDecrypt();
	  System.out.println(m.getMessage());
  }
}
