package java_files;

public class Nothing {

	public static void main(String[] args) {
		if(args.length != 3)
			System.exit(-1);
		
		boolean encode = args[0].equals("-e");
		String message = args[1];
		int number = Integer.parseInt(args[2]);

		String result;
		if(encode)
			result = encode(message, number);
		else
			result = decode(message, number);

		System.out.print(result);
	}

	private static String encode(String message, int number) {
		// String encoded = "";
		// int length = message.length();
		// for(int i = 0; i < length; i++) {
		// 	encoded += message.charAt(length - i - 1);
		// }
		// return encoded;
		return message;
	}

	private static String decode(String message, int number) {
		// String encoded = "";
		// int length = message.length();
		// for(int i = 0; i < length; i++) {
		// 	encoded += message.charAt(length - i - 1);
		// }
		// return encoded;
		return message;
	}
}