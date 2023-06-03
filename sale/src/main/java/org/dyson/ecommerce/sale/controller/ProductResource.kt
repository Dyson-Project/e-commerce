package org.dyson.ecommerce.sale.controller

import org.dyson.ecommerce.sale.entities.Product
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.PagingAndSortingRepository
import org.springframework.data.rest.core.annotation.RepositoryRestResource


@RepositoryRestResource(collectionResourceRel = "products", path = "products")
interface ProductResource : PagingAndSortingRepository<Product, Long?>, CrudRepository<Product, Long>


