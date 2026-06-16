package com.threecats.lsp.getinwater;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "WidgetBridge")
public class WidgetBridgePlugin extends Plugin {

    @PluginMethod
    public void update(PluginCall call) {
        String json = call.getString("json", "{}");
        Context ctx = getContext();
        ctx.getSharedPreferences("giw_widget", Context.MODE_PRIVATE)
            .edit()
            .putString("data", json)
            .apply();

        AppWidgetManager mgr = AppWidgetManager.getInstance(ctx);
        ComponentName cn = new ComponentName(ctx, PackingWidgetProvider.class);
        int[] ids = mgr.getAppWidgetIds(cn);
        if (ids.length > 0) {
            Intent intent = new Intent(ctx, PackingWidgetProvider.class);
            intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
            intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids);
            ctx.sendBroadcast(intent);
        }
        call.resolve();
    }
}
