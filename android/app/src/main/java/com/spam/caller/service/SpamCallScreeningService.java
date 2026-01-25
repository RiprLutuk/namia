package com.spam.caller.service;

import android.net.Uri;
import android.telecom.Call;
import android.telecom.CallScreeningService;
import android.telecom.Connection;
import com.spam.caller.SpamApplication;
import com.spam.caller.data.BlacklistedEntity;

public class SpamCallScreeningService extends CallScreeningService {
   @Override
   public void onScreenCall(Call.Details callDetails) {
      if (callDetails.getHandle() == null) {
         android.util.Log.e("SpamCaller", "Handle is null, skipping");
         return;
      }

      String rawNumber = callDetails.getHandle().getSchemeSpecificPart();
      // Normalize number: remove +62, replace with 0, remove dashes/spaces
      String normalizedNumber = normalizePhoneNumber(rawNumber);

      android.util.Log.e("SpamCaller", "Incoming Call: Raw=" + rawNumber + ", Normalized=" + normalizedNumber);

      // Check local DB (Fast)
      BlacklistedEntity entity = SpamApplication.database.blacklistDao().findActiveByNumber(normalizedNumber);

      boolean isSpam = false;
      if (entity != null) {
         isSpam = true;
         android.util.Log.e("SpamCaller", "Local DB MATCH: " + entity.reason);
      } else {
         // Check API (Slow/Real-time) - only if unknown
         android.util.Log.e("SpamCaller", "Local DB MISS. Checking External API...");
         isSpam = SpamDetector.isSpam(normalizedNumber); // Synchronous call (careful with timeout in real app)

         if (isSpam) {
            // Auto-Report to Backend
            autoReportSpam(normalizedNumber);
         }
      }

      CallResponse.Builder response = new CallResponse.Builder();

      if (isSpam) {
         android.util.Log.e("SpamCaller", "BLOCKING call from " + normalizedNumber);
         // Block call
         response.setDisallowCall(true);
         response.setRejectCall(true);
         response.setSkipCallLog(false);
         response.setSkipNotification(true);
      } else {
         android.util.Log.d("SpamCaller", "Allowing call from " + normalizedNumber);
         // Allow call
         response.setDisallowCall(false);
         response.setRejectCall(false);
         response.setSkipCallLog(false);
         response.setSkipNotification(false);
      }

      respondToCall(callDetails, response.build());
   }

   private void autoReportSpam(String number) {
      String deviceId = android.provider.Settings.Secure.getString(getContentResolver(),
            android.provider.Settings.Secure.ANDROID_ID);
      com.spam.caller.network.ReportRequest request = new com.spam.caller.network.ReportRequest(number,
            "Auto-Detected by API", deviceId);

      com.spam.caller.network.ApiService api = com.spam.caller.network.NetworkClient.getRetrofit()
            .create(com.spam.caller.network.ApiService.class);
      api.report(request).enqueue(new retrofit2.Callback<okhttp3.ResponseBody>() {
         @Override
         public void onResponse(retrofit2.Call<okhttp3.ResponseBody> call,
               retrofit2.Response<okhttp3.ResponseBody> response) {
            android.util.Log.e("SpamCaller", "Auto-Reported to backend: " + response.code());
         }

         @Override
         public void onFailure(retrofit2.Call<okhttp3.ResponseBody> call, Throwable t) {
            android.util.Log.e("SpamCaller", "Failed to Auto-Report", t);
         }
      });
   }

   private String normalizePhoneNumber(String number) {
      if (number == null)
         return "";
      // Remove non-digits
      String digits = number.replaceAll("[^0-9]", "");
      // Replace +62 with 0 if it starts with 62
      if (digits.startsWith("62")) {
         digits = "0" + digits.substring(2);
      }
      return digits;
   }
}
