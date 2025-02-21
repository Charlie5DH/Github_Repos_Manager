from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.notify_websocket(message)

manager = ConnectionManager()

@router.websocket("/notify")
async def notify_websocket(websocket: WebSocket):
    """
    WebSocket route for the frontend to connect and receive messages.
    """
    await manager.connect(websocket)
    try:
        while True:
            # If we need to receive messages from the client, handle here
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
