package com.spam.caller.data;

import android.database.Cursor;
import androidx.annotation.NonNull;
import androidx.room.EntityInsertionAdapter;
import androidx.room.RoomDatabase;
import androidx.room.RoomSQLiteQuery;
import androidx.room.SharedSQLiteStatement;
import androidx.room.util.CursorUtil;
import androidx.room.util.DBUtil;
import androidx.sqlite.db.SupportSQLiteStatement;
import java.lang.Class;
import java.lang.Override;
import java.lang.String;
import java.lang.SuppressWarnings;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@SuppressWarnings({"unchecked", "deprecation"})
public final class BlacklistDao_Impl implements BlacklistDao {
  private final RoomDatabase __db;

  private final EntityInsertionAdapter<BlacklistedEntity> __insertionAdapterOfBlacklistedEntity;

  private final SharedSQLiteStatement __preparedStmtOfCleanupDeleted;

  public BlacklistDao_Impl(@NonNull final RoomDatabase __db) {
    this.__db = __db;
    this.__insertionAdapterOfBlacklistedEntity = new EntityInsertionAdapter<BlacklistedEntity>(__db) {
      @Override
      @NonNull
      protected String createQuery() {
        return "INSERT OR REPLACE INTO `blacklisted_numbers` (`phoneNumber`,`reason`,`source`,`status`) VALUES (?,?,?,?)";
      }

      @Override
      protected void bind(@NonNull final SupportSQLiteStatement statement,
          final BlacklistedEntity entity) {
        if (entity.phoneNumber == null) {
          statement.bindNull(1);
        } else {
          statement.bindString(1, entity.phoneNumber);
        }
        if (entity.reason == null) {
          statement.bindNull(2);
        } else {
          statement.bindString(2, entity.reason);
        }
        if (entity.source == null) {
          statement.bindNull(3);
        } else {
          statement.bindString(3, entity.source);
        }
        if (entity.status == null) {
          statement.bindNull(4);
        } else {
          statement.bindString(4, entity.status);
        }
      }
    };
    this.__preparedStmtOfCleanupDeleted = new SharedSQLiteStatement(__db) {
      @Override
      @NonNull
      public String createQuery() {
        final String _query = "DELETE FROM blacklisted_numbers WHERE status = 'deleted'";
        return _query;
      }
    };
  }

  @Override
  public void insertAll(final List<BlacklistedEntity> numbers) {
    __db.assertNotSuspendingTransaction();
    __db.beginTransaction();
    try {
      __insertionAdapterOfBlacklistedEntity.insert(numbers);
      __db.setTransactionSuccessful();
    } finally {
      __db.endTransaction();
    }
  }

  @Override
  public void insert(final BlacklistedEntity number) {
    __db.assertNotSuspendingTransaction();
    __db.beginTransaction();
    try {
      __insertionAdapterOfBlacklistedEntity.insert(number);
      __db.setTransactionSuccessful();
    } finally {
      __db.endTransaction();
    }
  }

  @Override
  public void cleanupDeleted() {
    __db.assertNotSuspendingTransaction();
    final SupportSQLiteStatement _stmt = __preparedStmtOfCleanupDeleted.acquire();
    try {
      __db.beginTransaction();
      try {
        _stmt.executeUpdateDelete();
        __db.setTransactionSuccessful();
      } finally {
        __db.endTransaction();
      }
    } finally {
      __preparedStmtOfCleanupDeleted.release(_stmt);
    }
  }

  @Override
  public BlacklistedEntity findActiveByNumber(final String number) {
    final String _sql = "SELECT * FROM blacklisted_numbers WHERE phoneNumber = ? AND status = 'active' LIMIT 1";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 1);
    int _argIndex = 1;
    if (number == null) {
      _statement.bindNull(_argIndex);
    } else {
      _statement.bindString(_argIndex, number);
    }
    __db.assertNotSuspendingTransaction();
    final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
    try {
      final int _cursorIndexOfPhoneNumber = CursorUtil.getColumnIndexOrThrow(_cursor, "phoneNumber");
      final int _cursorIndexOfReason = CursorUtil.getColumnIndexOrThrow(_cursor, "reason");
      final int _cursorIndexOfSource = CursorUtil.getColumnIndexOrThrow(_cursor, "source");
      final int _cursorIndexOfStatus = CursorUtil.getColumnIndexOrThrow(_cursor, "status");
      final BlacklistedEntity _result;
      if (_cursor.moveToFirst()) {
        _result = new BlacklistedEntity();
        if (_cursor.isNull(_cursorIndexOfPhoneNumber)) {
          _result.phoneNumber = null;
        } else {
          _result.phoneNumber = _cursor.getString(_cursorIndexOfPhoneNumber);
        }
        if (_cursor.isNull(_cursorIndexOfReason)) {
          _result.reason = null;
        } else {
          _result.reason = _cursor.getString(_cursorIndexOfReason);
        }
        if (_cursor.isNull(_cursorIndexOfSource)) {
          _result.source = null;
        } else {
          _result.source = _cursor.getString(_cursorIndexOfSource);
        }
        if (_cursor.isNull(_cursorIndexOfStatus)) {
          _result.status = null;
        } else {
          _result.status = _cursor.getString(_cursorIndexOfStatus);
        }
      } else {
        _result = null;
      }
      return _result;
    } finally {
      _cursor.close();
      _statement.release();
    }
  }

  @Override
  public List<String> getAllActiveNumbers() {
    final String _sql = "SELECT phoneNumber FROM blacklisted_numbers WHERE status = 'active'";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 0);
    __db.assertNotSuspendingTransaction();
    final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
    try {
      final List<String> _result = new ArrayList<String>(_cursor.getCount());
      while (_cursor.moveToNext()) {
        final String _item;
        if (_cursor.isNull(0)) {
          _item = null;
        } else {
          _item = _cursor.getString(0);
        }
        _result.add(_item);
      }
      return _result;
    } finally {
      _cursor.close();
      _statement.release();
    }
  }

  @Override
  public List<BlacklistedEntity> getAllActiveEntities() {
    final String _sql = "SELECT * FROM blacklisted_numbers WHERE status = 'active' ORDER BY phoneNumber ASC";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 0);
    __db.assertNotSuspendingTransaction();
    final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
    try {
      final int _cursorIndexOfPhoneNumber = CursorUtil.getColumnIndexOrThrow(_cursor, "phoneNumber");
      final int _cursorIndexOfReason = CursorUtil.getColumnIndexOrThrow(_cursor, "reason");
      final int _cursorIndexOfSource = CursorUtil.getColumnIndexOrThrow(_cursor, "source");
      final int _cursorIndexOfStatus = CursorUtil.getColumnIndexOrThrow(_cursor, "status");
      final List<BlacklistedEntity> _result = new ArrayList<BlacklistedEntity>(_cursor.getCount());
      while (_cursor.moveToNext()) {
        final BlacklistedEntity _item;
        _item = new BlacklistedEntity();
        if (_cursor.isNull(_cursorIndexOfPhoneNumber)) {
          _item.phoneNumber = null;
        } else {
          _item.phoneNumber = _cursor.getString(_cursorIndexOfPhoneNumber);
        }
        if (_cursor.isNull(_cursorIndexOfReason)) {
          _item.reason = null;
        } else {
          _item.reason = _cursor.getString(_cursorIndexOfReason);
        }
        if (_cursor.isNull(_cursorIndexOfSource)) {
          _item.source = null;
        } else {
          _item.source = _cursor.getString(_cursorIndexOfSource);
        }
        if (_cursor.isNull(_cursorIndexOfStatus)) {
          _item.status = null;
        } else {
          _item.status = _cursor.getString(_cursorIndexOfStatus);
        }
        _result.add(_item);
      }
      return _result;
    } finally {
      _cursor.close();
      _statement.release();
    }
  }

  @NonNull
  public static List<Class<?>> getRequiredConverters() {
    return Collections.emptyList();
  }
}
