package reiz.food_donation_management.common.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;

public final class DataUtil {

    public static final ZoneId ZONA = ZoneId.of("America/Sao_Paulo");

    private DataUtil() {
    }

    public static LocalDate hoje() {
        return LocalDate.now(ZONA);
    }

    public static LocalDateTime agora() {
        return LocalDateTime.now(ZONA);
    }
}
