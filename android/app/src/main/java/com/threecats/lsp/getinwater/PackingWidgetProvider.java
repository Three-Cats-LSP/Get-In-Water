package com.threecats.lsp.getinwater;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
import org.json.JSONObject;

public class PackingWidgetProvider extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager mgr, int[] appWidgetIds) {
        SharedPreferences prefs = context.getSharedPreferences("giw_widget", Context.MODE_PRIVATE);
        String raw = prefs.getString("data", "{}");
        String name = "Get In Water";
        String detail = "Pin a trip in the app";
        try {
            JSONObject obj = new JSONObject(raw);
            name = obj.optString("name", name);
            int remaining = obj.optInt("remaining", -1);
            int total = obj.optInt("total", 0);
            if (remaining >= 0 && total > 0) {
                detail = remaining == 0 ? "All packed!" : remaining + " item" + (remaining == 1 ? "" : "s") + " left";
            } else if (remaining == 0) {
                detail = "All packed!";
            }
        } catch (Exception ignored) {}

        Intent launch = new Intent(context, MainActivity.class);
        launch.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pi = PendingIntent.getActivity(
            context, 0, launch,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        for (int id : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_packing);
            views.setTextViewText(R.id.widget_title, name);
            views.setTextViewText(R.id.widget_detail, detail);
            views.setOnClickPendingIntent(R.id.widget_root, pi);
            mgr.updateAppWidget(id, views);
        }
    }
}
