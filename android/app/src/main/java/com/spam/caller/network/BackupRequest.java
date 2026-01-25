package com.spam.caller.network;

import java.util.List;
import com.google.gson.annotations.SerializedName;

public class BackupRequest {
   @SerializedName("contacts")
   public List<ContactItem> contacts;

   public BackupRequest(List<ContactItem> contacts) {
      this.contacts = contacts;
   }

   public static class ContactItem {
      @SerializedName("number")
      public String number;
      @SerializedName("name")
      public String name;

      public ContactItem(String number, String name) {
         this.number = number;
         this.name = name;
      }
   }
}
