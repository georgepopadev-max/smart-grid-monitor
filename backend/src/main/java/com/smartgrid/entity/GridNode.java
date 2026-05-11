package com.smartgrid.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "grid_nodes")
public class GridNode {
    @Id
    private UUID id;
    
    @Column(nullable = false)
    private String name;
    
    @Enumerated(EnumType.STRING)
    private NodeType type;
    
    private double x;
    private double y;
    
    @Enumerated(EnumType.STRING)
    private NodeStatus status = NodeStatus.NORMAL;
    
    private Double voltage = 230.0;
    private Double current = 0.0;
    private Double frequency = 50.0;
    private Double powerFactor = 0.95;
    private Double activePower = 0.0;
    private Double reactivePower = 0.0;
    
    public GridNode() {}

    public GridNode(UUID id, String name, NodeType type, double x, double y) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.x = x;
        this.y = y;
    }

    public enum NodeType {
        SUBSTATION, TRANSFORMER, FEEDER, METER, SENSOR
    }

    public enum NodeStatus {
        NORMAL, WARNING, FAULT, OFFLINE
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public NodeType getType() { return type; }
    public void setType(NodeType type) { this.type = type; }
    public double getX() { return x; }
    public void setX(double x) { this.x = x; }
    public double getY() { return y; }
    public void setY(double y) { this.y = y; }
    public NodeStatus getStatus() { return status; }
    public void setStatus(NodeStatus status) { this.status = status; }
    public Double getVoltage() { return voltage; }
    public void setVoltage(Double voltage) { this.voltage = voltage; }
    public Double getCurrent() { return current; }
    public void setCurrent(Double current) { this.current = current; }
    public Double getFrequency() { return frequency; }
    public void setFrequency(Double frequency) { this.frequency = frequency; }
    public Double getPowerFactor() { return powerFactor; }
    public void setPowerFactor(Double powerFactor) { this.powerFactor = powerFactor; }
    public Double getActivePower() { return activePower; }
    public void setActivePower(Double activePower) { this.activePower = activePower; }
    public Double getReactivePower() { return reactivePower; }
    public void setReactivePower(Double reactivePower) { this.reactivePower = reactivePower; }
}