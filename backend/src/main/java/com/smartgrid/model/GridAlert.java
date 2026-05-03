package com.smartgrid.model;

import java.time.Instant;
import java.util.UUID;

public class GridAlert {
    private UUID id;
    private UUID nodeId;
    private String nodeName;
    private AlertType type;
    private AlertSeverity severity;
    private Instant triggeredAt;
    private String acknowledgedBy;
    private Instant resolvedAt;
    private String notes;

    public GridAlert() {}

    public GridAlert(UUID id, UUID nodeId, String nodeName, AlertType type, AlertSeverity severity) {
        this.id = id;
        this.nodeId = nodeId;
        this.nodeName = nodeName;
        this.type = type;
        this.severity = severity;
        this.triggeredAt = Instant.now();
    }

    public enum AlertType {
        VOLTAGE_SAG, VOLTAGE_SWELL, OVERLOAD, FREQUENCY_DEVIATION, LINE_FAULT, EQUIPMENT_FAILURE
    }

    public enum AlertSeverity {
        INFO, WARNING, CRITICAL
    }

    // Getters and Setters
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