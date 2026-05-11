package com.smartgrid.repository;

import com.smartgrid.entity.GridAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GridAlertRepository extends JpaRepository<GridAlert, java.util.UUID> {
    List<GridAlert> findByResolvedAtIsNull();
}