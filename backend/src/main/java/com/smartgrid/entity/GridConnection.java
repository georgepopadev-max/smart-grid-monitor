package com.smartgrid.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "grid_connections")
public class GridConnection {
    @Id
    private UUID id;
    
    @Column(name = "source_node_id", nullable = false)
    private UUID sourceNodeId;
    
    @Column(name = "target_node_id", nullable = false)
    private UUID targetNodeId;
    
    @Column(name = "line_type")
    private String lineType;
    
    @Column(name = "capacity_kva")
    private Double capacityKva;
    
    @Column(name = "current_load")
    private Double currentLoad = 0.0;
    
    private Boolean active = true;
    
    public GridConnection() {}

    public GridConnection(UUID id, UUID sourceNodeId, UUID targetNodeId, String lineType, Double capacityKva) {
        this.id = id;
        this.sourceNodeId = sourceNodeId;
        this.targetNodeId = targetNodeId;
        this.lineType = lineType;
        this.capacityKva = capacityKva;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getSourceNodeId() { return sourceNodeId; }
    public void setSourceNodeId(UUID sourceNodeId) { this.sourceNodeId = sourceNodeId; }
    public UUID getTargetNodeId() { return targetNodeId; }
    public void setTargetNodeId(UUID targetNodeId) { this.targetNodeId = targetNodeId; }
    public String getLineType() { return lineType; }
    public void setLineType(String lineType) { this.lineType = lineType; }
    public Double getCapacityKva() { return capacityKva; }
    public void setCapacityKva(Double capacityKva) { this.capacityKva = capacityKva; }
    public Double getCurrentLoad() { return currentLoad; }
    public void setCurrentLoad(Double currentLoad) { this.currentLoad = currentLoad; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}