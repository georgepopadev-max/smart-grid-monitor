package com.smartgrid.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "telemetry_snapshots")
public class TelemetrySnapshot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "node_id")
    private String nodeId;
    
    @Column(name = "node_name")
    private String nodeName;
    
    private Double voltage;
    private Double current;
    private Double frequency;
    private Double powerFactor;
    private Double activePower;
    private Double reactivePower;
    
    @Column(name = "recorded_at")
    private Instant recordedAt = Instant.now();
    
    public TelemetrySnapshot() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNodeId() { return nodeId; }
    public void setNodeId(String nodeId) { this.nodeId = nodeId; }
    public String getNodeName() { return nodeName; }
    public void setNodeName(String nodeName) { this.nodeName = nodeName; }
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
    public Instant getRecordedAt() { return recordedAt; }
    public void setRecordedAt(Instant recordedAt) { this.recordedAt = recordedAt; }
}