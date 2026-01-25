package com.spam.caller.worker;

import android.content.Context;
import android.content.SharedPreferences;
import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import com.spam.caller.network.ApiService;
import com.spam.caller.network.SyncResponse;
import com.spam.caller.SpamApplication;
import com.spam.caller.data.BlacklistedEntity;
import java.io.IOException;
import java.util.List;

public class SyncWorker extends Worker {

   public SyncWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
      super(context, workerParams);
   }

   @NonNull
   @Override
   public Result doWork() {
      SharedPreferences prefs = getApplicationContext().getSharedPreferences("spam_prefs", Context.MODE_PRIVATE);
      String lastSyncedAt = prefs.getString("last_synced_at", null);

      // Retrofit setup (should be singleton in real app)
      // Retrofit setup via singleton
      Retrofit retrofit = com.spam.caller.network.NetworkClient.getRetrofit();

      ApiService api = retrofit.create(ApiService.class);

      try {
         retrofit2.Response<SyncResponse> response = api.sync(lastSyncedAt).execute();
         if (response.isSuccessful() && response.body() != null) {
            SyncResponse data = response.body();
            android.util.Log.e("SpamCaller",
                  "Sync success! Received " + data.changes.size() + " changes. Timestamp: " + data.serverTimestamp);

            // Update DB
            SpamApplication.database.blacklistDao().insertAll(data.changes);
            android.util.Log.e("SpamCaller", "Inserted changes into DB");

            // Save new timestamp
            prefs.edit().putString("last_synced_at", data.serverTimestamp).apply();

            return Result.success();
         } else {
            android.util.Log.e("SpamCaller", "Sync failed: code=" + response.code());
            return Result.retry();
         }
      } catch (IOException e) {
         android.util.Log.e("SpamCaller", "Sync exception", e);
         e.printStackTrace();
         return Result.retry();
      }
   }
}
