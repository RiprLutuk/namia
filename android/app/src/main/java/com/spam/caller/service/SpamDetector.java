package com.spam.caller.service;

import java.io.IOException;

public class SpamDetector {

   // Mock implementation for now
   public static boolean isSpam(String phoneNumber) {
      // Simulate network delay
      try {
         Thread.sleep(500);
      } catch (InterruptedException e) {
         e.printStackTrace();
      }

      // Mock Logic:
      // Real implementation would call IPQualityScore or AbstractAPI here.
      // For testing "0888888888" is the 0-day spammer.
      if ("0888888888".equals(phoneNumber)) {
         android.util.Log.e("SpamDetector", "DETECTED SPAM via API for: " + phoneNumber);
         return true;
      }

      return false;
   }
}
