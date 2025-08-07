package com.example.datn;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class DatnApplication {

    public static void main(String[] args) {
        SpringApplication.run(DatnApplication.class, args);
    }

}
