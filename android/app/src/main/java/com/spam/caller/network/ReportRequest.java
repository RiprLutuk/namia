package com.spam.caller.network;

public class ReportRequest {
   public String phone_number;
   public String reason;
   public String device_id;

   public ReportRequest(String phone_number, String reason, String device_id) {
      this.phone_number = phone_number;
      this.reason = reason;
      this.device_id = device_id;
   }
}
