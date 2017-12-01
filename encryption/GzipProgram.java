package java_files;

import java.io.*;

public class GzipProgram {

	public static void main(String... args) throws IOException {
		if(args.length != 3) {
			System.out.println("Proper Usage is: java GzipProgram [-c -d] input output");
			System.exit(0);
		}

		String flag = args[0];

		File input = new File(args[1]);
		File output = new File(args[2]);

		if(flag.equals("-c")) {
			System.out.println("Compressing " + args[1]);
			GzipJava.compressGZIP(input, output);
			System.out.println("Finished " + args[2]);
		} else if(flag.equals("-d")) {
			System.out.println("Decompressing " + args[1]);
			GzipJava.decompressGZIP(input, output);
			System.out.println("Finished " + args[2]);
		}
	}
}