package org.dyson.ecommerce.sale.controller;

import com.jlefebure.spring.boot.minio.MinioException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.dyson.ecommerce.sale.dto.FileResponse;
import org.dyson.ecommerce.sale.service.FileStorageService;
import org.springframework.core.io.InputStreamResource;
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
public class FileController {
    private final FileStorageService fileStorageService;

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Void> fileUpload(@RequestPart("file") MultipartFile file) throws MinioException, io.minio.errors.MinioException, IOException {
        fileStorageService.upload(file);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{file}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "View a File")
    ResponseEntity<InputStreamResource> get(@PathVariable String file) {
        var source = fileStorageService.getFile(file);
        return ResponseEntity
            .ok()
            .contentType(MediaType.parseMediaType(source.getContentType()))
            .contentLength(source.getFileSize())
            .header("Content-disposition", "attachment; filename=" + source.getFilename())
            .body(source.getStream());
    }

    @GetMapping("/{file}/download")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Download a File")
    ResponseEntity<InputStreamResource> downloadFile(@PathVariable String file) {
        FileResponse source = fileStorageService.getFile(file);
        return ResponseEntity
            .ok()
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .contentLength(source.getFileSize())
            .header("Content-disposition", "attachment; filename=" + source.getFilename())
            .body(source.getStream());
    }

    @DeleteMapping("/{file}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a file")
    ResponseEntity<Void> removeFile(@PathVariable String file) {
        fileStorageService.deleteFile(file);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/{file}/detail")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get File Detail")
    ResponseEntity<FileResponse> getFileDetail(@PathVariable String file) {
        FileResponse response = fileStorageService.getFileDetails(file);
        return ResponseEntity.ok(response);
    }
}
