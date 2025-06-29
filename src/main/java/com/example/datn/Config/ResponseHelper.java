package com.example.datn.Config;

import com.example.datn.DTO.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Map;

public class ResponseHelper {
    public static ApiResponse<Object> error(HttpStatus status, String message, Map<String, String> dataErrors) {
        return new ApiResponse<>(
                status.value(),
                dataErrors,
                message,
                LocalDateTime.now().toString(),
                true,
                null
        );
    }

    public static <T> ResponseEntity<ApiResponse<T>> success(String message, T content) {
        ApiResponse<T> apiResponse = new ApiResponse<>(
                HttpStatus.OK.value(),
                null,
                message,
                LocalDateTime.now().toString(),
                false,
                content
        );
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }
}
