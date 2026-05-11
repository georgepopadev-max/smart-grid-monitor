package com.smartgrid.repository;

import com.smartgrid.entity.TelemetrySnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.Instant;
import java.util.List;

@Repository
public interface TelemetrySnapshotRepository extends JpaRepository<TelemetrySnapshot, Long> {
    List<TelemetrySnapshot> findByRecordedAtBetween(Instant start, Instant end);
}