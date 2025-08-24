package com.example.datn.controller;

import com.example.datn.dto.CartStateDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class LiveCartController {

    @MessageMapping("/cart/sync/{invoiceId}")
    @SendTo("/topic/cart/{invoiceId}")
    public String syncCartState(@DestinationVariable String invoiceId, String cartStateJson) {
        System.out.println("🚀 BACKEND BROADCASTING JSON: " + cartStateJson);
        return cartStateJson; // Chỉ cần nhận String và gửi đi String
    }

    @MessageMapping("/cart/request-state/{invoiceId}")
    @SendTo("/topic/cart/{invoiceId}")
    public String requestCartState(@DestinationVariable String invoiceId, String requestJson) {
        System.out.println("🚀 BACKEND BROADCASTING REQUEST: " + requestJson);
        return requestJson;
    }

    @MessageMapping("/cart/action/{invoiceId}")
    @SendTo("/topic/cart/{invoiceId}")
    public String handleCartAction(@DestinationVariable String invoiceId, String actionJson) {
        System.out.println(">>>>>> BACKEND NHẬN ĐƯỢC ACTION: " + actionJson);
        return actionJson; // Chỉ cần chuyển tiếp đi
    }
}
