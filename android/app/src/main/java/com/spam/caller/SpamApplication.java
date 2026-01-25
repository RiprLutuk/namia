package com.spam.caller;

import android.app.Application;
import androidx.room.Room;
import com.spam.caller.data.AppDatabase;

public class SpamApplication extends Application {
   public static AppDatabase database;

   @Override
   public void onCreate() {
      super.onCreate();
      database = Room.databaseBuilder(getApplicationContext(),
            AppDatabase.class, "spam-caller-db")
            .allowMainThreadQueries() // Not recommended for UI, but okay for Service speed if DB small. Ideally use
                                      // async inside Service.
            .build();
   }
}
