package reiz.food_donation_management.common.exception;

public class NaoEncontradoException extends RuntimeException {
    public NaoEncontradoException(String mensagem) {
        super(mensagem);
    }

    public NaoEncontradoException() {
        super("Registro não encontrado.");
    }
}
