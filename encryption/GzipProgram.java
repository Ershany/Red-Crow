package java_files;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

public class GzipProgram {

	public static void main(String... args) throws IOException {
		if(args.length != 2) {
			System.out.println("Proper Usage is: java GzipProgram [-c -d] press-this-file");
			System.exit(0);
		}

		final String tmp = "./tmp/";

		File example = new File(tmp + args[1]);
		File output = new File(tmp + args[1] + ".gz");
		File decompressed = new File(tmp + "d-" + args[1]);

		if(args[0].equals("-c")) {
			System.out.println("Compressing " + args[1]);
			GzipJava.compressGZIP(example, output);
			// try(BufferedReader br = new BufferedReader(new FileReader(tmp + args[1] + ".gz"))) {
			// 	for(String line; (line = br.readLine()) != null;)
			// 		System.out.println(line);
			// }
		} else if(args[0].equals("-d")) {
			System.out.println("Decompressing " + args[1]);
			GzipJava.decompressGzip(output, decompressed);
		}
	}
}