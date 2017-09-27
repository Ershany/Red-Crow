import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class encryption {

  private ArrayList<Character> message;
  private int key;//??????

  public encryption(ArrayList<Character> x,int k){
    message = x;
    key = k;

  }


  public void toEncrypt(){
    for (int a = 0;a != this.message.size();a ++) {
      int change = this.message.get(a);
      while (this.key > 94) {
    	  this.key -= 94;
      }
      if (change >= 32 || change <= 126) {
        if (change+this.key > 126) {
          change = change+this.key-94;
        }
        else if (change+this.key < 32) {
          change = change+this.key+94;
        }
        else {
          change = change+this.key;
        }

        this.message.set(a, (char)change);


      }
    }
    
    this.split();
    
  }
  
  private void split() {
	  int a,b;
	  
	  for (int i = 0; i < (this.message.size()/8);i++){
		  a = ((i+1)*8)-8;
		  b = ((i+1)*8);
		  List<Character> tmp =  (this.message).subList(a,b);
		  //System.out.println((this.message).subList(a, b));
		  flips(tmp);
		  //System.out.println(this.message);

	  }
	  
	  //System.out.println(b);
	  if ((this.message.size()%8) != 0) {
		  b = this.message.size()-((this.message.size()%8));
		  List<Character> tmp =  (this.message).subList(b,this.message.size());
		  //System.out.println((this.message).subList(b, this.message.size()));
		  flips(tmp);
		  //System.out.println(this.message);
		  //System.out.println((this.message).subList(b, this.message.size()));
	  }
  }
  
  private static void flips(List<Character> tmp) {
	  //char tmp;
	  Collections.reverse(tmp);
	  /*for (int i = 0;i<(c.size()/2);i++) {
		  System.out.println(c.get(i));
		  tmp = c.get(c.size()-1-i);
		  c.set(c.size()-1-i, c.get(i));
		  c.set(i, tmp);
		 System.out.println(c.get(i));
	  }*/
  }

  public static void main(String[] args){
	ArrayList<Character>z = new ArrayList<Character>();
	for (int i = 0; i < 8; i++){
	  z.add((char) (97+i));
	}
	System.out.println(z);
    flips(z);
	System.out.println(z);
	
    ArrayList<Character> c = new ArrayList<Character>();
    c.add('T');
    c.add('h');
    c.add('I');
    c.add('s');
    c.add(' ');
    c.add('i');
    c.add('S');
    c.add(' ');
    c.add('A');
    c.add(' ');
    c.add('T');
    c.add('e');
    c.add('s');
    c.add('t');
    c.add(' ');
    c.add('Z');
    c.add('Y');
    c.add('x');
    c.add('v');
    c.add('1');
    c.add('2');
    c.add('3');
    c.add('4');
    encryption s = new encryption(c,899);
    
    System.out.println(s.message);
    s.toEncrypt();
    System.out.println(s.message);

    
  }

}
