package com.scicrop.watchdogrest;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;
import com.scicrop.watchdogrest.entites.ServiceEntity;
import com.scicrop.watchdogrest.entites.WatchdogRequestEntity;
import com.scicrop.watchdogrest.entites.WatchdogResponseEntity;

public class SchedulerThread extends Thread {

	private WatchdogRequestEntity watchdogRequestEntity;
	private String outputDir;

	public SchedulerThread(WatchdogRequestEntity watchdogRequestEntity, String outputDir) {
		this.watchdogRequestEntity = watchdogRequestEntity;
		this.outputDir = outputDir;
	}

	public void run() {
		try {
			while(true) {
				List<ServiceEntity> services = watchdogRequestEntity.getServices();
				List<ServiceEntity> servicesOut = new ArrayList<ServiceEntity>(); 
				Gson gson = new Gson();
				WatchdogResponseEntity wr = null;
				for (ServiceEntity serviceEntity : services) {
					try {
						ServiceEntity service = new ServiceEntity();
						service.setServiceName(serviceEntity.getServiceName());
						service.setStyle(serviceEntity.getStyle());
						String response = null;
						
						
						
						switch (serviceEntity.getType().toUpperCase()) {
						case "REST":
							try {
								response = IOHelper.getInstance().getStringFromUrlBasicAuth(serviceEntity.getUrl(), null, serviceEntity.getUser(), serviceEntity.getPassword(), serviceEntity.getMethod().toUpperCase());
								wr = gson.fromJson(response, WatchdogResponseEntity.class);
							}catch (Exception e) {
								
								e.printStackTrace();
								
								wr = new WatchdogResponseEntity();
								wr.setValue(null);
							}

							service.setResponse(wr);

							break;

						case "HASH":
							String hash = null;
							try {
								response = IOHelper.getInstance().getStringFromUrl(serviceEntity.getUrl(), "GET");
								hash = IOHelper.getInstance().getHexHashFromBytes(response.getBytes(), serviceEntity.getMethod());
							}catch(Exception e) {e.printStackTrace();}
							wr = new WatchdogResponseEntity();				
							wr.setValue(hash);
							service.setResponse(wr );
							break;
							
						case "FULL":
							wr = new WatchdogResponseEntity();
							wr.setValue(serviceEntity.getUrl());
							service.setResponse(wr );							
							break;
							
						default:
							break;
						}


						
						int level = evalResponse(service.getResponse().getValue(), serviceEntity.getExpected());
						service.setLevel(level);
						servicesOut.add(service);
						
						
						

					} catch (Exception e) {
						e.printStackTrace();
					}
				}

				IOHelper.getInstance().writeStrToFile(servicesOut.toString(), outputDir+"/services_out.json");

				Thread.sleep(30000);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private int evalResponse(String value, String expected) {
		int level = 1; 

		if(value != null) {

			String[] exp = expected.split(":");

			Double dval = null;
			Double exval = null;

			try {
				dval = Double.parseDouble(value);
				exval = Double.parseDouble(exp[1]);
			} catch (Exception e) {}

			if(dval != null && exval != null) {

				switch (exp[0]) {
				case ">":
					if(dval > exval) level = 0; else level = 1;
					break;

				case "<":
					if(dval < exval) level = 0; else level = 1;
					break;

				case ">=":
					if(dval >= exval) level = 0; else level = 1;
					break;

				case "<=":
					if(dval <= exval) level = 0; else level = 1;
					break;

				case "==":
					if(dval.compareTo(exval) == 0) level = 0; else level = 1;
					break;

				default:
					break;
				}

			}else {
				if(exp != null && exp.length == 2 && exp[1].equals(value) && exp[0].equals("=="))  level = 0; else level = 1;
			}
		}

		return level;
	}

}
