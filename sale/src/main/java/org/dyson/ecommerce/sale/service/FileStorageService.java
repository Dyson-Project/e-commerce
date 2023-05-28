package org.dyson.ecommerce.sale.service;

import org.dyson.ecommerce.sale.dto.FileResponse;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    FileResponse addFile(MultipartFile file);

    void deleteFile(String filename);

    FileResponse getFile(String filename);

    FileResponse getFileDetails(String fileName);
}
