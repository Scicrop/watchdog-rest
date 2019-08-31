package com.scicrop.watchdogrest;

import java.util.Date;

import org.junit.Test;

import com.scicrop.watchdogrest.entites.WatchdogResponseEntity;

/**
 * Unit test for simple App.
 */
public class AppTest {
	
	@Test
	public void test() {
		
		WatchdogResponseEntity watchdogResponseEntity = new WatchdogResponseEntity();
		watchdogResponseEntity.setMonitored_service("test");
		watchdogResponseEntity.setCheck_timestamp(new Date().getTime());
		watchdogResponseEntity.setDescription("test");
		watchdogResponseEntity.setRowcount(0);
		watchdogResponseEntity.setRoot_uri("test");
		
		System.out.println(watchdogResponseEntity.toString());
		
	}
	
}
