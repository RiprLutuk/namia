package com.spam.caller.data;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import java.util.List;

@Dao
public interface BlacklistDao {
   @Query("SELECT * FROM blacklisted_numbers WHERE phoneNumber = :number AND status = 'active' LIMIT 1")
   BlacklistedEntity findActiveByNumber(String number);

   @Query("SELECT phoneNumber FROM blacklisted_numbers WHERE status = 'active'")
   List<String> getAllActiveNumbers();

   @Query("SELECT * FROM blacklisted_numbers WHERE status = 'active' ORDER BY phoneNumber ASC")
   List<BlacklistedEntity> getAllActiveEntities();

   @Insert(onConflict = OnConflictStrategy.REPLACE)
   void insertAll(List<BlacklistedEntity> numbers);

   @Insert(onConflict = OnConflictStrategy.REPLACE)
   void insert(BlacklistedEntity number);

   @Query("DELETE FROM blacklisted_numbers WHERE status = 'deleted'")
   void cleanupDeleted();
}
