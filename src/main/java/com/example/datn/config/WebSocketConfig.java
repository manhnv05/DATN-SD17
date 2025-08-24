package com.example.datn.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Đây là địa chỉ để các client (React, App) kết nối tới WebSocket
        registry.addEndpoint("/ws")
                // Thêm địa chỉ của test_app.html vào danh sách được phép
                .setAllowedOrigins("http://localhost:3000", "http://127.0.0.1:5500") // Giả sử React chạy ở cổng 3000
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // "/topic" là tiền tố của các "kênh" mà backend sẽ phát thông tin đi.
        // Ví dụ: kênh cho hóa đơn HD001 sẽ là /topic/cart/HD001
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
        // "/app" là tiền tố không bắt buộc, chúng ta không cần dùng trong hướng dẫn này
        // để giữ mọi thứ đơn giản.
    }
}
