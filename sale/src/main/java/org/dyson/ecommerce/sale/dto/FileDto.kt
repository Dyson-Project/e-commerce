package org.dyson.ecommerce.sale.dto

import org.springframework.core.io.InputStreamResource
import java.time.Instant
import java.time.ZonedDateTime

data class FileResponse(
    val fileSize: Long,
    val filename: String,
    val contentType: String,
    val createdTime: ZonedDateTime,
    val stream: InputStreamResource
)