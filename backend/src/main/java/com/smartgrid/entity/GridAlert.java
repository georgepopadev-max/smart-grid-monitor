package com.smartgrid.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "grid_alerts")
public class GridAlert {
    @Id
    private UUID id;
    
    @Column(name = "node_id")
    private UUID nodeId;
    
    @Column(name = "node_name")
    private String nodeName;
    
    @Enumerated(EnumType.STRING)
    private AlertType type;
    
    @Enumerated(EnumType.STRING)
    private AlertSeverity severity;
    
    @Column(name = "triggered_at")
    private Instant triggeredAt = Instant.now();
    
    @Column(name = "acknowledged_by")
    private String acknowledgedBy;
    
    @Column(name = "resolved_at")
    private Instant resolvedAt;
    
    private String notes;

    public GridAlert() {}

    public GridAlert(UUID id, UUID nodeId, String nodeName, AlertType type, AlertSeverity severity) {
        this.id = id;
        this.nodeId = nodeId;
        this.nodeName = nodeName;
        this.type = type;
        this.severity = severity;
    }

    public enum AlertType {
        VOLTAGE_SAG, VOLTAGE_SWELL, OVERLOAD, FREQUENCY_DEVIATION, LINE_FAULT, EQUIPMENT_FAILURE
    }

    public enum AlertSeverity {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getNodeId() { return nodeId; }
    public void setNodeId(UUID nodeId) { this.nodeId = nodeId; }
    public String getNodeName() { return nodeName; }
    public void setNodeName(String nodeName) { this.nodeName = nodeName; }
    public AlertType getType() { return type; }
    public void setType(AlertType type) { this.type = type; }
    public AlertSeverity getSeverity() { return severity; }
    public void setSeverity(AlertSeverity severity) { this.severity = severity; }
    public Instant getTriggeredAt() { return triggeredAt; }
    public void setTriggeredAt(Instant triggeredAt) { this.triggeredAt = triggeredAt; }
    public String getAcknowledgedBy() { return acknowledgedBy; }
    public void setAcknowledgedBy(String acknowledgedBy) { this.acknowledgedBy = acknowledgedBy; }
    public Instant getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(Instant resolvedAt) { this.resolvedAt = resolvedAt; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}