package com.smartgrid.simulation;

import com.smartgrid.model.GridNode;
import com.smartgrid.model.GridConnection;
import com.smartgrid.model.GridAlert;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class GridSimulationEngine {

    private final Map<UUID, GridNode> nodes = new ConcurrentHashMap<>();
    private final Map<UUID, GridConnection> connections = new ConcurrentHashMap<>();
    private final List<GridAlert> activeAlerts = new ArrayList<>();
    private final Deque<Map<String, Object>> history = new ArrayDeque<>();
    private final int maxHistorySize = 1800; // 30 minutes at 1 snapshot/sec

    private volatile boolean faultScenarioActive = false;
    private volatile UUID faultNodeId = null;
    private volatile double faultStartTime = 0;

    private static final double BASE_VOLTAGE = 230.0;
    private static final double BASE_FREQUENCY = 50.0;
    private static final double VOLTAGE_TOLERANCE = 0.05;
    private static final double FREQUENCY_TOLERANCE = 0.02;

    public GridSimulationEngine() {
        initializeSuburbanGrid();
    }

    private void initializeSuburbanGrid() {
        // Create 132kV Substation at center top
        UUID substation = createNode("132kV Substation", GridNode.NodeType.SUBSTATION, 400, 50);

        // Create 4 transformer stations
        UUID t1 = createNode("Transformer T1", GridNode.NodeType.TRANSFORMER, 200, 150);
        UUID t2 = createNode("Transformer T2", GridNode.NodeType.TRANSFORMER, 400, 150);
        UUID t3 = createNode("Transformer T3", GridNode.NodeType.TRANSFORMER, 600, 150);
        UUID t4 = createNode("Transformer T4", GridNode.NodeType.TRANSFORMER, 800, 150);

        // Connect substation to transformers
        createConnection(substation, t1, "132kV", 50000);
        createConnection(substation, t2, "132kV", 50000);
        createConnection(substation, t3, "132kV", 50000);
        createConnection(substation, t4, "132kV", 50000);

        // Create distribution feeders from each transformer
        // T1 feeders
        createFeederChain(t1, new double[][]{{100, 250}, {80, 350}, {60, 450}, {40, 550}}, "11kV", "T1-F");
        // T2 feeders
        createFeederChain(t2, new double[][]{{300, 250}, {320, 350}, {340, 450}, {360, 550}}, "11kV", "T2-F");
        // T3 feeders
        createFeederChain(t3, new double[][]{{500, 250}, {520, 350}, {540, 450}, {560, 550}}, "11kV", "T3-F");
        // T4 feeders
        createFeederChain(t4, new double[][]{{700, 250}, {720, 350}, {740, 450}, {760, 550}}, "11kV", "T4-F");

        // Create meters and sensors at various points
        createMeter("Meter M1", 100, 550);
        createMeter("Meter M2", 360, 550);
        createMeter("Meter M3", 540, 550);
        createMeter("Meter M4", 760, 550);
    }

    private UUID createNode(String name, GridNode.NodeType type, double x, double y) {
        UUID id = UUID.randomUUID();
        GridNode node = new GridNode(id, name, type, x, y);
        nodes.put(id, node);
        return id;
    }

    private void createConnection(UUID sourceId, UUID targetId, String lineType, double capacityKva) {
        UUID id = UUID.randomUUID();
        GridConnection conn = new GridConnection(id, sourceId, targetId, lineType, capacityKva);
        connections.put(id, conn);
    }

    private void createFeederChain(UUID startNode, double[][] positions, String lineType, String prefix) {
        UUID prevNodeId = startNode;
        for (int i = 0; i < positions.length; i++) {
            UUID feeder = createNode(prefix + (i + 1), GridNode.NodeType.FEEDER, positions[i][0], positions[i][1]);
            createConnection(prevNodeId, feeder, lineType, 5000);
            prevNodeId = feeder;
        }
    }

    private void createMeter(String name, double x, double y) {
        createNode(name, GridNode.NodeType.METER, x, y);
    }

    public void simulateTick(double deltaTimeSeconds) {
        double time = System.currentTimeMillis() / 1000.0;

        // Process fault scenario if active
        if (faultScenarioActive && faultNodeId != null) {
            processFaultScenario(time);
        }

        // Simulate each node's telemetry
        for (GridNode node : nodes.values()) {
            simulateNodeTelemetry(node, time);
        }

        // Update connection loads
        for (GridConnection conn : connections.values()) {
            simulateConnectionLoad(conn);
        }

        // Check for alert conditions
        checkAlertConditions();

        // Store snapshot for history
        storeSnapshot();
    }

    private void simulateNodeTelemetry(GridNode node, double time) {
        switch (node.getType()) {
            case SUBSTATION:
                simulateSubstationTelemetry(node, time);
                break;
            case TRANSFORMER:
                simulateTransformerTelemetry(node, time);
                break;
            case FEEDER:
                simulateFeederTelemetry(node, time);
                break;
            case METER:
                simulateMeterTelemetry(node, time);
                break;
            case SENSOR:
                simulateSensorTelemetry(node, time);
                break;
        }
    }

    private void simulateSubstationTelemetry(GridNode node, double time) {
        // Base voltage around 132kV with small variations
        double voltageVariation = Math.sin(time * 0.1) * 2000 + Math.sin(time * 0.03) * 1000;
        node.setVoltage(132000 + voltageVariation);
        node.setFrequency(BASE_FREQUENCY + (Math.random() - 0.5) * FREQUENCY_TOLERANCE);
        node.setPowerFactor(0.95 + Math.random() * 0.04);

        // Power output varies with demand
        double demandFactor = 0.7 + 0.3 * Math.sin(time * 0.05);
        node.setActivePower(50000 * demandFactor);
        node.setReactivePower(node.getActivePower() * 0.3);

        node.setCurrent(node.getActivePower() / (node.getVoltage() / 1000) / Math.sqrt(3));
        node.setStatus(GridNode.NodeStatus.NORMAL);
    }

    private void simulateTransformerTelemetry(GridNode node, double time) {
        // 11kV output with voltage drop based on load
        double loadFactor = 0.4 + 0.4 * Math.sin(time * 0.07 + node.getX() * 0.01);
        node.setVoltage(11000 + (Math.random() - 0.5) * 500);
        node.setFrequency(BASE_FREQUENCY + (Math.random() - 0.5) * 0.01);
        node.setPowerFactor(0.92 + Math.random() * 0.06);
        node.setActivePower(8000 * loadFactor);
        node.setReactivePower(node.getActivePower() * 0.25);
        node.setCurrent(node.getActivePower() / (node.getVoltage() / 1000) / Math.sqrt(3));

        // Check for overload condition
        double loadPercentage = node.getActivePower() / 10000;
        if (loadPercentage > 0.9) {
            node.setStatus(GridNode.NodeStatus.WARNING);
        } else {
            node.setStatus(GridNode.NodeStatus.NORMAL);
        }
    }

    private void simulateFeederTelemetry(GridNode node, double time) {
        double loadVariation = Math.sin(time * 0.15 + node.getY() * 0.02) * 0.3 + 0.5;
        node.setVoltage(BASE_VOLTAGE + (Math.random() - 0.5) * 20);
        node.setFrequency(BASE_FREQUENCY + (Math.random() - 0.5) * 0.05);
        node.setPowerFactor(0.85 + Math.random() * 0.14);
        node.setActivePower(500 * loadVariation);
        node.setReactivePower(node.getActivePower() * 0.4);
        node.setCurrent(node.getActivePower() / node.getVoltage());

        // Small chance of voltage sag
        if (Math.random() < 0.001) {
            node.setVoltage(node.getVoltage() * 0.85);
            node.setStatus(GridNode.NodeStatus.WARNING);
        } else {
            node.setStatus(GridNode.NodeStatus.NORMAL);
        }
    }

    private void simulateMeterTelemetry(GridNode node, double time) {
        double consumptionPattern = getConsumptionPattern(time);
        node.setVoltage(BASE_VOLTAGE + (Math.random() - 0.5) * 10);
        node.setFrequency(BASE_FREQUENCY + (Math.random() - 0.5) * 0.02);
        node.setPowerFactor(0.90 + Math.random() * 0.09);
        node.setActivePower(100 * consumptionPattern);
        node.setReactivePower(node.getActivePower() * 0.35);
        node.setCurrent(node.getActivePower() / node.getVoltage());
        node.setStatus(GridNode.NodeStatus.NORMAL);
    }

    private void simulateSensorTelemetry(GridNode node, double time) {
        // Sensors measure quality metrics
        node.setVoltage(BASE_VOLTAGE);
        node.setFrequency(BASE_FREQUENCY + (Math.random() - 0.5) * 0.01);
        node.setPowerFactor(0.98 + Math.random() * 0.02);
        node.setCurrent(5 + Math.random() * 10);
        node.setActivePower(node.getVoltage() * node.getCurrent() * node.getPowerFactor() / 1000);
        node.setReactivePower(node.getActivePower() * 0.1);
        node.setStatus(GridNode.NodeStatus.NORMAL);
    }

    private double getConsumptionPattern(double time) {
        // Simulate daily consumption pattern
        double hour = (time / 3600) % 24;
        if (hour >= 6 && hour < 9) return 0.6 + (hour - 6) * 0.2; // Morning peak
        if (hour >= 9 && hour < 17) return 0.5; // Daytime
        if (hour >= 17 && hour < 21) return 0.8 + (hour - 17) * 0.1; // Evening peak
        if (hour >= 21 && hour < 23) return 0.7; // Late evening
        return 0.3; // Night
    }

    private void simulateConnectionLoad(GridConnection conn) {
        GridNode source = nodes.get(conn.getSourceNodeId());
        GridNode target = nodes.get(conn.getTargetNodeId());
        if (source != null && target != null) {
            double powerFlow = Math.min(source.getActivePower(), target.getActivePower() * 1.2);
            conn.setCurrentLoad(powerFlow);
        }
    }

    private void checkAlertConditions() {
        for (GridNode node : nodes.values()) {
            // Voltage check
            if (node.getType() == GridNode.NodeType.FEEDER) {
                if (node.getVoltage() < BASE_VOLTAGE * 0.9) {
                    triggerAlert(node, GridAlert.AlertType.VOLTAGE_SAG, GridAlert.AlertSeverity.WARNING);
                } else if (node.getVoltage() > BASE_VOLTAGE * 1.1) {
                    triggerAlert(node, GridAlert.AlertType.VOLTAGE_SWELL, GridAlert.AlertSeverity.WARNING);
                }
            }
            // Frequency check
            if (Math.abs(node.getFrequency() - BASE_FREQUENCY) > FREQUENCY_TOLERANCE) {
                triggerAlert(node, GridAlert.AlertType.FREQUENCY_DEVIATION, GridAlert.AlertSeverity.CRITICAL);
            }
        }
    }

    private void triggerAlert(GridNode node, GridAlert.AlertType type, GridAlert.AlertSeverity severity) {
        // Avoid duplicate alerts for same node and type
        boolean exists = activeAlerts.stream()
            .anyMatch(a -> a.getNodeId().equals(node.getId()) && a.getType() == type && a.getResolvedAt() == null);

        if (!exists) {
            GridAlert alert = new GridAlert(UUID.randomUUID(), node.getId(), node.getName(), type, severity);
            activeAlerts.add(alert);
            node.setStatus(severity == GridAlert.AlertSeverity.CRITICAL ? GridNode.NodeStatus.FAULT : GridNode.NodeStatus.WARNING);
        }
    }

    private void processFaultScenario(double time) {
        GridNode faultNode = nodes.get(faultNodeId);
        if (faultNode != null) {
            // Gradually reduce voltage at fault node
            double faultDuration = time - faultStartTime;
            if (faultDuration < 5) {
                faultNode.setVoltage(faultNode.getVoltage() * 0.95);
                faultNode.setStatus(GridNode.NodeStatus.FAULT);
            }
        }
    }

    private void storeSnapshot() {
        if (history.size() >= maxHistorySize) {
            history.removeFirst();
        }
        Map<String, Object> snapshot = new HashMap<>();
        snapshot.put("timestamp", System.currentTimeMillis());
        snapshot.put("nodes", new HashMap<>(nodes));
        snapshot.put("connections", new HashMap<>(connections));
        snapshot.put("alerts", new ArrayList<>(activeAlerts));
        history.addLast(snapshot);
    }

    // Public API methods

    public Map<UUID, GridNode> getNodes() {
        return Collections.unmodifiableMap(nodes);
    }

    public Map<UUID, GridConnection> getConnections() {
        return Collections.unmodifiableMap(connections);
    }

    public List<GridAlert> getActiveAlerts() {
        return Collections.unmodifiableList(activeAlerts);
    }

    public void acknowledgeAlert(UUID alertId, String operatorId) {
        activeAlerts.stream()
            .filter(a -> a.getId().equals(alertId))
            .findFirst()
            .ifPresent(alert -> {
                alert.setAcknowledgedBy(operatorId);
            });
    }

    public void resolveAlert(UUID alertId) {
        activeAlerts.stream()
            .filter(a -> a.getId().equals(alertId))
            .findFirst()
            .ifPresent(alert -> {
                alert.setResolvedAt(java.time.Instant.now());
                GridNode node = nodes.get(alert.getNodeId());
                if (node != null && node.getStatus() == GridNode.NodeStatus.FAULT) {
                    node.setStatus(GridNode.NodeStatus.NORMAL);
                    node.setVoltage(BASE_VOLTAGE);
                }
            });
    }

    public void injectFaultScenario(UUID nodeId) {
        this.faultNodeId = nodeId;
        this.faultScenarioActive = true;
        this.faultStartTime = System.currentTimeMillis() / 1000.0;

        GridNode node = nodes.get(nodeId);
        if (node != null) {
            GridAlert alert = new GridAlert(UUID.randomUUID(), nodeId, node.getName(),
                GridAlert.AlertType.LINE_FAULT, GridAlert.AlertSeverity.CRITICAL);
            activeAlerts.add(alert);
        }
    }

    public void clearFaultScenario() {
        this.faultScenarioActive = false;
        this.faultNodeId = null;
    }

    public Map<String, Object> getHistoricalSnapshot(long timestamp) {
        return history.stream()
            .filter(s -> Math.abs((Long) s.get("timestamp") - timestamp) < 1000)
            .findFirst()
            .orElse(null);
    }

    public List<Map<String, Object>> getHistoryRange(long startTime, long endTime) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map<String, Object> snapshot : history) {
            long ts = (Long) snapshot.get("timestamp");
            if (ts >= startTime && ts <= endTime) {
                result.add(snapshot);
            }
        }
        return result;
    }

    public GridNode getNode(UUID nodeId) {
        return nodes.get(nodeId);
    }

    public void setNodeStatus(UUID nodeId, GridNode.NodeStatus status) {
        GridNode node = nodes.get(nodeId);
        if (node != null) {
            node.setStatus(status);
        }
    }
}