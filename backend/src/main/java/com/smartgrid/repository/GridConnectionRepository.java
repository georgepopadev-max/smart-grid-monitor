package com.smartgrid.repository;

import com.smartgrid.entity.GridConnection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GridConnectionRepository extends JpaRepository<GridConnection, java.util.UUID> {
}