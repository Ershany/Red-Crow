package java_files;

public class Encrypt{
  public static void main(String[] arg) {
    String message = arg[1];
    int z = Integer.parseInt(arg[0]);
    String newMessage = "";
    while (z > 126){
      z-=94;
    }
    for (int a = 0;a < message.length();a ++) {
      int change = message.charAt(a);
      if (change >= 32 || change <= 126) {
        if (change+z > 126) {
          change = change+z-94;
        }
        else if (change+z < 32) {
          change = change+z+94;
        }
        else {
          change = change+z;
        }
      }
      newMessage += (char)change;
    }

    System.out.print(newMessage);
  }
}
