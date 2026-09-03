package com.orbit.sms

import org.junit.Test
import org.junit.Assert.*

class BilingualSmsParserTest {

    @Test
    fun testDevanagariKhaltiMessage() {
        val msg = "खल्ती: राम कुमारबाट रू 5,000.00 प्राप्त भयो। Ref: TXN-9281"
        val result = BilingualSmsParser.parseNepaliMessage(msg)
        assertNotNull(result)
        assertEquals(5000.0, result!!.amount, 0.01)
        assertEquals("TXN-9281", result.txnId)
        assertEquals("Khalti/eSewa", result.paymentChannel)
    }

    @Test
    fun testRomanizedNepaliWithNPR() {
        val msg = "NPR 4,800.50 jamma bhayo Ref: TXN5566"
        val result = BilingualSmsParser.parseNepaliMessage(msg)
        assertNotNull(result)
        assertEquals(4800.50, result!!.amount, 0.01)
    }

    @Test
    fun testEnglishReceivedWithRs() {
        val msg = "Rs. 1,200.00 received Ref: ABC123"
        val result = BilingualSmsParser.parseNepaliMessage(msg)
        assertNotNull(result)
        assertEquals(1200.0, result!!.amount, 0.01)
    }

    @Test
    fun testMissingTxnIdReturnsNull() {
        val msg = "रू 5,000.00 प्राप्त भयो"
        val result = BilingualSmsParser.parseNepaliMessage(msg)
        assertNull(result)
    }

    @Test
    fun testMissingAmountReturnsNull() {
        val msg = "Ref: TXN123"
        val result = BilingualSmsParser.parseNepaliMessage(msg)
        assertNull(result)
    }

    @Test
    fun testMixedDevanagariAndEnglishRef() {
        val msg = "रू 2,500 प्राप्त - txn: NP-2026-001"
        val result = BilingualSmsParser.parseNepaliMessage(msg)
        assertNotNull(result)
        assertEquals(2500.0, result!!.amount, 0.01)
        assertEquals("NP-2026-001", result.txnId)
    }
}
