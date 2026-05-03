package com.smartgrid.service;

import com.smartgrid.dto.GridStateDto;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class GridWebSocketBroadcastService {

    private final SimpMessagingTemplate messagingTemplate;
    private final GridStateService gridStateService;

    public GridWebSocketBroadcastService(SimpMessagingTemplate messagingTemplate, GridStateService gridStateService) {
        this.messagingTemplate = messagingTemplate;
        this.gridStateService = gridStateService;
    }

    @Scheduled(fixedRate = 500) // Broadcast every 500ms
    public void broadcastState() {
        GridStateDto state = gridStateService.getCurrentState();
        messagingTemplate.convertAndSend("/topic/grid/state", state);
    }
}