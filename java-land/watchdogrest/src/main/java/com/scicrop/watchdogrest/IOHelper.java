package com.scicrop.watchdogrest;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.List;



public class IOHelper
{
	public static final byte[] HEX_CHAR_TABLE = new byte[] { 
			48, 49, 50, 51, 
			52, 53, 54, 55, 
			56, 57, 97, 98, 
			99, 100, 101, 102 };


	private static IOHelper INSTANCE = null;

	public static IOHelper getInstance() {
		if (INSTANCE == null) INSTANCE = new IOHelper(); 
		return INSTANCE;
	}


	public void writeStrToFile(String str, String fileName) throws Exception {
		FileWriter fw = null;
		BufferedWriter out = null;
		try {
			fw = new FileWriter(fileName);
			out = new BufferedWriter(fw);
			out.write(str);
		}
		catch (IOException e) {

			throw new Exception(e);

		}
		finally {

			if (out != null)
				try {
					out.close();
				} catch (IOException e) {
					throw new Exception(e);
				}  
			if (fw != null)
				try {
					fw.close();
				} catch (IOException e) {
					throw new Exception(e);
				}  
		} 
	}

	public String getStringFromUrlBasicAuth(String baseUrl, String args, String username, String password, String method) throws Exception {

		StringBuffer response = null;
		HttpURLConnection con = null;
		DataOutputStream wr = null;
		BufferedReader in = null;
		try{
			URL obj = new URL(baseUrl);
			con = (HttpURLConnection) obj.openConnection();

			String encoded = Base64.getEncoder().encodeToString((username+":"+password).getBytes());  
			con.setRequestProperty("Authorization", "Basic "+encoded);
			con.setRequestMethod(method);
			con.setRequestProperty("Accept-Language", "en-US,en;q=0.5");


			if(method.equalsIgnoreCase("POST") && args != null) {
				//Send post request
				con.setDoOutput(true);
				wr = new DataOutputStream(con.getOutputStream());
				wr.writeBytes(args);
			}
			int responseCode = con.getResponseCode();

			if(responseCode == 200){

				in = new BufferedReader(new InputStreamReader(con.getInputStream()));
				String inputLine;
				response = new StringBuffer();

				while ((inputLine = in.readLine()) != null) {
					response.append(inputLine);
				}

			}else throw new Exception(String.valueOf(responseCode));

		}catch(Exception e){
			throw new Exception(e);
		}finally{

			if(in != null ) try { in.close(); } catch (IOException e) { throw new Exception(e); }
			if(wr != null ) try { wr.flush(); } catch (IOException e) { throw new Exception(e); }
			if(wr != null ) try { wr.close(); } catch (IOException e) { throw new Exception(e); }
			if(con != null) con.disconnect();

		}
		//print result
		return (response.toString());
	}


	public String getStringFromUrl(String baseUrl, String method) throws Exception {
		StringBuffer response = null;
		HttpURLConnection con = null;
		DataOutputStream wr = null;
		BufferedReader in = null;

		try { 

			URL obj = new URL(baseUrl);


			con = (HttpURLConnection) obj.openConnection();
			con.setRequestMethod(method);
			con.setDoOutput(true);


			int responseCode = con.getResponseCode();

			if(responseCode == 200){

				in = new BufferedReader(new InputStreamReader(con.getInputStream()));
				String inputLine;
				response = new StringBuffer();

				while ((inputLine = in.readLine()) != null) {
					response.append(inputLine);
				}

			}else throw new Exception(String.valueOf(responseCode));





		}

		catch (IOException e)
		{ throw new Exception(e); }
		finally

		{ if (in != null) try { in.close(); } catch (IOException e) { throw new Exception(e); }
		if (wr != null) try { wr.flush(); } catch (IOException e) { throw new Exception(e); }
		if (wr != null) try { wr.close(); } catch (IOException e) { throw new Exception(e); }
		if (con != null) con.disconnect();  }  if (in != null) try { in.close(); } catch (IOException e) { throw new Exception(e); }   if (wr != null) try { wr.flush(); } catch (IOException e) { throw new Exception(e); }   if (wr != null) try { wr.close(); } catch (IOException e) { throw new Exception(e); }   if (con != null) con.disconnect();


		return response.toString();
	}



	public String getHexHashFromBytes(byte[] source, String hashDigest) throws Exception {
		String md5HexStr = null;

		try {
			MessageDigest md = MessageDigest.getInstance(hashDigest);
			byte[] digest = md.digest(source);
			md5HexStr = byteToHexstr(digest);
		} catch (IOException|java.security.NoSuchAlgorithmException e) {
			throw new Exception(hashDigest + " : "+e.getMessage());
		} 


		return md5HexStr;
	}


	public String byteToHexstr(byte[] source) throws Exception {
		byte[] hex = new byte[2 * source.length];
		int index = 0; byte b1; int i;
		byte[] arrayOfByte;
		for (i = (arrayOfByte = source).length, b1 = 0; b1 < i; ) { byte b = arrayOfByte[b1];
		int v = b & 0xFF;
		hex[index++] = HEX_CHAR_TABLE[v >>> 4];
		hex[index++] = HEX_CHAR_TABLE[v & 0xF];
		b1++; }

		String result = null;

		try {
			result = new String(hex, "ASCII");
		} catch (UnsupportedEncodingException e) {
			throw new Exception("invalid string");
		} 

		return result;
	}


	public String readTextFileToString(File source) throws Exception {
		StringBuffer output = null;



		if (source != null && source.exists() && source.isFile())
		{ Path path = source.toPath();
		try {
			List<String> lst = Files.readAllLines(path);
			output = new StringBuffer();
			for (int i = 0; i < lst.size(); i++) {
				output.append(String.valueOf(lst.get(i)) + "\n");
			}
		} catch (IOException e) {
			throw new Exception(e);
		}  }
		else { throw new Exception(); }



		return output.toString();
	}
}
