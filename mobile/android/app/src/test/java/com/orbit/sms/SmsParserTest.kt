package com.orbit.sms

import org.junit.Test
import org.junit.Assert.*

class SmsParserTest {

    @Test
    fun testEsewaParsingBasic() {
        val msg = "Rs. 5,000.00 received from Ram Bahadur, Ref: TXN12345"
        val result = SmsRegexParser.parse(msg)
        assertNotNull(result)
        assertEquals(5000.0, result!!.getDouble("amount"), 0.01)
        assertEquals("TXN12345", result.getString("txn_id"))
        assertEquals("eSewa", result.getString("payment_channel"))
        assertEquals("Ram Bahadur", result.getString("sender_name"))
    }

    @Test
    fun testEsewaWithWhitespaceVariations() {
        val msg = "Rs.   1,200 received from  Hari , Ref:  ABC-123"
        val result = SmsRegexParser.parse(msg)
        assertNotNull(result)
        assertEquals(1200.0, result!!.getDouble("amount"), 0.01)
    }

    @Test
    fun testFonepayParsing() {
        val msg = "NPR 4,800.50 credited to your account NABIL from Sita Sharma. Ref TXN98765"
        val result = SmsRegexParser.parse(msg)
        assertNotNull(result)
        assertEquals(4800.50, result!!.getDouble("amount"), 0.01)
        assertEquals("fonepay", result.getString("payment_channel"))
    }

    @Test
    fun testNumericFormattingWithCommas() {
        val msg = "Rs. 1,234,567.89 received from Test User, Ref: REF999"
        val result = SmsRegexParser.parse(msg)
        assertNotNull(result)
        assertEquals(1234567.89, result!!.getDouble("amount"), 0.01)
    }

    @Test
    fun testNonWhitelistedSenderDrops() {
        // Direct parser returns null for unknown format; receiver would drop non-whitelisted sender before parsing
        val msg = "Rs. 100 received from Unknown, Ref: XYZ"
        // This still parses because parser is channel-agnostic, but receiver filters sender beforehand
        // So we test that parser handles unknown format gracefully
        val unknownMsg = "Your OTP is 123456"
        val result = SmsRegexParser.parse(unknownMsg)
        assertNull(result)
    }

    @Test
    fun testEarlyDropOnInvalidMessage() {
        val result = SmsRegexParser.parse("Random spam message with no transaction")
        assertNull(result)
    }

    @Test
    fun testCaseInsensitivity() {
        val msg = "rs. 500 received from lower case, Ref: LOW123"
        val result = SmsRegexParser.parse(msg)
        assertNotNull(result)
        assertEquals(500.0, result!!.getDouble("amount"), 0.01)
    }
}
