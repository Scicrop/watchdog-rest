package com.scicrop.watchdogrest.entites;

import java.util.List;

public class WatchdogRequestEntity
  extends ParentEntity
{
  private List<ServiceEntity> services;
  
  public List<ServiceEntity> getServices() { return this.services; }


  
  public void setServices(List<ServiceEntity> services) { this.services = services; }
}
