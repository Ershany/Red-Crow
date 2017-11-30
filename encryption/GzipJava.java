package java_files;

import java.io.*;
import java.util.zip.*;
import java.util.Base64;

public class GzipJava {

	private GzipJava() {}

	public static String compressGZIP(String text) throws IOException {
		// FileOutputStream output = new FileOutputStream(new File("tmp/daft.gz"));
		ByteArrayOutputStream output = new ByteArrayOutputStream();

		try (GZIPOutputStream out = new GZIPOutputStream(output)) {
			// try (FileInputStream in = new FileInputStream(text)) {
				// byte[] buffer = new byte[1024];
				// int len;
				// while((len = in.read(buffer)) != -1)
					out.write(text.getBytes());
			// }
		}

		// Comment out ByteArrayOutputStream stuff here if you switch output to a file
		byte[] buf = output.toByteArray();
		String coded = Base64.getEncoder().encodeToString(buf);
		return coded;
		// return "testing";
	}

	public static String decompressGZIP(String text) throws IOException {
		// FileInputStream input = new FileInputStream(new File("tmp/daft.gz"));
		byte[] buf = Base64.getDecoder().decode(text);

		ByteArrayInputStream input = new ByteArrayInputStream(buf);

		try (GZIPInputStream in = new GZIPInputStream(input)) {
			try (FileOutputStream out = new FileOutputStream(new File("tmp/original-daft.txt"))) {
				byte[] buffer = new byte[1024];
				int len;
				while((len = in.read(buffer)) != -1) {
					out.write(buffer, 0, len);
				}
			}
		}
		return "hellotheredecoded";
	}
}