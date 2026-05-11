package com.smartgrid.model;

import java.util.UUID;

public class GridConnection {
    private UUID id;
    private UUID sourceNodeId;
    private UUID targetNodeId;
    private String lineType;
    private double capacityKva;
    private double currentLoad;
    private boolean active;

    public GridConnection() {}

    public GridConnection(UUID id, UUID sourceNodeId, UUID targetNodeId, String lineType, double capacityKva) {
        this.id = id;
        this.sourceNodeId = sourceNodeId;
        this.targetNodeId = targetNodeId;
        this.lineType = lineType;
        this.capacityKva = capacityKva;
        this.currentLoad = 0.0;
        this.active = true;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getSourceNodeId() { return sourceNodeId; }
    public void setSourceNodeId(UUID sourceNodeId) { this.sourceNodeId = sourceNodeId; }
    public UUID getTargetNodeId() { return targetNodeId; }
    public void setTargetNodeId(UUID targetNodeId) { this.targetNodeId = targetNodeId; }
    public String getLineType() { return lineType; }
    public void setLineType(String lineType) { this.lineType = lineType; }
    public double getCapacityKva() { return capacityKva; }
    public void setCapacityKva(double capacityKva) { this.capacityKva = capacityKva; }
    public double getCurrentLoad() { return currentLoad; }
    public void setCurrentLoad(double currentLoad) { this.currentLoad = currentLoad; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}