package com.example.datn.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CartStateDTO {
    private List<ProductInCartDTO> products;
    private double totalAmount;
    private String clientId;
}
