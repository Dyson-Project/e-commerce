package org.dyson.ecommerce.sale.controller

import org.dyson.ecommerce.sale.constants.ProductStatus
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
interface ProductRestRepository : PagingAndSortingRepository<Product, Long?>, CrudRepository<Product, Long> {
    @Transactional(readOnly = true)
    @Query(
        """
        select p from Product  p
        left join fetch p.skus sku
        where
            (:name is null or p.productName ilike %:name%)
            and (:categoryId is null or p.categoryId = :categoryId)
            and (:branchId is null or p.branchId = :branchId)
            and (:status is null or p.status = :status)
    """,
        countQuery = """
        select count(p.id) from Product  p
        where
            (:name is null or p.productName ilike %:name%)
            and (:categoryId is null or p.categoryId = :categoryId)
            and (:branchId is null or p.branchId = :branchId)
            and (:status is null or p.status = :status)
        """
    )
    fun catalog(
        @Param("name") name: String?,
        @Param("branchId") branchId: Long?,
        @Param("categoryId") categoryId: Long?,
        @Param("status") status: ProductStatus? = ProductStatus.ACTIVE,
        pageable: Pageable
    ): Page<Product>
}

