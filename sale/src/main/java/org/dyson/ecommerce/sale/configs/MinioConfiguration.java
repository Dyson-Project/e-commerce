/*
 * Copyright Jordan LEFEBURE © 2019.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package org.dyson.ecommerce.sale.configs;

import com.jlefebure.spring.boot.minio.MinioConfigurationProperties;
import com.jlefebure.spring.boot.minio.MinioException;
import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.errors.*;
import io.minio.http.HttpUtils;
import lombok.RequiredArgsConstructor;
import okhttp3.OkHttpClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.concurrent.TimeUnit;

@Configuration
@ConditionalOnClass(MinioClient.class)
@EnableConfigurationProperties(MinioConfigurationProperties.class)
@RequiredArgsConstructor
public class MinioConfiguration {
    final Long DEFAULT_CONNECTION_TIMEOUT = TimeUnit.MINUTES.toMillis(5);

    private static final Logger LOGGER = LoggerFactory.getLogger(MinioConfiguration.class);

    private final MinioConfigurationProperties properties;

    @Bean
    public MinioClient minioClient() throws IOException, InvalidKeyException, NoSuchAlgorithmException, InsufficientDataException, InternalException, ErrorResponseException, InvalidResponseException, com.jlefebure.spring.boot.minio.MinioException, XmlParserException, ServerException {

        MinioClient minioClient;
        minioClient = MinioClient.builder()
            .endpoint(properties.getUrl())
            .credentials(properties.getAccessKey(), properties.getSecretKey())
            .httpClient(client())
            .build();
        minioClient.setTimeout(
            properties.getConnectTimeout().toMillis(),
            properties.getWriteTimeout().toMillis(),
            properties.getReadTimeout().toMillis()
        );

        if (properties.isCheckBucket()) {
            try {
                LOGGER.debug("Checking if bucket {} exists", properties.getBucket());
                BucketExistsArgs existsArgs = BucketExistsArgs.builder()
                    .bucket(properties.getBucket())
                    .build();
                boolean b = minioClient.bucketExists(existsArgs);
                if (!b) {
                    if (properties.isCreateBucket()) {
                        try {
                            MakeBucketArgs makeBucketArgs = MakeBucketArgs.builder()
                                .bucket(properties.getBucket())
                                .build();
                            minioClient.makeBucket(makeBucketArgs);
                        } catch (Exception e) {
                            throw new MinioException("Cannot create bucket", e);
                        }
                    } else {
                        throw new IllegalStateException("Bucket does not exist: " + properties.getBucket());
                    }
                }
            } catch (Exception e) {
                LOGGER.error("Error while checking bucket", e);
                throw e;
            }
        }

        return minioClient;
    }

    private OkHttpClient client() {
        String httpHost = System.getProperty("http.proxyHost");
        String httpPort = System.getProperty("http.proxyPort");
        if (httpHost == null) {
            return HttpUtils.newDefaultHttpClient(DEFAULT_CONNECTION_TIMEOUT, DEFAULT_CONNECTION_TIMEOUT, DEFAULT_CONNECTION_TIMEOUT);
        } else {
            OkHttpClient.Builder builder = new OkHttpClient.Builder();
            builder.proxy(new Proxy(Proxy.Type.HTTP, new InetSocketAddress(httpHost, Integer.parseInt(httpPort))));
            return builder
                .build();
        }
    }

}
