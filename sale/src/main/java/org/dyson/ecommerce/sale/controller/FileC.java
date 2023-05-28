package org.dyson.ecommerce.sale.controller;

import com.jlefebure.spring.boot.minio.MinioException;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.dyson.ecommerce.sale.service.FileStorageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/1.0/files")
@Tag(name = "Files", description = "File service")
@RequiredArgsConstructor
public class FileC {
    private final FileStorageService fileStorageService;

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Void> fileUpload(@RequestPart("file") MultipartFile file) throws MinioException, io.minio.errors.MinioException, IOException {
        fileStorageService.addFile(file);
        return ResponseEntity.noContent().build();
    }
}
