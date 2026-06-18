package com.hms.util;

import org.apache.commons.codec.digest.DigestUtils;

public class AadhaarUtil {

    public static String hash(String aadhaar) {
        if (aadhaar == null || !isValid(aadhaar)) return null;
        return DigestUtils.sha256Hex(aadhaar);
    }

    public static String mask(String aadhaar) {
        if (aadhaar == null || !isValid(aadhaar)) return null;
        return "XXXX-XXXX-" + aadhaar.substring(8);
    }

    public static String extractLast4(String aadhaar) {
        if (aadhaar == null || !isValid(aadhaar)) return null;
        return aadhaar.substring(8);
    }

    public static boolean isValid(String aadhaar) {
        return aadhaar != null && aadhaar.matches("\\d{12}");
    }
}
