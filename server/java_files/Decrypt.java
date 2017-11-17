package java_files;

public class Decrypt{
  private static boolean debug = false;
  public static void main(String[] arg) {
    String[] message = arg;
    int z = Integer.parseInt(arg[0]);
    String newMessage = "";
    while (z > 26){
      z-=25;
    }
    for(int j = 1;j < message.length;j++){
      StringBuilder rev = new StringBuilder();
      for (int a = 0;a < message[j].length();a ++) {
        int change = message[j].charAt(a);
          if (debug) System.out.print(change+"\n");
          if (change <= 90&&change >= 65){
            if (debug) System.out.print("UPPER\n");
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
            if (debug) System.out.print("LOWER\n");
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
          if (debug) System.out.println(change+"\n");
          rev.append((char)change);
        }
        rev = rev.reverse();
        if (j != message.length){
          rev.append(' ');
        }
        newMessage += rev.toString();



      }
      System.out.println(newMessage);
    }
}
