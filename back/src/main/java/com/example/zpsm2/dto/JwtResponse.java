package com.example.zpsm2.dto;

public class JwtResponse {

    public String token;
    public String type="Bearer";

    public JwtResponse(String token){
        this.token=token;
    }

    public String getToken() {
        return token;
    }
}
