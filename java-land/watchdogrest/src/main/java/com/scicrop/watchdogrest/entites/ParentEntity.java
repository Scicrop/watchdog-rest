package com.scicrop.watchdogrest.entites;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class ParentEntity {
public static final String JSON_DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
	
	@Override
	public String toString() {
		return toString(JSON_DATETIME_FORMAT);
	}
	
	public String toString(String jsonDateTimeFormat) {

		String toStringReturn = null;
		Gson gson = new GsonBuilder().setDateFormat(jsonDateTimeFormat).create();
		toStringReturn = gson.toJson(this);
		return toStringReturn;
	}
}
