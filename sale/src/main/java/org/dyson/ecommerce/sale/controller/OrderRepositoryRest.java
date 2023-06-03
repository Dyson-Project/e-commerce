package org.dyson.ecommerce.sale.controller;

import org.dyson.ecommerce.sale.entities.Order;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "orders", path = "orders")
public interface OrderRepositoryRest extends PagingAndSortingRepository<Order, Long> {

}
