package com.smartcampus;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SmartCampusApplication {

    public static void main(String[] args) {
        // Load .env from current directory (since we copied it there)
        Dotenv dotenv = Dotenv.configure()
                .directory("./")
                .ignoreIfMissing()
                .load();

        // Set properties for Spring Boot to pick up
        dotenv.entries().forEach(entry -> {
            System.setProperty(entry.getKey(), entry.getValue());
        });

        // Debug prints
        System.out.println("DEBUG: MONGO_URI loaded: " + (System.getProperty("MONGO_URI") != null));
        System.out.println("DEBUG: GOOGLE_CLIENT_ID loaded: " + (System.getProperty("GOOGLE_CLIENT_ID") != null));

        SpringApplication.run(SmartCampusApplication.class, args);
    }
}