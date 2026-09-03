package com.orbit.notification

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import com.orbit.sms.SmsRegexParser

class InboundNotificationListener : NotificationListenerService() {
    private val whitelistPackages = setOf("com.esewa", "com.khalti", "com.fonepay", "com.nabil")

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        if (sbn == null) return
        if (!whitelistPackages.contains(sbn.packageName)) return
        val text = sbn.notification.extras.getCharSequence("android.text")?.toString() ?: return
        try {
            val parsed = SmsRegexParser.parse(text)
            if (parsed != null) {
                Log.i("InboundNotificationListener", "Parsed notification: ${parsed.getString("txn_id")}")
            }
        } catch (e: Exception) {
            Log.e("InboundNotificationListener", "Parse error: ${e.message}")
        }
    }
}
