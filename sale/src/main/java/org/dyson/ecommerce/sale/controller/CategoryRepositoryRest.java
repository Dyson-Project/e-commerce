package org.dyson.ecommerce.sale.controller;

import org.dyson.ecommerce.sale.entities.Category;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "categories", path = "categories")
public interface CategoryRepositoryRest extends PagingAndSortingRepository<Category, Long> {
}

@RepositoryRestResource(collectionResourceRel = "categories", path = "categories")
interface CategoryRepositoryCrud extends CrudRepository<Category, Long> {
}
