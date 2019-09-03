package com.scicrop.watchdogrest.web;

import org.eclipse.jetty.server.Connector;
import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.ServerConnector;
import org.eclipse.jetty.server.handler.ContextHandler;
import org.eclipse.jetty.server.handler.ContextHandlerCollection;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHandler;

import com.scicrop.watchdogrest.web.servlets.ArtifactsServlet;

public class JettyServer {
	
	private Server server;
	 
    public void start() throws Exception {
        server = new Server();
        ServerConnector connector = new ServerConnector(server);
        connector.setPort(8089);
        server.setConnectors(new Connector[] {connector});
        
        
        ServletContextHandler servletContextHandler = new ServletContextHandler();
        servletContextHandler.addServlet(ArtifactsServlet.class, "/status");
        

        
        String webroot = "./web";
        ResourceHandler resourceHandler = new ResourceHandler();
        resourceHandler.setDirAllowed(true);
        resourceHandler.setResourceBase("/tmp/");
        ContextHandler contextHandler= new ContextHandler("/static");
        contextHandler.setHandler(resourceHandler);
        
        
        ContextHandlerCollection contexts = new ContextHandlerCollection();
        contexts.setHandlers(new Handler[]{
            contextHandler, servletContextHandler
        });
        
        
        server.setHandler(contexts);
        
        
        
        server.start();
        server.join();
        
    }

}
