package com.spam.caller.network;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Query;
import retrofit2.http.POST;
import retrofit2.http.Body;
import okhttp3.ResponseBody;
import com.spam.caller.network.SyncResponse;
import retrofit2.http.POST;
import retrofit2.http.Body;
import okhttp3.ResponseBody;
import com.spam.caller.network.ReportRequest;

import retrofit2.http.Headers;

public interface ApiService {
   @Headers("Authorization: Bearer secret-api-key")
   @GET("/api/sync")
   Call<SyncResponse> sync(@Query("last_synced_at") String lastSyncedAt);

   @Headers("Authorization: Bearer secret-api-key")
   @POST("/api/report")
   Call<ResponseBody> report(@Body ReportRequest request);

   @Headers("Authorization: Bearer secret-api-key")
   @POST("/api/contacts/backup")
   Call<ResponseBody> backupContacts(@Body com.spam.caller.network.BackupRequest request);
}
