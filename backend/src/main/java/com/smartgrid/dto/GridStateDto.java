package com.smartgrid.dto;

import com.smartgrid.model.GridNode;
import com.smartgrid.model.GridConnection;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class GridStateDto {
    private UUID gridId;
    private String gridName;
    private List<GridNodeDto> nodes;
    private List<GridConnectionDto> connections;
    private List<AlertDto> activeAlerts;
    private Instant timestamp;

    public GridStateDto() {}

    public static class GridNodeDto {
        private UUID id;
        private String name;
        private String type;
        private double x;
        private double y;
        private String status;
        private double voltage;
        private double current;
        private double frequency;
        private double powerFactor;
        private double activePower;
        private double reactivePower;

        public static GridNodeDto from(GridNode node) {
            GridNodeDto dto = new GridNodeDto();
            dto.setId(node.getId());
            dto.setName(node.getName());
            dto.setType(node.getType().name());
            dto.setX(node.getX());
            dto.setY(node.getY());
            dto.setStatus(node.getStatus().name());
            dto.setVoltage(node.getVoltage());
            dto.setCurrent(node.getCurrent());
            dto.setFrequency(node.getFrequency());
            dto.setPowerFactor(node.getPowerFactor());
            dto.setActivePower(node.getActivePower());
            dto.setReactivePower(node.getReactivePower());
            return dto;
        }

        // Getters and Setters
        public UUID getId() { return id; }
        public void setId(UUID id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public double getX() { return x; }
        public void setX(double x) { this.x = x; }
        public double getY() { return y; }
        public void setY(double y) { this.y = y; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public double getVoltage() { return voltage; }
        public void setVoltage(double voltage) { this.voltage = voltage; }
        public double getCurrent() { return current; }
        public void setCurrent(double current) { this.current = current; }
        public double getFrequency() { return frequency; }
        public void setFrequency(double frequency) { this.frequency = frequency; }
        public double getPowerFactor() { return powerFactor; }
        public void setPowerFactor(double powerFactor) { this.powerFactor = powerFactor; }
        public double getActivePower() { return activePower; }
        public void setActivePower(double activePower) { this.activePower = activePower; }
        public double getReactivePower() { return reactivePower; }
        public void setReactivePower(double reactivePower) { this.reactivePower = reactivePower; }
    }

    public static class GridConnectionDto {
        private UUID id;
        private UUID sourceNodeId;
        private UUID targetNodeId;
        private String lineType;
        private double capacityKva;
        private double currentLoad;
        private boolean active;

        public static GridConnectionDto from(GridConnection conn) {
            GridConnectionDto dto = new GridConnectionDto();
            dto.setId(conn.getId());
            dto.setSourceNodeId(conn.getSourceNodeId());
            dto.setTargetNodeId(conn.getTargetNodeId());
            dto.setLineType(conn.getLineType());
            dto.setCapacityKva(conn.getCapacityKva());
            dto.setCurrentLoad(conn.getCurrentLoad());
            dto.setActive(conn.isActive());
            return dto;
        }

        // Getters and Setters
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

    public static class AlertDto {
        private UUID id;
        private UUID nodeId;
        private String nodeName;
        private String type;
        private String severity;
        private String triggeredAt;
        private String acknowledgedBy;

        public static AlertDto from(com.smartgrid.model.GridAlert alert) {
            AlertDto dto = new AlertDto();
            dto.setId(alert.getId());
            dto.setNodeId(alert.getNodeId());
            dto.setNodeName(alert.getNodeName());
            dto.setType(alert.getType().name());
            dto.setSeverity(alert.getSeverity().name());
            dto.setTriggeredAt(alert.getTriggeredAt().toString());
            dto.setAcknowledgedBy(alert.getAcknowledgedBy());
            return dto;
        }

        // Getters and Setters
        public UUID getId() { return id; }
        public void setId(UUID id) { this.id = id; }
        public UUID getNodeId() { return nodeId; }
        public void setNodeId(UUID nodeId) { this.nodeId = nodeId; }
        public String getNodeName() { return nodeName; }
        public void setNodeName(String nodeName) { this.nodeName = nodeName; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getSeverity() { return severity; }
        public void setSeverity(String severity) { this.severity = severity; }
        public String getTriggeredAt() { return triggeredAt; }
        public void setTriggeredAt(String triggeredAt) { this.triggeredAt = triggeredAt; }
        public String getAcknowledgedBy() { return acknowledgedBy; }
        public void setAcknowledgedBy(String acknowledgedBy) { this.acknowledgedBy = acknowledgedBy; }
    }

    // Getters and Setters
    public UUID getGridId() { return gridId; }
    public void setGridId(UUID gridId) { this.gridId = gridId; }
    public String getGridName() { return gridName; }
    public void setGridName(String gridName) { this.gridName = gridName; }
    public List<GridNodeDto> getNodes() { return nodes; }
    public void setNodes(List<GridNodeDto> nodes) { this.nodes = nodes; }
    public List<GridConnectionDto> getConnections() { return connections; }
    public void setConnections(List<GridConnectionDto> connections) { this.connections = connections; }
    public List<AlertDto> getActiveAlerts() { return activeAlerts; }
    public void setActiveAlerts(List<AlertDto> activeAlerts) { this.activeAlerts = activeAlerts; }
    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}