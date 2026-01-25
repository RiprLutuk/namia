package com.spam.caller.data;

import androidx.room.Database;
import androidx.room.RoomDatabase;

@Database(entities = { BlacklistedEntity.class }, version = 1, exportSchema = false)
public abstract class AppDatabase extends RoomDatabase {
   public abstract BlacklistDao blacklistDao();
}
