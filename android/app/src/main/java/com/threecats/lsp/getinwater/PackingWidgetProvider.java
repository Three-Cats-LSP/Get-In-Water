package com.threecats.lsp.getinwater;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
import org.json.JSONObject;

public class PackingWidgetProvider extends AppWidgetProvider {

    public static void refreshAll(Context context) {
        AppWidgetManager mgr = AppWidgetManager.getInstance(context);
        ComponentName cn = new ComponentName(context, PackingWidgetProvider.class);
        int[] ids = mgr.getAppWidgetIds(cn);
        if (ids.length > 0) {
            updateWidgets(context, mgr, ids);
        }
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager mgr, int[] appWidgetIds) {
        updateWidgets(context, mgr, appWidgetIds);
    }

    static void updateWidgets(Context context, AppWidgetManager mgr, int[] appWidgetIds) {
        SharedPreferences prefs = context.getSharedPreferences("giw_widget", Context.MODE_PRIVATE);
        String raw = prefs.getString("data", "{}");
        String name = "Get In Water";
        String detail = "Pin a trip in the app";
        try {
            JSONObject obj = new JSONObject(raw);
            name = obj.optString("name", name);
            int remaining = obj.optInt("remaining", -1);
            int total = obj.optInt("total", 0);
            int done = obj.optInt("done", 0);
            String mode = obj.optString("mode", "pack");
            if (total > 0 && remaining >= 0) {
                if (remaining == 0) {
                    detail = "return".equals(mode) ? "All collected!" : "All packed!";
                } else {
                    String verb = "return".equals(mode) ? "collected" : "packed";
                    detail = done + "/" + total + " " + verb + " · " + remaining + " left";
                }
            } else if (remaining < 0) {
                detail = "Pin a trip in the app";
                if ("Get In Water".equals(name) || name.isEmpty()) {
                    name = "Get In Water";
                }
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
