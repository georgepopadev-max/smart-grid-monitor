package com.smartgrid.repository;

import com.smartgrid.entity.GridNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GridNodeRepository extends JpaRepository<GridNode, java.util.UUID> {
    List<GridNode> findByStatus(GridNode.NodeStatus status);
}