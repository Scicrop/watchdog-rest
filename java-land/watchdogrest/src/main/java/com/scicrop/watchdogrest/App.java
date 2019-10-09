package com.scicrop.watchdogrest;

import java.io.File;

import com.scicrop.watchdogrest.web.JettyServer;

public class App {
    public static void main( String[] args )
    {
    	if(args == null || args.length == 0 || args[0] == null) {
    		System.err.println("Invalid static path.");
    		System.exit(1);
    	}else {
    		File staticPath = new File(args[0]);
    		if(staticPath.exists() && staticPath.isDirectory()) {
    			JettyServer server = new JettyServer(args[0]);
    	        try {
    				server.start();
    			} catch (Exception e) {
    				e.printStackTrace();
    			}
    		}else {
    			System.err.println("Invalid static path.");
        		System.exit(1);
    		}
    	}
        
    }
}
