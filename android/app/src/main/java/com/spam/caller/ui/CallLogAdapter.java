package com.spam.caller.ui;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.spam.caller.R;
import java.text.DateFormat;
import java.util.List;

public class CallLogAdapter extends RecyclerView.Adapter<CallLogAdapter.ViewHolder> {

   private final List<CallLogItem> items;
   private final OnReportClickListener listener;

   public interface OnReportClickListener {
      void onReportClick(CallLogItem item, int position);
   }

   public CallLogAdapter(List<CallLogItem> items, OnReportClickListener listener) {
      this.items = items;
      this.listener = listener;
   }

   @NonNull
   @Override
   public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
      View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_call_log, parent, false);
      return new ViewHolder(view);
   }

   @Override
   public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
      CallLogItem item = items.get(position);

      // Name & Number
      if (item.name != null && !item.name.isEmpty()) {
         holder.tvName.setText(item.name);
         holder.tvName.setVisibility(View.VISIBLE);
         holder.tvNumber.setText(item.number);
         holder.tvNumber.setVisibility(View.VISIBLE);
      } else {
         holder.tvName.setVisibility(View.GONE);
         holder.tvNumber.setText(item.number);
         holder.tvNumber.setVisibility(View.VISIBLE);
      }

      // Relative Time
      CharSequence relativeTime = android.text.format.DateUtils.getRelativeTimeSpanString(
            item.date,
            System.currentTimeMillis(),
            android.text.format.DateUtils.MINUTE_IN_MILLIS);
      holder.tvDate.setText(relativeTime);

      // Icon & Color Logic
      // Default trusted color (Green-ish or Blue-ish for dark mode)
      int iconColor = 0xFF4CAF50; // Green

      if (item.isBlocked) {
         iconColor = 0xFFFF5252; // Red Accent
      } else if (item.type == android.provider.CallLog.Calls.MISSED_TYPE) {
         iconColor = 0xFFFF5252; // Red for Missed
      } else {
         iconColor = 0xFF448AFF; // Blue for normal
      }

      // Icon Resource
      switch (item.type) {
         case android.provider.CallLog.Calls.INCOMING_TYPE:
            holder.ivType.setImageResource(android.R.drawable.sym_call_incoming);
            holder.ivType.setRotation(0);
            break;
         case android.provider.CallLog.Calls.OUTGOING_TYPE:
            holder.ivType.setImageResource(android.R.drawable.sym_call_outgoing);
            break;
         case android.provider.CallLog.Calls.MISSED_TYPE:
            holder.ivType.setImageResource(android.R.drawable.sym_call_missed);
            break;
         default:
            holder.ivType.setImageResource(android.R.drawable.sym_call_incoming);
            break;
      }
      holder.ivType.setColorFilter(iconColor);

      // Blocked Label
      if (item.isBlocked) {
         holder.tvBlocked.setVisibility(View.VISIBLE);
         holder.tvBlocked.setText("Spam");
         holder.btnReport.setVisibility(View.GONE);
      } else {
         holder.tvBlocked.setVisibility(View.GONE);
         holder.btnReport.setVisibility(View.VISIBLE);
         holder.btnReport.setEnabled(true);
         holder.btnReport.setText("Report");
         holder.btnReport.setBackgroundColor(0xFFD32F2F); // Red
      }

      holder.btnReport.setOnClickListener(v -> listener.onReportClick(item, position));
   }

   @Override
   public int getItemCount() {
      return items.size();
   }

   static class ViewHolder extends RecyclerView.ViewHolder {
      TextView tvNumber, tvDate, tvBlocked, tvName;
      android.widget.ImageView ivType;
      Button btnReport;

      ViewHolder(View itemView) {
         super(itemView);
         tvName = itemView.findViewById(R.id.tvName);
         tvNumber = itemView.findViewById(R.id.tvNumber);
         tvDate = itemView.findViewById(R.id.tvDate);
         tvBlocked = itemView.findViewById(R.id.tvBlocked);
         ivType = itemView.findViewById(R.id.ivType);
         btnReport = itemView.findViewById(R.id.btnReport);
      }
   }
}
