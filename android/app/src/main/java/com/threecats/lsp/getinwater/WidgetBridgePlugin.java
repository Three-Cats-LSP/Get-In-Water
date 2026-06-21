package com.threecats.lsp.getinwater;

import android.content.Context;
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
            .commit();

        PackingWidgetProvider.refreshAll(ctx);
        call.resolve();
    }
}
