package org.dyson.ecommerce.sale.entities;

import jakarta.persistence.*;
import lombok.Data;
import org.dyson.ecommerce.sale.constants.ProductStatus;
import org.hibernate.annotations.JoinFormula;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;
    private Long sellerId;

    private Long categoryId;
    @ManyToOne
    @JoinFormula(value = "category_id", referencedColumnName = "id")
    private Category category;
    private Long branchId;
    @ManyToOne
    @JoinFormula(value = "branch_id", referencedColumnName = "id")
    private Brand brand;

    private String productName;
    @Column(columnDefinition = "text")
    private String description;

    @Enumerated(EnumType.STRING)
    private ProductStatus status;
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "product")
    private List<Sku> skus = new ArrayList<>();

    @PrePersist
    public void onPrePersist() {
        for (Sku sku : skus) {
            sku.setProduct(this);
        }
    }

}
