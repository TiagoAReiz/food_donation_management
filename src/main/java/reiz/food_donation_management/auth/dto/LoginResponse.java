package reiz.food_donation_management.auth.dto;

public record LoginResponse(String token, MeResponse usuario) {
}
