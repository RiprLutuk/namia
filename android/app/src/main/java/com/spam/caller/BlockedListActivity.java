package com.spam.caller;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.spam.caller.ui.BlockedListAdapter;
import com.spam.caller.data.BlacklistedEntity;
import java.util.List;

public class BlockedListActivity extends AppCompatActivity {

   @Override
   protected void onCreate(Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);
      setContentView(R.layout.activity_blocked_list);

      RecyclerView rv = findViewById(R.id.rvBlockedList);
      rv.setLayoutManager(new LinearLayoutManager(this));

      new Thread(() -> {
         // DAO method needed: getAllActiveEntities()
         // We previously added getAllActiveNumbers (String), let's see if we need full
         // entity.
         // For now using getAllActiveEntities (need to add to DAO)
         List<BlacklistedEntity> list = SpamApplication.database.blacklistDao().getAllActiveEntities();
         runOnUiThread(() -> {
            rv.setAdapter(new BlockedListAdapter(list));
         });
      }).start();
   }
}
