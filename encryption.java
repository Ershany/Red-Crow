import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class encryption{

	private ArrayList<Character> message = new ArrayList<Character>();
	private int key;//??????

	@Override
	public String toString() {
		String s = "";
		for (int i = 0; i < this.message.size();i++) {
			s += this.message.get(i);
		}
		return s;	  
	}
	
	public encryption(String s, int k){
		for (int i = 0; i < s.length() ; i++) {
			//System.out.println(s.toCharArray()[i]);
			message.add(s.toCharArray()[i]);
		}
		while (k > 94) {
			k-=94;
		}
		key = k;
	
	}
	
	public String getMessage() {
		 return this.toString();
	 }
	
	protected void toDecrypt() {
		for (int i = 0; i != this.message.size(); i++) {
			int change = this.message.get(i);
			if (change -this.key < 32) {
				change = change-this.key+94;
			}
			else if (change+this.key > 126) {
				change = change+this.key - 94;
			}
			else {
				change = change - this.key;
			}
			this.message.set(i, (char)change);	
		}
		this.split();
	}
	
	protected void toEncrypt(){
		for (int a = 0;a != this.message.size();a ++) {
			int change = this.message.get(a);
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
		
		String c = "THIS IS A TEST";
	    encryption s = new encryption(c,000);
	    
	    System.out.println(s.message);
	    s.toEncrypt();
	    System.out.println(s.message);
	
	    
	  }
	
	}
