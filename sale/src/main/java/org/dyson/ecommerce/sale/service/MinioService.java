package org.dyson.ecommerce.sale.service;

import io.minio.*;
import io.minio.errors.MinioException;
import io.minio.messages.Item;
import org.dyson.ecommerce.sale.configs.MinioConfigurationProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.InputStream;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;


/**
 * Service class to interact with Minio bucket. This class is register as a bean and use the properties defined in {@link MinioConfigurationProperties}.
 * The bucket name is provided with the one defined in the configuration properties.
 *
 * @author Jordan LEFEBURE
 * <p>
 * <p>
 * This service adapetd with minio sdk 7.0.x
 * @author Mostafa Jalambadani
 */
@Service
public class MinioService {

    private final MinioClient minioClient;
    private final MinioConfigurationProperties configurationProperties;

    @Autowired
    public MinioService(MinioClient minioClient, MinioConfigurationProperties configurationProperties) {
        this.minioClient = minioClient;
        this.configurationProperties = configurationProperties;
    }

    /**
     * List all objects at root of the bucket
     *
     * @return List of items
     */
    public List<Item> list() {
        ListObjectsArgs args = ListObjectsArgs.builder()
            .bucket(configurationProperties.getBucket())
            .prefix("")
            .recursive(false)
            .build();
        Iterable<Result<Item>> myObjects = minioClient.listObjects(args);
        return getItems(myObjects);
    }

    /**
     * List all objects at root of the bucket
     *
     * @return List of items
     */
    public List<Item> fullList() {
        ListObjectsArgs args = ListObjectsArgs.builder()
            .bucket(configurationProperties.getBucket())
            .build();
        Iterable<Result<Item>> myObjects = minioClient.listObjects(args);
        return getItems(myObjects);
    }

    /**
     * List all objects with the prefix given in parameter for the bucket.
     * Simulate a folder hierarchy. Objects within folders (i.e. all objects which match the pattern {@code {prefix}/{objectName}/...}) are not returned
     *
     * @param path Prefix of seeked list of object
     * @return List of items
     */
    public List<Item> list(Path path) {
        ListObjectsArgs args = ListObjectsArgs.builder()
            .bucket(configurationProperties.getBucket())
            .prefix(path.toString())
            .recursive(false)
            .build();
        Iterable<Result<Item>> myObjects = minioClient.listObjects(args);
        return getItems(myObjects);
    }

    /**
     * List all objects with the prefix given in parameter for the bucket
     * <p>
     * All objects, even those which are in a folder are returned.
     *
     * @param path Prefix of seeked list of object
     * @return List of items
     */
    public List<Item> getFullList(Path path) {
        ListObjectsArgs args = ListObjectsArgs.builder()
            .bucket(configurationProperties.getBucket())
            .prefix(path.toString())
            .build();
        Iterable<Result<Item>> myObjects = minioClient.listObjects(args);
        return getItems(myObjects);
    }

    /**
     * Utility method which map results to items and return a list
     *
     * @param myObjects Iterable of results
     * @return List of items
     */
    private List<Item> getItems(Iterable<Result<Item>> myObjects) {
        return StreamSupport
            .stream(myObjects.spliterator(), true)
            .map(itemResult -> {
                try {
                    return itemResult.get();
                } catch (Exception e) {
                    throw new RuntimeException(e.getMessage(), e);
                }
            })
            .collect(Collectors.toList());
    }

    /**
     * Get an object from Minio
     *
     * @param path Path with prefix to the object. Object name must be included.
     * @return The object as an InputStream
     */
    public InputStream get(Path path) {
        GetObjectArgs args = GetObjectArgs.builder()
            .bucket(configurationProperties.getBucket())
            .object(path.toString())
            .build();
        try (InputStream stream = minioClient.getObject(args)) {
            return stream;
        } catch (Exception e) {
            throw new RuntimeException("Error while fetching files in Minio", e);
        }
    }

    /**
     * Get metadata of an object from Minio
     *
     * @param path Path with prefix to the object. Object name must be included.
     * @return Metadata of the  object
     */
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

    /**
     * Get metadata for multiples objects from Minio
     *
     * @param paths Paths of all objects with prefix. Objects names must be included.
     * @return A map where all paths are keys and metadatas are values
     */
    public Map<Path, StatObjectResponse> getMetadata(Iterable<Path> paths) {
        return StreamSupport.stream(paths.spliterator(), false)
            .map(path -> {
                StatObjectArgs args = StatObjectArgs.builder()
                    .bucket(configurationProperties.getBucket())
                    .object(path.toString())
                    .build();
                try {
                    return new HashMap.SimpleEntry<>(path, minioClient.statObject(args));
                } catch (Exception e) {
                    throw new RuntimeException(e.getMessage(), e);
                }
            })
            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    /**
     * Get a file from Minio, and save it in the {@code fileName} file
     *
     * @param source   Path with prefix to the object. Object name must be included.
     * @param fileName Filename
     */
    public void getAndSave(Path source, String fileName)  {
        try {
            DownloadObjectArgs args = DownloadObjectArgs.builder()
                .bucket(configurationProperties.getBucket())
                .object(source.toString())
                .filename(fileName)
                .build();
            minioClient.downloadObject(args);
        } catch (Exception e) {
            throw new RuntimeException("Error while fetching files in Minio", e);
        }
    }

    /**
     * Upload a file to Minio
     *
     * @param source  Path with prefix to the object. Object name must be included.
     * @param file    File as an inputstream
     * @param headers Additional headers to put on the file. The map MUST be mutable. All custom headers will start with 'x-amz-meta-' prefix when fetched with {@code getMetadata()} method.
     */
    public void upload(Path source, InputStream file, Map<String, String> headers)  {
        try {
            PutObjectArgs args = PutObjectArgs.builder()
                .bucket(configurationProperties.getBucket())
                .object(source.toString())
                .stream(file, file.available(), -1)
                .headers(headers)
                .build();
            minioClient.putObject(args);
        } catch (Exception e) {
            throw new RuntimeException("Error while fetching files in Minio", e);
        }
    }

    /**
     * Upload a file to Minio
     *
     * @param source Path with prefix to the object. Object name must be included.
     * @param file   File as an inputstream
     */
    public void upload(Path source, InputStream file) {
        try {
            PutObjectArgs args = PutObjectArgs.builder()
                .bucket(configurationProperties.getBucket())
                .object(source.toString())
                .stream(file, file.available(), -1)
                .build();
            minioClient.putObject(args);
        } catch (Exception e) {
            throw new RuntimeException("Error while fetching files in Minio", e);
        }
    }

    /**
     * Upload a file to Minio
     *
     * @param source      Path with prefix to the object. Object name must be included.
     * @param file        File as an inputstream
     * @param contentType MIME type for the object
     * @param headers     Additional headers to put on the file. The map MUST be mutable
     */
    public void upload(Path source, InputStream file, String contentType, Map<String, String> headers) {
        try {
            PutObjectArgs args = PutObjectArgs.builder()
                .bucket(configurationProperties.getBucket())
                .object(source.toString())
                .stream(file, file.available(), -1)
                .headers(headers)
                .contentType(contentType)
                .build();

            minioClient.putObject(args);
        } catch (Exception e) {
            throw new RuntimeException("Error while fetching files in Minio", e);
        }
    }

    /**
     * Upload a file to Minio
     *
     * @param source      Path with prefix to the object. Object name must be included.
     * @param file        File as an inputstream
     * @param contentType MIME type for the object
     */
    public void upload(Path source, InputStream file, String contentType) throws MinioException  {
        try {
            PutObjectArgs args = PutObjectArgs.builder()
                .bucket(configurationProperties.getBucket())
                .object(source.toString())
                .stream(file, file.available(), -1)
                .contentType(contentType)
                .build();

            minioClient.putObject(args);
        } catch (Exception e) {
            throw new RuntimeException("Error while fetching files in Minio", e);
        }
    }

    /**
     * Upload a file to Minio
     * upload file bigger than Xmx size
     *
     * @param source Path with prefix to the object. Object name must be included.
     * @param file   File as an Filename
     * @throws com.jlefebure.spring.boot.minio.MinioException if an error occur while uploading object
     */
    public void upload(Path source, File file)  {
        try {
            UploadObjectArgs args = UploadObjectArgs.builder()
                .bucket(configurationProperties.getBucket())
                .object(source.toString())
                .filename(file.getAbsolutePath())
                .build();
            minioClient.uploadObject(args);
        } catch (Exception e) {
            throw new RuntimeException("Error while fetching files in Minio", e);
        }
    }


    /**
     * Remove a file to Minio
     *
     * @param source Path with prefix to the object. Object name must be included.
     */
    public void remove(Path source) throws MinioException {
        try {
            RemoveObjectArgs args = RemoveObjectArgs.builder()
                .bucket(configurationProperties.getBucket())
                .object(source.toString())
                .build();
            minioClient.removeObject(args);
        } catch (Exception e) {
            throw new MinioException("Error while fetching files in Minio");
        }
    }

}
