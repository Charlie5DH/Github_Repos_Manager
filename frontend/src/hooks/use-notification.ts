import { useEffect } from "react";
import { toast } from "./use-toast";

export function useWsNotifications(wsUrl: string) {
  useEffect(() => {
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("WebSocket connection opened.");
    };

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        const messageText = payload.message ?? "Notification received";

        toast({
          title: `${messageText}`,
          description: `Timestamp: ${new Date().toISOString()}`,
          variant: "success",
        });
      } catch (err) {
        console.error("Failed to parse incoming WS message:", err);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    // Cleanup on unmount
    return () => {
      socket.close();
    };
  }, [wsUrl]);
}
