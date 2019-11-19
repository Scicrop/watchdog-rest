package com.scicrop.watchdogrest;

import com.google.gson.Gson;
import com.scicrop.watchdogrest.entites.WatchdogRequestEntity;
import com.scicrop.watchdogrest.web.JettyServer;
import java.io.File;


public class App
{
  public static void main(String[] args) {
    if (args == null || args.length == 0 || args[0] == null) {
      System.err.println("Invalid static path.");
      System.exit(1);
    } else {
      File staticPath = new File(args[0]);
      if (staticPath.exists() && staticPath.isDirectory()) {
        JettyServer server = new JettyServer(args[0]);
        
        try {
          Gson gson = new Gson();
          
          File si = new File(String.valueOf(args[0]) + "/services_in.json");
          String servicesIn = IOHelper.getInstance().readTextFileToString(si);
          
          WatchdogRequestEntity watchdogRequestEntity = (WatchdogRequestEntity)gson.fromJson(servicesIn, WatchdogRequestEntity.class);
          SchedulerThread schedulerThread = new SchedulerThread(watchdogRequestEntity, args[0]);
          schedulerThread.start();
          server.start();
        
        }
        catch (Exception e) {
          e.printStackTrace();
        } 
      } else {
        System.err.println("Invalid static path.");
        System.exit(1);
      } 
    } 
  }
}
