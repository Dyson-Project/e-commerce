package org.dyson.ecommerce.sale.controller;

import org.dyson.ecommerce.sale.entities.Brand;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "brands", path = "brands")
public interface BrandRestRepository extends PagingAndSortingRepository<Brand, Long>, CrudRepository<Brand, Long> {
}
