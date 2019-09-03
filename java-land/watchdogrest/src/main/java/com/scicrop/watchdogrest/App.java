package com.scicrop.watchdogrest;

import com.scicrop.watchdogrest.web.JettyServer;

/**
 * Hello world!
 *
 */
public class App 
{
    public static void main( String[] args )
    {
        JettyServer server = new JettyServer();
        try {
			server.start();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }
}
