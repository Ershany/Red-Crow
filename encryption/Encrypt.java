package java_files;

public class Encrypt {
	private static boolean debug = false;

	public static void main(String... args) {
		int z = Integer.parseInt(args[0]);
		String newMessage = "";
		while (z > 26)
			z -= 25;

		if(debug)
			System.out.println(z);

		for(int j = 1; j < args.length; j++) {
			StringBuilder rev = new StringBuilder();
			for (int a = 0; a < args[j].length(); a++) {
				int change = args[j].charAt(a);
				if(debug)
					System.out.println(change);
				if(change <= 90 && change >= 65) {
					if(debug)
						System.out.println("UPPER");
					if(change + z > 90)
						change = change + z - 26;
					else if(change + z < 65)
						change = change + z + 26;
					else
						change = change + z;
				} else if (change >= 96 && change <= 122) {
					if(debug)
						System.out.println("LOWER");
					if(change + z > 122)
						change = change + z - 26;
					else if (change + z < 96)
						change = change + z + 26;
					else
						change = change + z;
				}

				if (debug)
					System.out.println(change);
				rev.append((char) change);
			}

			rev = rev.reverse();
			// if (j != args.length)
			// 	rev.append(' ');
			newMessage += rev.toString();
		}

		System.out.print(newMessage);
	}
}