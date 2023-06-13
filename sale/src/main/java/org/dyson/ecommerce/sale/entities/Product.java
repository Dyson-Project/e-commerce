package org.dyson.ecommerce.sale.entities;

import jakarta.persistence.*;
import lombok.Data;

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
    @JoinColumn(name = "brand_id")
    private Brand brand;
    private String productName;
    @Column(columnDefinition = "text")
    private String description;
    private String status;
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "product")
    private List<Sku> skus = new ArrayList<>();

    @PrePersist
    public void onPrePersist() {
        for (Sku sku : skus) {
            sku.setProduct(this);
        }
    }

}
