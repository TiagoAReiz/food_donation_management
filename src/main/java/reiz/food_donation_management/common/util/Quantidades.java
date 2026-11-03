package reiz.food_donation_management.common.util;

import java.math.BigDecimal;

public final class Quantidades {

    private Quantidades() {
    }

    public static String texto(BigDecimal valor) {
        return valor.stripTrailingZeros().toPlainString();
    }
}
