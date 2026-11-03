package reiz.food_donation_management.common.exception;

public class NaoAutenticadoException extends RuntimeException {
    public NaoAutenticadoException(String mensagem) {
        super(mensagem);
    }
}
