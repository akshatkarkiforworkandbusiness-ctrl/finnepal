package com.orbit.sms

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.provider.Telephony
import android.util.Log
import org.json.JSONObject

class SmsIngestionReceiver : BroadcastReceiver() {

    private val whitelistSenders = setOf(
        "NABIL", "NABILSMS", "NICASIA", "ESB", "eSewa", "KHALTI", "connectIPS", "fonepay"
    )

    override fun onReceive(context: Context?, intent: Intent?) {
        if (intent?.action == Telephony.Sms.Intents.SMS_RECEIVED_ACTION) {
            val messages = Telephony.Sms.Intents.getMessagesFromIntent(intent)
            for (message in messages) {
                val sender = message.displayOriginatingAddress ?: continue
                if (!whitelistSenders.contains(sender)) {
                    continue
                }
                val body = message.displayMessageBody ?: continue
                try {
                    val parsedData = SmsRegexParser.parse(body)
                    if (parsedData != null) {
                        transmitDataToGateway(parsedData)
                    }
                } catch (e: Exception) {
                    Log.e("SmsIngestionReceiver", "Parsing failure: " + e.message)
                }
            }
        }
    }

    private fun transmitDataToGateway(jsonData: JSONObject) {
        Log.i("SmsIngestionReceiver", "Secure Inflow Synced: " + jsonData.getString("txn_id"))
    }
}
