package com.smartgrid.seeder;

import com.smartgrid.entity.GridNode;
import com.smartgrid.entity.GridConnection;
import com.smartgrid.entity.GridAlert;
import com.smartgrid.entity.TelemetrySnapshot;
import com.smartgrid.repository.GridNodeRepository;
import com.smartgrid.repository.GridConnectionRepository;
import com.smartgrid.repository.GridAlertRepository;
import com.smartgrid.repository.TelemetrySnapshotRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.Instant;
import java.util.UUID;

@Component
public class DataSeeder implements CommandLineRunner {
    
    private final GridNodeRepository nodeRepository;
    private final GridConnectionRepository connectionRepository;
    private final GridAlertRepository alertRepository;
    private final TelemetrySnapshotRepository telemetryRepository;
    
    public DataSeeder(GridNodeRepository nodeRepository,
                      GridConnectionRepository connectionRepository,
                      GridAlertRepository alertRepository,
                      TelemetrySnapshotRepository telemetryRepository) {
        this.nodeRepository = nodeRepository;
        this.connectionRepository = connectionRepository;
        this.alertRepository = alertRepository;
        this.telemetryRepository = telemetryRepository;
    }
    
    @Override
    public void run(String... args) {
        if (nodeRepository.count() > 0) return;
        
        // Seed GridNodes
        UUID node1Id = UUID.randomUUID();
        UUID node2Id = UUID.randomUUID();
        UUID node3Id = UUID.randomUUID();
        UUID node4Id = UUID.randomUUID();
        UUID node5Id = UUID.randomUUID();
        
        GridNode node1 = new GridNode(node1Id, "Main Substation A", GridNode.NodeType.SUBSTATION, 100, 200);
        node1.setVoltage(400.0);
        node1.setActivePower(5000.0);
        nodeRepository.save(node1);
        
        GridNode node2 = new GridNode(node2Id, "Transformer T1", GridNode.NodeType.TRANSFORMER, 250, 150);
        node2.setVoltage(230.0);
        node2.setActivePower(2500.0);
        nodeRepository.save(node2);
        
        GridNode node3 = new GridNode(node3Id, "Feeder F1", GridNode.NodeType.FEEDER, 400, 300);
        node3.setVoltage(225.0);
        node3.setActivePower(1200.0);
        nodeRepository.save(node3);
        
        GridNode node4 = new GridNode(node4Id, "Feeder F2", GridNode.NodeType.FEEDER, 500, 200);
        node4.setVoltage(228.0);
        node4.setActivePower(800.0);
        nodeRepository.save(node4);
        
        GridNode node5 = new GridNode(node5Id, "Meter Point M1", GridNode.NodeType.METER, 600, 350);
        node5.setVoltage(230.0);
        node5.setActivePower(400.0);
        nodeRepository.save(node5);
        
        // Seed Connections
        connectionRepository.save(new GridConnection(UUID.randomUUID(), node1Id, node2Id, "HIGH_VOLTAGE", 10000.0));
        connectionRepository.save(new GridConnection(UUID.randomUUID(), node2Id, node3Id, "MEDIUM_VOLTAGE", 5000.0));
        connectionRepository.save(new GridConnection(UUID.randomUUID(), node2Id, node4Id, "MEDIUM_VOLTAGE", 5000.0));
        connectionRepository.save(new GridConnection(UUID.randomUUID(), node3Id, node5Id, "LOW_VOLTAGE", 2000.0));
        connectionRepository.save(new GridConnection(UUID.randomUUID(), node4Id, node5Id, "LOW_VOLTAGE", 2000.0));
        
        // Seed an active alert
        GridAlert alert = new GridAlert(UUID.randomUUID(), node3Id, "Feeder F1", GridAlert.AlertType.OVERLOAD, GridAlert.AlertSeverity.MEDIUM);
        alertRepository.save(alert);
        
        // Seed telemetry snapshots
        for (int i = 0; i < 10; i++) {
            TelemetrySnapshot snapshot = new TelemetrySnapshot();
            snapshot.setNodeId(node1Id.toString());
            snapshot.setNodeName("Main Substation A");
            snapshot.setVoltage(398.0 + Math.random() * 4);
            snapshot.setCurrent(50.0 + Math.random() * 10);
            snapshot.setFrequency(49.9 + Math.random() * 0.2);
            snapshot.setPowerFactor(0.93 + Math.random() * 0.04);
            snapshot.setActivePower(4900.0 + Math.random() * 200);
            snapshot.setReactivePower(1500.0 + Math.random() * 100);
            snapshot.setRecordedAt(Instant.now().minusSeconds(i * 60));
            telemetryRepository.save(snapshot);
        }
        
        System.out.println("Smart Grid Monitor Demo Data Seeded!");
    }
}