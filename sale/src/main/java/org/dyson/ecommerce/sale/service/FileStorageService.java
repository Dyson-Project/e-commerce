package org.dyson.ecommerce.sale.service;

import com.jlefebure.spring.boot.minio.MinioException;
import org.dyson.ecommerce.sale.dto.FileResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileStorageService {
    FileResponse upload(MultipartFile file) throws MinioException, IOException, io.minio.errors.MinioException;

    void deleteFile(String filename);

    FileResponse getFile(String filename);

    FileResponse getFileDetails(String fileName);
}
