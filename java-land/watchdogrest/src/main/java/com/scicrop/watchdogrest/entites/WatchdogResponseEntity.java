package com.scicrop.watchdogrest.entites;

public class WatchdogResponseEntity extends ParentEntity {

	private String monitored_service;
	private String root_uri;
	private Long check_timestamp;
	private Integer rowcount;
	private String description;
	
	public String getMonitored_service() {
		return monitored_service;
	}
	public void setMonitored_service(String monitored_service) {
		this.monitored_service = monitored_service;
	}
	public String getRoot_uri() {
		return root_uri;
	}
	public void setRoot_uri(String root_uri) {
		this.root_uri = root_uri;
	}
	public Long getCheck_timestamp() {
		return check_timestamp;
	}
	public void setCheck_timestamp(Long check_timestamp) {
		this.check_timestamp = check_timestamp;
	}
	public int getRowcount() {
		return rowcount;
	}
	public void setRowcount(int rowcount) {
		this.rowcount = rowcount;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	
	
}
