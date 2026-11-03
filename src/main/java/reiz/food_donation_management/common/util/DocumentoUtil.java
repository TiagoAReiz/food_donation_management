package reiz.food_donation_management.common.util;

public final class DocumentoUtil {

    private DocumentoUtil() {
    }

    public static String somenteDigitos(String valor) {
        return valor == null ? "" : valor.replaceAll("\\D", "");
    }

    public static boolean cpfValido(String valor) {
        String d = somenteDigitos(valor);
        if (d.length() != 11 || todosIguais(d)) {
            return false;
        }
        return digito(d, 9, 10) == d.charAt(9) - '0' && digito(d, 10, 11) == d.charAt(10) - '0';
    }

    public static boolean cnpjValido(String valor) {
        String d = somenteDigitos(valor);
        if (d.length() != 14 || todosIguais(d)) {
            return false;
        }
        int[] p1 = {5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
        int[] p2 = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
        return digito(d, p1) == d.charAt(12) - '0' && digito(d, p2) == d.charAt(13) - '0';
    }

    public static String formatarCpf(String valor) {
        String d = somenteDigitos(valor);
        return d.substring(0, 3) + "." + d.substring(3, 6) + "." + d.substring(6, 9) + "-" + d.substring(9);
    }

    public static String formatarCnpj(String valor) {
        String d = somenteDigitos(valor);
        return d.substring(0, 2) + "." + d.substring(2, 5) + "." + d.substring(5, 8) + "/"
                + d.substring(8, 12) + "-" + d.substring(12);
    }

    private static boolean todosIguais(String d) {
        return d.chars().distinct().count() == 1;
    }

    private static int digito(String d, int tamanho, int pesoInicial) {
        int soma = 0;
        for (int i = 0; i < tamanho; i++) {
            soma += (d.charAt(i) - '0') * (pesoInicial - i);
        }
        return resto(soma);
    }

    private static int digito(String d, int[] pesos) {
        int soma = 0;
        for (int i = 0; i < pesos.length; i++) {
            soma += (d.charAt(i) - '0') * pesos[i];
        }
        return resto(soma);
    }

    private static int resto(int soma) {
        int r = (soma * 10) % 11;
        return r == 10 ? 0 : r;
    }
}
