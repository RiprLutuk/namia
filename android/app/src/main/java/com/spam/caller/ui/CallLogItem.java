package com.spam.caller.ui;

public class CallLogItem {
   public String number;
   public long date;
   public int type; // 1 = Incoming, 2 = Outgoing, 3 = Missed
   public boolean isBlocked;
   public String name;

   public CallLogItem(String number, String name, long date, int type, boolean isBlocked) {
      this.number = number;
      this.name = name;
      this.date = date;
      this.type = type;
      this.isBlocked = isBlocked;
   }
}
