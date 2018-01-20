import java.io.*;

public class GzipProgram {

	public static void main(String... args) throws IOException {
		if(args.length != 2) {
			System.out.println("Proper Usage is: java GzipProgram input output");
			System.exit(0);
		}

		File input = new File(args[0]);
		File output = new File(args[1]);

		System.out.println("Compressing: " + args[0]);
		GzipJava.compressGZIP(input, output);
		System.out.println("Finished: " + args[1]);
	}
}