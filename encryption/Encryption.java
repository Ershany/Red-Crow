import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Encryption{
	private byte[] gen = new byte[3];
	private ArrayList<Character> message = new ArrayList<Character>();
	private int key;

	/*
	Name: toString()
	Purpose: Needed a way to make the array back to a string
	In/outs:
	*/
	@Override
	public String toString() {
		String s = "";
		for (int i = 0; i < this.message.size();i++) {
			s += this.message.get(i);
		}
		return s;
	}

	/*
	Name: encryption(s,k)
	Purpose: Basic Constructor
	In/outs: s -> String -> in -> the message that is to be passed
		 k -> int -> in -> the 'key', will be the last 3 numbers of the phone
	*/
	public Encryption(String s, int k){
		gen[0] = s.getBytes()[0];
		gen[1] = s.getBytes()[1];
		gen[2] = s.getBytes()[2];

		for (int i = 3; i < s.length() ; i++) {
			message.add(s.toCharArray()[i]);
		}
		while (k > 94) {
			k-=94;
		}
		key = k;

	}

	/*
	 Name: strip()
	 Purpose: return generic values that at is at the start
	 In/Out:
	 */
	public byte[] strip () {
		return gen;
	}

	/*
	Name: getMessage()
	Purpose: public function to get the message from the encryption
	In/outs:
	*/
	public String getMessage() {
		 return this.toString();
	}

	/*
	Name: toDecrypt()
	Purpose: Called on the message, to decrypt the message
	In/outs:
	*/
	public void toDecrypt() {
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

	/*
	Name: toEncrypt()
	Purpose: called on the message to encrypt it
	In/outs:
	*/
	public void toEncrypt(){
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

	/*
	Name: slipt()
	Purpose: will split the array into smaller arrays (8 chars) so it can be fliped
	In/outs:
	*/
	private void split() {
		  int a,b;

		  for (int i = 0; i < (this.message.size()/8);i++){
			  a = ((i+1)*8)-8;
			  b = ((i+1)*8);
			  List<Character> tmp =  (this.message).subList(a,b);
			  flips(tmp);

		  }

		  if ((this.message.size()%8) != 0) {
			  b = this.message.size()-((this.message.size()%8));
			  List<Character> tmp =  (this.message).subList(b,this.message.size());
			  flips(tmp);
		  }
	  }

	/*
	Name: flips(tmp)
	Purpose: Will filp the tmp list
	In/outs: tmp -> List<Char> -> in/out -> flips the list.
	*/
	  private static void flips(List<Character> tmp) {
		  Collections.reverse(tmp);
	  }


	}
