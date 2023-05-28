package org.dyson.ecommerce.sale.service;

import io.minio.errors.MinioException;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.dyson.ecommerce.sale.dto.FileResponse;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;


@Service
@Slf4j
@RequiredArgsConstructor
public class FileStorageServiceImpl implements FileStorageService {

    private final MinioService minioService;


    @Override
    public FileResponse addFile(MultipartFile file) throws IOException, MinioException {
        Path path = Path.of(file.getOriginalFilename());
        minioService.upload(path, file.getInputStream(), file.getContentType());
        var metadata = minioService.getMetadata(path);
//            log.info("this file {} storage in bucket: {} on date: {}", metadata.name(), metadata.bucketName(), metadata.createdTime());
//            return fileResponseMapper.fileAddResponse(metadata);
        return null;
    }

    @SneakyThrows
    @Override
    public void deleteFile(String filename) {
        Path path = Path.of(filename);
        var metadata = minioService.getMetadata(path);
        minioService.remove(path);
//        log.info("this file {} removed in bucket: {} on date: {}", metadata.name(), metadata.bucketName(), metadata.createdTime());
    }

    @SneakyThrows
    @Override
    public FileResponse getFile(String filename) {
        Path path = Path.of(filename);
        var metadata = minioService.getMetadata(path);

        InputStream inputStream = minioService.get(path);
        InputStreamResource inputStreamResource = new InputStreamResource(inputStream);
        return null;
//        return FileResponse.builder()
//            .filename(metadata.name())
//            .fileSize(metadata.length())
//            .contentType(metadata.contentType())
//            .createdTime(metadata.createdTime())
//            .stream(inputStreamResource)
//            .build();
    }

    @SneakyThrows
    @Override
    public FileResponse getFileDetails(String fileName) {
        Path path = Path.of(fileName);
        var metadata = minioService.getMetadata(path);
        return null;
    }
}