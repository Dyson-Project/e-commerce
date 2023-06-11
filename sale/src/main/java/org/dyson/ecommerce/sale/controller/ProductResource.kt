package org.dyson.ecommerce.sale.controller

import org.dyson.ecommerce.sale.entities.Product
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.PagingAndSortingRepository
import org.springframework.data.repository.query.Param
import org.springframework.data.rest.core.annotation.RepositoryRestResource
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal


@RepositoryRestResource(collectionResourceRel = "products", path = "products")
interface ProductResource : PagingAndSortingRepository<Product, Long?>, CrudRepository<Product, Long> {
    @Transactional(readOnly = true)
    @Query(
        """
        select p from Product  p
        left join fetch p.skus sku
        where
            (:name is null or p.productName ilike %:name%)
            and (:categoryId is null or p.categoryId = :categoryId)
            and (:branchId is null or p.brand.id = :branchId)
            and (:status is null or p.status = :status)
            and (:minPrice is null or sku.price > :minPrice)
            and (:maxPrice is null or sku.price < :maxPrice)
    """
    )
    fun catalog(
        @Param("name") name: String?,
        @Param("branchId") branchId: Long?,
        @Param("categoryId") categoryId: Long?,
        @Param("status") status: String?,
        @Param("minPrice") minPrice: BigDecimal?,
        @Param("maxPrice") maxPrice: BigDecimal?,
        pageable: Pageable
    ): Page<Product>
}

