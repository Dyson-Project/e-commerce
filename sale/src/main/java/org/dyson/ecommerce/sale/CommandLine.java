package org.dyson.ecommerce.sale;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.dyson.ecommerce.sale.controller.BrandRestRepository;
import org.dyson.ecommerce.sale.controller.CategoryRestRepository;
import org.dyson.ecommerce.sale.controller.ProductRestRepository;
import org.dyson.ecommerce.sale.entities.Brand;
import org.dyson.ecommerce.sale.entities.Category;
import org.dyson.ecommerce.sale.entities.Product;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;

@RequiredArgsConstructor
@Component
public class CommandLine implements CommandLineRunner {
    private final ObjectMapper mapper;
    @Value("${MOCK:false}")
    private Boolean mock;
    private final String brandResourceName = "data/brands.json";
    private final String categoriesResourceName = "data/categories.json";
    private final String productResourceName = "data/products.json";
    private final BrandRestRepository brandRestRepository;
    private final CategoryRestRepository categoryRestRepository;
    private final ProductRestRepository productRestRepository;

    @Override
    public void run(String... args) throws Exception {
        if (!mock) return;
        loadResource(brandResourceName, brandRestRepository, Brand[].class);
        loadResource(categoriesResourceName, categoryRestRepository, Category[].class);
        loadResource(productResourceName, productRestRepository, Product[].class);

    }

    private <T, ID> void loadResource(String resourceName, CrudRepository<T, ID> repos, Class<T[]> clazz) throws IOException {
        File file = new File(getClass().getClassLoader().getResource(resourceName).getFile());
        T[] products = mapper.readValue(file, clazz);
        repos.saveAll(Arrays.stream(products).toList());
    }
}
