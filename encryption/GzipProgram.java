package java_files;

import java.io.*;
// EXTRA
import java.util.zip.*;
import java.util.Base64;
import java.util.Arrays;

public class GzipProgram {

	public static void main(String... args) throws IOException {
		if(args.length != 2) {
			System.out.println("Proper Usage is: java GzipProgram [-c -d] text");
			System.exit(0);
		}

		String flag = args[0];
		String text = args[1];

		if(flag.equals("-c")) {
			// System.out.println("Compressing " + text);
			String gziped = GzipJava.compressGZIP(text);
			System.out.print(gziped);
		} else if(flag.equals("-d")) {
			// System.out.println("Decompressing " + args[1]);
			// GzipJava.decompressGzip(output, decompressed);
		}

		// String gziped = GzipJava.compressGZIP("whaddup big pimps, you already know. how dat gzipped shizzz.");
		// System.out.println("size: " + gziped.length());
		// System.out.println("text: " + gziped);
		// // H4sIAAAAAAAAAAXBiw3AIAgFwFXeAMadMBgh/UC0hsj0vQsh5u1oOuD6+Co4tkH37MQH12tRIRZg+jBS3TtjiWZm/QHtN5h/PAAAAA==

		// String uziped = GzipJava.decompressGZIP(gziped);
		// System.out.println("size: " + uziped.length());
		// System.out.println("text: " + uziped);

		// NOW CONVERT THAT BUFFER.TOSTRING() BACK TO AROUND THE WORLD


		byte[] dbuf = Base64.getDecoder().decode("H4sIAAAAAAAAADMwMHBKTKpUcEpMzlYIykwqVghKTc4sSFXQVXDMySkCs4v1kvNzAbdGGPYpAAAA");
		// System.out.println(Arrays.equals(buf, dbuf) + " so far so good");

		ByteArrayInputStream input = new ByteArrayInputStream(dbuf);
		try (GZIPInputStream in = new GZIPInputStream(input)) {
			try (FileOutputStream out = new FileOutputStream(new File("tmp/original-daft.txt"))) {
				byte[] buffer = new byte[1024];
				int len;
				while((len = in.read(buffer)) != -1) {
					out.write(buffer, 0, len);
				}
			}
		}

		/*

		final String tmp = "./tmp/";

		File example = new File(tmp + args[1]);
		File output = new File(tmp + args[1] + ".gz");
		File decompressed = new File(tmp + "d-" + args[1]);

		*/
	}
}