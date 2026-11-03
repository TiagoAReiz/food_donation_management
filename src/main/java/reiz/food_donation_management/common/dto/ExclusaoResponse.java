package reiz.food_donation_management.common.dto;

public record ExclusaoResponse(String resultado, String mensagem) {

    public static ExclusaoResponse excluido() {
        return new ExclusaoResponse("EXCLUIDO", "Cadastro excluído com sucesso.");
    }

    public static ExclusaoResponse desativado() {
        return new ExclusaoResponse("DESATIVADO",
                "Cadastro desativado. O histórico foi preservado e o acesso foi bloqueado.");
    }
}
