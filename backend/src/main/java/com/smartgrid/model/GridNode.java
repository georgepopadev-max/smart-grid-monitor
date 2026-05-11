package com.smartgrid.model;

import java.util.UUID;

public class GridNode {
    private UUID id;
    private String name;
    private NodeType type;
    private double x;
    private double y;
    private NodeStatus status;
    private double voltage;
    private double current;
    private double frequency;
    private double powerFactor;
    private double activePower;
    private double reactivePower;

    public GridNode() {}

    public GridNode(UUID id, String name, NodeType type, double x, double y) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.x = x;
        this.y = y;
        this.status = NodeStatus.NORMAL;
        this.voltage = 230.0;
        this.current = 0.0;
        this.frequency = 50.0;
        this.powerFactor = 0.95;
        this.activePower = 0.0;
        this.reactivePower = 0.0;
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