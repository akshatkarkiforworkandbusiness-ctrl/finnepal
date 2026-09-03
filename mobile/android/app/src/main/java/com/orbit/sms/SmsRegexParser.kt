package com.orbit.sms

import org.json.JSONObject
import java.util.regex.Pattern

object SmsRegexParser {

    private val esewaPattern = Pattern.compile(
        "(?i)Rs\\.\\s*([\\d,]+(?:\\.\\d{1,2})?)\\s*received\\s*from\\s*([^,]+),\\s*Ref:\\s*([\\w\\d-]+)"
    )

    private val fonepayPattern = Pattern.compile(
        "(?i)NPR\\s*([\\d,]+(?:\\.\\d{1,2})?)\\s*credited\\s*to\\s*your\\s*account\\s*\\w+\\s*from\\s*([^.]+)\\.\\s*Ref\\s*([\\w\\d-]+)"
    )

    fun parse(messageBody: String): JSONObject? {
        val esewaMatcher = esewaPattern.matcher(messageBody)
        if (esewaMatcher.find()) {
            val amount = esewaMatcher.group(1)?.replace(",", "")?.toDoubleOrNull() ?: 0.0
            val sender = esewaMatcher.group(2)?.trim() ?: "Unknown"
            val txnId = esewaMatcher.group(3)?.trim() ?: ""
            return constructJson(amount, txnId, "eSewa", sender)
        }
        val fonepayMatcher = fonepayPattern.matcher(messageBody)
        if (fonepayMatcher.find()) {
            val amount = fonepayMatcher.group(1)?.replace(",", "")?.toDoubleOrNull() ?: 0.0
            val sender = fonepayMatcher.group(2)?.trim() ?: "Unknown"
            val txnId = fonepayMatcher.group(3)?.trim() ?: ""
            return constructJson(amount, txnId, "fonepay", sender)
        }
        return null
    }

    private fun constructJson(amount: Double, txnId: String, channel: String, sender: String): JSONObject {
        val json = JSONObject()
        json.put("amount", amount)
        json.put("txn_id", txnId)
        json.put("payment_channel", channel)
        json.put("sender_name", sender)
        json.put("timestamp", System.currentTimeMillis())
        return json
    }
}
