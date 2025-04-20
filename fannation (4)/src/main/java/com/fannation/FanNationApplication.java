package com.fannation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EnableJpaAuditing
@EntityScan("com.fannation.model")
public class FanNationApplication {

    public static void main(String[] args) {
        SpringApplication.run(FanNationApplication.class, args);
    }
}
