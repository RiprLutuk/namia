package com.spam.caller.network;

import com.google.gson.annotations.SerializedName;
import com.spam.caller.data.BlacklistedEntity;
import java.util.List;

public class SyncResponse {
   @SerializedName("changes")
   public List<BlacklistedEntity> changes;

   @SerializedName("server_timestamp")
   public String serverTimestamp;
}
