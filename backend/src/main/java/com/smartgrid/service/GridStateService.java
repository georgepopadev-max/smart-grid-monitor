package com.smartgrid.service;

import com.smartgrid.dto.GridStateDto;
import com.smartgrid.model.GridAlert;
import com.smartgrid.model.GridConnection;
import com.smartgrid.model.GridNode;
import com.smartgrid.simulation.GridSimulationEngine;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class GridStateService {

    private final GridSimulationEngine simulationEngine;
    private final Map<String, GridStateSubscriber> subscribers = new ConcurrentHashMap<>();

    public GridStateService(GridSimulationEngine simulationEngine) {
        this.simulationEngine = simulationEngine;
    }

    @Scheduled(fixedRate = 500) // Update every 500ms
    public void tick() {
        simulationEngine.simulateTick(0.5);
        notifySubscribers();
    }

    public void subscribe(String sessionId, GridStateSubscriber subscriber) {
        subscribers.put(sessionId, subscriber);
    }

    public void unsubscribe(String sessionId) {
        subscribers.remove(sessionId);
    }

    private void notifySubscribers() {
        GridStateDto state = buildGridState();
        subscribers.values().forEach(sub -> sub.onStateUpdate(state));
    }

    public GridStateDto getCurrentState() {
        return buildGridState();
    }

    public GridStateDto buildGridState() {
        GridStateDto state = new GridStateDto();
        state.setGridId(UUID.randomUUID());
        state.setGridName("Suburban Distribution");
        state.setTimestamp(java.time.Instant.now());

        Map<UUID, GridNode> nodes = simulationEngine.getNodes();
        state.setNodes(nodes.values().stream()
            .map(GridStateDto.GridNodeDto::from)
            .collect(Collectors.toList()));

        Map<UUID, GridConnection> connections = simulationEngine.getConnections();
        state.setConnections(connections.values().stream()
            .map(GridStateDto.GridConnectionDto::from)
            .collect(Collectors.toList()));

        List<GridAlert> alerts = simulationEngine.getActiveAlerts();
        state.setActiveAlerts(alerts.stream()
            .filter(a -> a.getResolvedAt() == null)
            .map(GridStateDto.AlertDto::from)
            .collect(Collectors.toList()));

        return state;
    }

    public GridStateDto getHistoricalState(long timestamp) {
        Map<String, Object> snapshot = simulationEngine.getHistoricalSnapshot(timestamp);
        if (snapshot == null) {
            return null;
        }
        return buildStateFromSnapshot(snapshot);
    }

    public List<GridStateDto> getHistoryRange(long startTime, long endTime) {
        List<Map<String, Object>> snapshots = simulationEngine.getHistoryRange(startTime, endTime);
        return snapshots.stream()
            .map(this::buildStateFromSnapshot)
            .collect(Collectors.toList());
    }

    private GridStateDto buildStateFromSnapshot(Map<String, Object> snapshot) {
        GridStateDto state = new GridStateDto();
        state.setGridId(UUID.randomUUID());
        state.setGridName("Suburban Distribution");
        state.setTimestamp(java.time.Instant.ofEpochMilli((Long) snapshot.get("timestamp")));

        @SuppressWarnings("unchecked")
        Map<UUID, GridNode> nodes = (Map<UUID, GridNode>) snapshot.get("nodes");
        state.setNodes(nodes.values().stream()
            .map(GridStateDto.GridNodeDto::from)
            .collect(Collectors.toList()));

        @SuppressWarnings("unchecked")
        Map<UUID, GridConnection> connections = (Map<UUID, GridConnection>) snapshot.get("connections");
        state.setConnections(connections.values().stream()
            .map(GridStateDto.GridConnectionDto::from)
            .collect(Collectors.toList()));

        @SuppressWarnings("unchecked")
        List<GridAlert> alerts = (List<GridAlert>) snapshot.get("alerts");
        state.setActiveAlerts(alerts.stream()
            .filter(a -> a.getResolvedAt() == null)
            .map(GridStateDto.AlertDto::from)
            .collect(Collectors.toList()));

        return state;
    }

    public GridNode getNode(UUID nodeId) {
        return simulationEngine.getNode(nodeId);
    }

    public interface GridStateSubscriber {
        void onStateUpdate(GridStateDto state);
    }
}