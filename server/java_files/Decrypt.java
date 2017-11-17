package java_files;

public class Decrypt{
  public static void main(String[] arg) {
    String[] message = arg;
    int z = Integer.parseInt(arg[0]);
    String newMessage = "";
    while (z > 52){
      z-=52;
    }
    for(int j = 1;j < message.length;j++){
    for (int a = 0;a < message[j].length();a ++) {
      int change = message[j].charAt(a);
        //System.out.print(change+"\n");
        if (change <= 90&&change >= 65){
          //System.out.print("UPPER\n");
          if (change - z > 90){
            change = change - z - 26;
          }
          else if (change - z < 65){
            change = change - z + 26;
          }
          else{
            change = change - z;
          }
        }
        else if (change >= 96&&change <= 122){
          //System.out.print("LOWER\n");
          if (change - z > 122){
            change = change - z - 26;
          }
          else if (change - z < 96){
            change = change - z + 26;
          }
          else{
            change = change - z;
          }
        }
        //System.out.println(change+"\n");
      newMessage += (char)change;
    }
    newMessage += " ";


  }
  System.out.println(newMessage);
}
}
