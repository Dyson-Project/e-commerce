package org.dyson.ecommerce.sale.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.minio.*;
import io.minio.errors.MinioException;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.dyson.ecommerce.sale.configs.MinioConfigurationProperties;
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
    private final MinioClient minioClient;
    private final MinioConfigurationProperties configurationProperties;
    private final ObjectMapper mapper;

    @SneakyThrows
    public void createObject() {
        var o = UploadObjectArgs.builder()
            .bucket(configurationProperties.getBucket())
            .object("build.gradle")
            .filename("build.gradle")
            .build();
        minioClient.uploadObject(o);

    }

    @SneakyThrows
    @Override
    public FileResponse upload(MultipartFile file) throws IOException, MinioException {
        Path path = Path.of(file.getOriginalFilename());
        PutObjectArgs args = PutObjectArgs.builder()
            .bucket(configurationProperties.getBucket())
            .object(path.toString())
            .stream(file.getInputStream(), file.getInputStream().available(), -1)
            .contentType(file.getContentType())
            .build();
        ObjectWriteResponse response = minioClient.putObject(args);
        log.debug("Response {} {} {}", response.bucket(), response.object(), response.versionId());

        StatObjectResponse objectStat = minioClient.statObject(
            StatObjectArgs.builder()
                .bucket(response.bucket())
                .object(response.object())
                .build());
        System.out.println(objectStat);
        var metadata = getMetadata(path);
        log.info("this file {} storage in bucket: {} on date: {}", metadata.object(), metadata.bucket(), metadata.lastModified());
        return FileResponse.builder()
            .fileSize(metadata.size())
            .filename(metadata.object())
            .contentType(metadata.contentType())
            .createdTime(metadata.lastModified())
            .build();
    }

    public StatObjectResponse getMetadata(Path path) {
        StatObjectArgs args = StatObjectArgs.builder()
            .bucket(configurationProperties.getBucket())
            .object(path.toString())
            .build();
        try {
            return minioClient.statObject(args);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    @Override
    public void deleteFile(String filename) {
        Path path = Path.of(filename);
        RemoveObjectArgs args = RemoveObjectArgs.builder()
            .bucket(configurationProperties.getBucket())
            .object(path.toString())
            .build();
        try {
            minioClient.removeObject(args);
        } catch (Exception e) {
            throw new RuntimeException("Error while fetching files in Minio", e);
        }
    }

    @Override
    public FileResponse getFile(String filename) {
        Path path = Path.of(filename);
        var metadata = getMetadata(path);
        GetObjectArgs args = GetObjectArgs.builder()
            .bucket(configurationProperties.getBucket())
            .object(path.toString())
            .build();
        try (InputStream stream = minioClient.getObject(args)) {
            return new FileResponse(metadata.size(), metadata.object(), metadata.contentType(), metadata.lastModified(), new InputStreamResource(stream));
        } catch (Exception e) {
            throw new RuntimeException("Error while fetching files in Minio", e);
        }
    }

    @Override
    public FileResponse getFileDetails(String fileName) {
        Path path = Path.of(fileName);
        var metadata = getMetadata(path);
        return null;
    }


}