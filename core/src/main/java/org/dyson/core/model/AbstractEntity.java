package org.dyson.core.model;

import jakarta.annotation.Nullable;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.Transient;
import org.springframework.data.domain.Persistable;
import org.springframework.data.util.ProxyUtils;

import java.io.Serializable;

@MappedSuperclass
public abstract class AbstractEntity<PK extends Serializable> implements Persistable<PK>, IdentifiableDomainObject<PK> {
    @Override
    @Transient
    public abstract @Nullable PK getId();

    @Override
    @Transient
    public boolean isNew() {
        return getId() == null;
    }

    @Override
    public boolean equals(@Nullable Object obj) {
        if (null == obj) {
            return false;
        }
        if (this == obj) {
            return true;
        }
        if (!getClass().equals(ProxyUtils.getUserClass(obj))) {
            return false;
        }

        var that = (AbstractEntity<?>) obj;
        var id = getId();
        return id != null && id.equals(that.getId());
    }

    @Override
    public int hashCode() {
        var id = getId();
        return id == null ? super.hashCode() : id.hashCode();
    }
}
