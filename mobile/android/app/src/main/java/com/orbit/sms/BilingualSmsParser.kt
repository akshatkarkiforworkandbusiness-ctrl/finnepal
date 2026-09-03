package com.orbit.sms

object BilingualSmsParser {
    // e.g., "खल्ती: राम कुमारबाट रू ५,०००.०० प्राप्त भयो। Ref: TXN-9281"
    private val devanagariPattern = """(?i)(?:रू|रू\.|npr|rs\.?)\s*([\d,]+(?:\.\d{1,2})?)\s*(?:प्राप्त|received|जम्मा)""".toRegex()
    private val txnIdPattern = """(?:ref|ref\.?|txn|id):\s*([a-zA-Z0-9\-]+)""".toRegex()

    fun parseNepaliMessage(smsBody: String): TransactionPayload? {
        val amountMatch = devanagariPattern.find(smsBody)
        val txnMatch = txnIdPattern.find(smsBody)

        if (amountMatch != null && txnMatch != null) {
            val cleanAmount = amountMatch.groupValues[1].replace(",", "").toDouble()
            val transactionId = txnMatch.groupValues[1]
            return TransactionPayload(
                amount = cleanAmount,
                txnId = transactionId,
                paymentChannel = "Khalti/eSewa",
                timestamp = System.currentTimeMillis()
            )
        }
        return null
    }
}

data class TransactionPayload(
    val amount: Double,
    val txnId: String,
    val paymentChannel: String,
    val timestamp: Long
)
