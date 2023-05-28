package org.dyson.ecommerce.sale.controller


import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import lombok.AccessLevel
import lombok.RequiredArgsConstructor
import lombok.experimental.FieldDefaults
import org.dyson.ecommerce.sale.dto.FileResponse
import org.dyson.ecommerce.sale.service.FileStorageService
import org.springframework.core.io.InputStreamResource
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile


@Controller
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequestMapping(value = ["/v1/files"], produces = ["application/json", "application/xml", "application/hal+json"])
@Tag(name = "files", description = "File Service")
class FileController {
    var fileStorageService: FileStorageService? = null
    @PostMapping(consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Upload a File")
    fun fileUpload(@RequestPart("file") file: MultipartFile?): ResponseEntity<FileResponse> {
        val response: FileResponse = fileStorageService.addFile(file)
        return ResponseEntity.status(HttpStatus.CREATED).body<FileResponse>(response)
    }

    @GetMapping("/view/{file}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "View a File")
    fun viewFile(@PathVariable file: String?): ResponseEntity<InputStreamResource> {
        val source: FileResponse = fileStorageService.getFile(file)
        return ResponseEntity
            .ok()
            .contentType(MediaType.parseMediaType(source.getContentType()))
            .contentLength(source.getFileSize())
            .header("Content-disposition", "attachment; filename=" + source.getFilename())
            .body(source.getStream())
    }

    @GetMapping("/download/{file}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Download a File")
    fun downloadFile(@PathVariable file: String?): ResponseEntity<InputStreamResource> {
        val source: FileResponse = fileStorageService.getFile(file)
        return ResponseEntity
            .ok()
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .contentLength(source.getFileSize())
            .header("Content-disposition", "attachment; filename=" + source.getFilename())
            .body(source.getStream())
    }

    @DeleteMapping("/{file}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a File")
    fun removeFile(@PathVariable file: String?): Any {
        fileStorageService.deleteFile(file)
        return ResponseEntity.noContent()
    }

    @GetMapping("/{file}/detail")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get File Detail")
    fun getFileDetail(@PathVariable file: String?): ResponseEntity<FileResponse> {
        val response: FileResponse = fileStorageService.getFileDetails(file)
        return ResponseEntity.ok<FileResponse>(response)
    }
}
