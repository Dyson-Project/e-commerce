package org.dyson.ecommerce.sale.entities;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Data
public class Sku {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    Long id;

    String sellerSku;

    Long available;

    Long quantity;

    String color;

    Long size;

    Long height;

    Long width;

    Long length;

    Long weight;

    BigDecimal price;

    @JdbcTypeCode(SqlTypes.JSON)
    List<String> images;

    @ManyToOne
    Product product;
}
