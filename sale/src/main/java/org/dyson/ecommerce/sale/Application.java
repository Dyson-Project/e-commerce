package org.dyson.ecommerce.sale;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.dyson.ecommerce.sale.dto.FileResponse;
import org.dyson.ecommerce.sale.service.FileStorageService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@Slf4j
@SpringBootApplication
@RequiredArgsConstructor
public class Application implements CommandLineRunner {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    private final FileStorageService fileStorageService;

    @Override
    public void run(String... args) throws Exception {
        fileStorageService.createObject();
        FileResponse response = fileStorageService.getFile("build.gradle");
        System.out.printf("-------> %s %s %s", response.getFilename(), response.getFileSize(), response.getContentType());
    }
}
