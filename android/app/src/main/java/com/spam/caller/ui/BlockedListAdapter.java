package com.spam.caller.ui;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.spam.caller.R;
import com.spam.caller.data.BlacklistedEntity;
import java.util.List;

public class BlockedListAdapter extends RecyclerView.Adapter<BlockedListAdapter.ViewHolder> {

   private final List<BlacklistedEntity> items;

   public BlockedListAdapter(List<BlacklistedEntity> items) {
      this.items = items;
   }

   @NonNull
   @Override
   public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
      View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_blocked_number, parent, false);
      return new ViewHolder(view);
   }

   @Override
   public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
      BlacklistedEntity item = items.get(position);
      holder.tvNumber.setText(item.phoneNumber);

      String reason = item.reason;
      if (reason == null || reason.isEmpty()) {
         reason = "Spam";
      }
      holder.tvReason.setText(reason);

      holder.btnUnblock.setOnClickListener(v -> {
         // Unblock logic TODO
         // For now just toast or ignoring
         android.widget.Toast
               .makeText(v.getContext(), "Long press to unblock (Coming Soon)", android.widget.Toast.LENGTH_SHORT)
               .show();
      });
   }

   @Override
   public int getItemCount() {
      return items.size();
   }

   static class ViewHolder extends RecyclerView.ViewHolder {
      TextView tvNumber, tvReason;
      android.widget.Button btnUnblock;

      ViewHolder(View itemView) {
         super(itemView);
         tvNumber = itemView.findViewById(R.id.tvNumber);
         tvReason = itemView.findViewById(R.id.tvReason);
         btnUnblock = itemView.findViewById(R.id.btnUnblock);
      }
   }
}
