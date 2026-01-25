package com.spam.caller.worker;

import android.content.Context;
import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;
import android.database.Cursor;
import android.provider.ContactsContract;
import java.util.ArrayList;
import java.util.List;
import com.spam.caller.network.BackupRequest;
import com.spam.caller.network.ApiService;
import com.spam.caller.network.NetworkClient;

public class BackupWorker extends Worker {

   public BackupWorker(@NonNull Context context, @NonNull WorkerParameters params) {
      super(context, params);
   }

   @NonNull
   @Override
   public Result doWork() {
      android.util.Log.d("BackupWorker", "Starting contact backup...");

      // 1. Read Contacts
      List<BackupRequest.ContactItem> contacts = new ArrayList<>();
      Cursor cursor = getApplicationContext().getContentResolver().query(
            ContactsContract.CommonDataKinds.Phone.CONTENT_URI,
            null, null, null, null);

      if (cursor != null) {
         int nameIdx = cursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME);
         int numIdx = cursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER);

         while (cursor.moveToNext()) {
            String name = cursor.getString(nameIdx);
            String number = cursor.getString(numIdx);
            contacts.add(new BackupRequest.ContactItem(number, name));
         }
         cursor.close();
      }

      android.util.Log.d("BackupWorker", "Found " + contacts.size() + " contacts to backup.");
      if (contacts.isEmpty())
         return Result.success();

      // 2. Send to API
      try {
         ApiService api = NetworkClient.getRetrofit().create(ApiService.class);
         okhttp3.ResponseBody response = api.backupContacts(new BackupRequest(contacts)).execute().body();
         // TODO: Handle failure properly (Result.retry())
         android.util.Log.d("BackupWorker", "Backup success!");
         return Result.success();
      } catch (Exception e) {
         e.printStackTrace();
         return Result.retry();
      }
   }
}
