package com.spam.caller.data;

import androidx.room.Entity;
import androidx.room.PrimaryKey;
import androidx.annotation.NonNull;
import com.google.gson.annotations.SerializedName;

@Entity(tableName = "blacklisted_numbers")
public class BlacklistedEntity {
   @PrimaryKey
   @NonNull
   @SerializedName("phone_number")
   public String phoneNumber;

   @SerializedName("reason")
   public String reason;
   @SerializedName("source")
   public String source;
   @SerializedName("status")
   public String status; // active or deleted

   // updated_at is in JSON but not in Entity yet, optional to store?
   // Maybe store last_synced in prefs, so not needed in Entity.

   public BlacklistedEntity() {
   } // Empty constructor for Room/Gson

   @androidx.room.Ignore
   public BlacklistedEntity(@NonNull String phoneNumber, String reason, String source, String status) {
      this.phoneNumber = phoneNumber;
      this.reason = reason;
      this.source = source;
      this.status = status;
   }
}
