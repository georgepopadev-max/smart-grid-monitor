package com.smartgrid.controller;

import com.smartgrid.dto.GridStateDto;
import com.smartgrid.service.GridStateService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class GridWebSocketController {

    private final GridStateService gridStateService;

    public GridWebSocketController(GridStateService gridStateService) {
        this.gridStateService = gridStateService;
    }

    @MessageMapping("/grid/subscribe")
    @SendTo("/topic/grid/state")
    public GridStateDto subscribeToGrid() {
        return gridStateService.getCurrentState();
    }

    @MessageMapping("/grid/request")
    @SendTo("/topic/grid/state")
    public GridStateDto requestGridState() {
        return gridStateService.getCurrentState();
    }
}