import { GitMergeIcon } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../../hooks/use-toast";

const wsUrl =
  import.meta.env.VITE_API_URL || "ws://localhost:8000/api/ws/notify";

const Navbar = () => {
  const { toast } = useToast();

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
        });
      } catch (err) {
        console.error("Failed to parse incoming WS message:", err);
      }
    };
    socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };
    return () => {
      socket.close();
    };
  }, [toast]);

  return (
    <div className="flex flex-row gap-3 items-center justify-center px-2 w-full dark:bg-black h-14 border-b border-dashed">
      <div className="flex items-center gap-2 border-x-[1px] border-dashed w-full max-w-[1440px] h-full">
        <div className="flex items-center w-full justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <h1 className="text-2xl font-bold">GH Explorer</h1>
              <GitMergeIcon size={24} />
            </div>
            <nav className="flex space-x-4">
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Search
              </Link>
              <Link
                to="/my-repos"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                My Repos
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-2"></div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
