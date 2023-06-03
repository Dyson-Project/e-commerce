package org.dyson.ecommerce.sale.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.core.io.InputStreamResource;

import java.time.ZonedDateTime;

@Data
@Builder
@AllArgsConstructor
public class FileResponse {
    private Long fileSize;
    private String filename;
    private String contentType;
    private ZonedDateTime createdTime;
    private InputStreamResource stream;
}