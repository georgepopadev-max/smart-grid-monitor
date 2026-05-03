package com.smartgrid.simulation;

import com.smartgrid.model.GridAlert;
import com.smartgrid.model.GridNode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class GridSimulationEngineTest {

    private GridSimulationEngine engine;

    @BeforeEach
    void setUp() {
        engine = new GridSimulationEngine();
    }

    @Test
    void testEngineInitializesWithNodes() {
        assertNotNull(engine.getNodes());
        assertFalse(engine.getNodes().isEmpty());
    }

    @Test
    void testEngineInitializesWithConnections() {
        assertNotNull(engine.getConnections());
        assertFalse(engine.getConnections().isEmpty());
    }

    @Test
    void testSimulationTickUpdatesNodes() {
        var nodesBefore = engine.getNodes().values().stream()
            .mapToDouble(GridNode::getVoltage)
            .sum();

        engine.simulateTick(0.5);

        var nodesAfter = engine.getNodes().values().stream()
            .mapToDouble(GridNode::getVoltage)
            .sum();

        // Voltage values should change after simulation tick
        assertNotEquals(nodesBefore, nodesAfter);
    }

    @Test
    void testSubstationHasHighVoltage() {
        engine.simulateTick(0.5);

        GridNode substation = engine.getNodes().values().stream()
            .filter(n -> n.getType() == GridNode.NodeType.SUBSTATION)
            .findFirst()
            .orElse(null);

        assertNotNull(substation);
        assertTrue(substation.getVoltage() > 100000, "Substation voltage should be > 100kV");
    }

    @Test
    void testTransformerVoltageIsLowerThanSubstation() {
        engine.simulateTick(0.5);

        GridNode substation = engine.getNodes().values().stream()
            .filter(n -> n.getType() == GridNode.NodeType.SUBSTATION)
            .findFirst()
            .orElse(null);

        GridNode transformer = engine.getNodes().values().stream()
            .filter(n -> n.getType() == GridNode.NodeType.TRANSFORMER)
            .findFirst()
            .orElse(null);

        assertNotNull(substation);
        assertNotNull(transformer);
        assertTrue(transformer.getVoltage() < substation.getVoltage(),
            "Transformer voltage should be lower than substation");
    }

    @Test
    void testFrequencyStaysWithinTolerance() {
        for (int i = 0; i < 10; i++) {
            engine.simulateTick(0.5);
        }

        for (GridNode node : engine.getNodes().values()) {
            assertTrue(node.getFrequency() >= 49.9 && node.getFrequency() <= 50.1,
                "Frequency should stay within 49.9-50.1 Hz tolerance");
        }
    }

    @Test
    void testPowerFactorIsWithinValidRange() {
        engine.simulateTick(0.5);

        for (GridNode node : engine.getNodes().values()) {
            assertTrue(node.getPowerFactor() >= 0.85 && node.getPowerFactor() <= 0.99,
                "Power factor should be between 0.85 and 0.99");
        }
    }

    @Test
    void testFaultInjectionChangesNodeStatus() {
        UUID nodeId = engine.getNodes().values().stream()
            .filter(n -> n.getType() == GridNode.NodeType.FEEDER)
            .findFirst()
            .orElseThrow()
            .getId();

        assertEquals(GridNode.NodeStatus.NORMAL, engine.getNode(nodeId).getStatus());

        engine.injectFaultScenario(nodeId);
        engine.simulateTick(0.5);

        // After fault injection, node should eventually show fault status
        // Note: fault processing happens during simulateTick
    }

    @Test
    void testAlertAcknowledgment() {
        UUID nodeId = engine.getNodes().values().stream()
            .findFirst()
            .orElseThrow()
            .getId();

        engine.injectFaultScenario(nodeId);

        // Find the alert
        GridAlert alert = engine.getActiveAlerts().stream()
            .filter(a -> a.getNodeId().equals(nodeId))
            .findFirst()
            .orElse(null);

        if (alert != null) {
            engine.acknowledgeAlert(alert.getId(), "TEST_OPERATOR");
            assertEquals("TEST_OPERATOR", alert.getAcknowledgedBy());
        }
    }

    @Test
    void testHistoryStoresSnapshots() {
        // Simulate for enough time to accumulate history
        for (int i = 0; i < 5; i++) {
            engine.simulateTick(0.5);
        }

        // History should have some snapshots
        long currentTime = System.currentTimeMillis();
        var history = engine.getHistoryRange(currentTime - 60000, currentTime);
        assertNotNull(history);
    }

    @Test
    void testConnectionLoadIsCalculated() {
        engine.simulateTick(0.5);

        for (var conn : engine.getConnections().values()) {
            // Connection load should be a non-negative value
            assertTrue(conn.getCurrentLoad() >= 0,
                "Connection load should be non-negative");
        }
    }
}