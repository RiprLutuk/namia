package com.spam.caller;

import android.app.Activity;
import android.app.role.RoleManager;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import android.Manifest;
import android.widget.Toast;
import androidx.recyclerview.widget.RecyclerView;
import com.spam.caller.ui.CallLogAdapter;
import com.spam.caller.ui.CallLogItem;
import com.spam.caller.network.ReportRequest;
import com.spam.caller.network.ApiService;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MainActivity extends AppCompatActivity {

   private static final int REQUEST_CODE_ROLE = 1;
   private static final int REQUEST_CODE_PERMISSION = 2;
   private androidx.recyclerview.widget.RecyclerView rvCallLog;
   private com.spam.caller.ui.CallLogAdapter adapter;

   @Override
   protected void onCreate(Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);
      setContentView(R.layout.activity_main);

      findViewById(R.id.btnManage).setOnClickListener(v -> {
         startActivity(new Intent(this, BlockedListActivity.class));
      });

      findViewById(R.id.btnBackup).setOnClickListener(v -> {
         if (checkSelfPermission(
               android.Manifest.permission.READ_CONTACTS) != android.content.pm.PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[] { android.Manifest.permission.READ_CONTACTS }, 101);
         } else {
            startBackup();
         }
      });

      rvCallLog = findViewById(R.id.rvCallLog);
      rvCallLog.setLayoutManager(new androidx.recyclerview.widget.LinearLayoutManager(this));

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
         RoleManager roleManager = (RoleManager) getSystemService(Context.ROLE_SERVICE);
         if (roleManager != null && roleManager.isRoleAvailable(RoleManager.ROLE_CALL_SCREENING)) {
            if (roleManager.isRoleHeld(RoleManager.ROLE_CALL_SCREENING)) {
               // Already has role, start sync
               scheduleSync();
               checkCallLogPermission();
            } else {
               // Request role
               Intent intent = roleManager.createRequestRoleIntent(RoleManager.ROLE_CALL_SCREENING);
               startActivityForResult(intent, REQUEST_CODE_ROLE);
            }
         }
      }
   }

   private void checkCallLogPermission() {
      if (checkSelfPermission(
            android.Manifest.permission.READ_CALL_LOG) != android.content.pm.PackageManager.PERMISSION_GRANTED) {
         requestPermissions(new String[] { android.Manifest.permission.READ_CALL_LOG }, REQUEST_CODE_PERMISSION);
      } else {
         loadCallLog();
      }
   }

   private void loadCallLog() {
      // Run DB query in background
      new Thread(() -> {
         java.util.List<String> blockedNumbers = com.spam.caller.SpamApplication.database.blacklistDao()
               .getAllActiveNumbers();
         java.util.Set<String> blockedSet = new java.util.HashSet<>(blockedNumbers);

         runOnUiThread(() -> fetchCallLogWithBlockedInfo(blockedSet));
      }).start();
   }

   private void fetchCallLogWithBlockedInfo(java.util.Set<String> blockedSet) {
      java.util.List<com.spam.caller.ui.CallLogItem> items = new java.util.ArrayList<>();
      android.database.Cursor cursor = getContentResolver().query(
            android.provider.CallLog.Calls.CONTENT_URI,
            null, null, null, android.provider.CallLog.Calls.DATE + " DESC");

      if (cursor != null) {
         int numberIndex = cursor.getColumnIndex(android.provider.CallLog.Calls.NUMBER);
         int dateIndex = cursor.getColumnIndex(android.provider.CallLog.Calls.DATE);
         int typeIndex = cursor.getColumnIndex(android.provider.CallLog.Calls.TYPE);
         int nameIndex = cursor.getColumnIndex(android.provider.CallLog.Calls.CACHED_NAME);

         while (cursor.moveToNext() && items.size() < 50) {
            String number = cursor.getString(numberIndex);
            long date = cursor.getLong(dateIndex);
            int type = cursor.getInt(typeIndex);
            String name = (nameIndex != -1) ? cursor.getString(nameIndex) : null;

            String normalized = normalizePhoneNumber(number);
            boolean isBlocked = blockedSet.contains(normalized);
            // Also check for "suspected" if mocking API logic (optional, for now just DB)

            items.add(new com.spam.caller.ui.CallLogItem(number, name, date, type, isBlocked));
         }
         cursor.close();
      }

      adapter = new com.spam.caller.ui.CallLogAdapter(items, this::reportSpam);
      rvCallLog.setAdapter(adapter);
   }

   private String normalizePhoneNumber(String number) {
      if (number == null)
         return "";
      String digits = number.replaceAll("[^0-9]", "");
      if (digits.startsWith("62")) {
         digits = "0" + digits.substring(2);
      }
      return digits;
   }

   private void reportSpam(com.spam.caller.ui.CallLogItem item, int position) {
      String deviceId = android.provider.Settings.Secure.getString(getContentResolver(),
            android.provider.Settings.Secure.ANDROID_ID);
      com.spam.caller.network.ReportRequest request = new com.spam.caller.network.ReportRequest(item.number,
            "Manually Reported", deviceId);

      com.spam.caller.network.ApiService api = com.spam.caller.network.NetworkClient.getRetrofit()
            .create(com.spam.caller.network.ApiService.class);
      api.report(request).enqueue(new retrofit2.Callback<okhttp3.ResponseBody>() {
         @Override
         public void onResponse(retrofit2.Call<okhttp3.ResponseBody> call,
               retrofit2.Response<okhttp3.ResponseBody> response) {
            if (response.isSuccessful()) {
               android.widget.Toast
                     .makeText(MainActivity.this, "Reported & Blocked!", android.widget.Toast.LENGTH_SHORT).show();

               // Update UI immediately
               item.isBlocked = true;
               adapter.notifyItemChanged(position);

               // Persist to local DB immediately (Don't wait for Sync)
               new Thread(() -> {
                  com.spam.caller.data.BlacklistedEntity entity = new com.spam.caller.data.BlacklistedEntity(
                        normalizePhoneNumber(item.number),
                        "Manually Reported",
                        "user_report",
                        "active");
                  com.spam.caller.SpamApplication.database.blacklistDao().insert(entity);
               }).start();

               // Trigger sync
               scheduleSync();
            } else {
               android.widget.Toast.makeText(MainActivity.this, "Failed to report: " + response.code(),
                     android.widget.Toast.LENGTH_SHORT).show();
            }
         }

         @Override
         public void onFailure(retrofit2.Call<okhttp3.ResponseBody> call, Throwable t) {
            android.widget.Toast
                  .makeText(MainActivity.this, "Error: " + t.getMessage(), android.widget.Toast.LENGTH_SHORT).show();
         }
      });
   }

   private void requestRole() {
      // Deprecated
   }

   @Override
   public void onActivityResult(int requestCode, int resultCode, Intent data) {
      super.onActivityResult(requestCode, resultCode, data);
      if (requestCode == REQUEST_CODE_ROLE) {
         if (resultCode == Activity.RESULT_OK) {
            // Role granted. Schedule SyncWorker.
            scheduleSync();
            checkCallLogPermission();
         }
      }
   }

   private void startBackup() {
      android.widget.Toast.makeText(this, "Starting Background Backup...", android.widget.Toast.LENGTH_SHORT).show();
      androidx.work.OneTimeWorkRequest backupRequest = new androidx.work.OneTimeWorkRequest.Builder(
            com.spam.caller.worker.BackupWorker.class).build();
      androidx.work.WorkManager.getInstance(this).enqueue(backupRequest);
   }

   @Override
   public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
      super.onRequestPermissionsResult(requestCode, permissions, grantResults);
      if (requestCode == REQUEST_CODE_PERMISSION) {
         if (grantResults.length > 0 && grantResults[0] == android.content.pm.PackageManager.PERMISSION_GRANTED) {
            loadCallLog();
         }
      } else if (requestCode == 101) {
         if (grantResults.length > 0 && grantResults[0] == android.content.pm.PackageManager.PERMISSION_GRANTED) {
            startBackup();
         }
      }
   }

   private void scheduleSync() {
      androidx.work.PeriodicWorkRequest syncRequest = new androidx.work.PeriodicWorkRequest.Builder(
            com.spam.caller.worker.SyncWorker.class, 15, java.util.concurrent.TimeUnit.MINUTES)
            .build();
      androidx.work.WorkManager.getInstance(this).enqueueUniquePeriodicWork(
            "spam_sync",
            androidx.work.ExistingPeriodicWorkPolicy.KEEP,
            syncRequest);

      // Also run a one-time sync immediately for testing
      androidx.work.OneTimeWorkRequest oneTimeSync = new androidx.work.OneTimeWorkRequest.Builder(
            com.spam.caller.worker.SyncWorker.class).build();
      androidx.work.WorkManager.getInstance(this).enqueue(oneTimeSync);
   }
}
