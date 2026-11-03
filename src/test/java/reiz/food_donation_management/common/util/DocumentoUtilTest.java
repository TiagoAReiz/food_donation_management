package reiz.food_donation_management.common.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class DocumentoUtilTest {

    @Test
    void cpfValidoComESemMascara() {
        assertTrue(DocumentoUtil.cpfValido("529.982.247-25"));
        assertTrue(DocumentoUtil.cpfValido("52998224725"));
        assertTrue(DocumentoUtil.cpfValido("123.456.789-09"));
    }

    @Test
    void cpfInvalido() {
        assertFalse(DocumentoUtil.cpfValido("529.982.247-24"));
        assertFalse(DocumentoUtil.cpfValido("111.111.111-11"));
        assertFalse(DocumentoUtil.cpfValido("123"));
        assertFalse(DocumentoUtil.cpfValido(null));
    }

    @Test
    void cnpjValidoComESemMascara() {
        assertTrue(DocumentoUtil.cnpjValido("12.345.678/0001-95"));
        assertTrue(DocumentoUtil.cnpjValido("11444777000161"));
    }

    @Test
    void cnpjInvalido() {
        assertFalse(DocumentoUtil.cnpjValido("12.345.678/0001-90"));
        assertFalse(DocumentoUtil.cnpjValido("00.000.000/0000-00"));
        assertFalse(DocumentoUtil.cnpjValido("1234"));
    }

    @Test
    void formataDocumentos() {
        assertEquals("529.982.247-25", DocumentoUtil.formatarCpf("52998224725"));
        assertEquals("11.444.777/0001-61", DocumentoUtil.formatarCnpj("11444777000161"));
    }
}
