import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/navbar";
import GitHubSearch from "./pages/search/github-search";
import MyRepos from "./pages/repos/my-repos";
import DashedBackgroundLines from "./components/layout/dashed-lines";
import { Toaster } from "./components/ui/toaster";
import { useNotificationSocket } from "./hooks/use-websocket";

function App() {
  const wsUrl = "ws://localhost:8000/api/ws/notify";
  const messages = useNotificationSocket(wsUrl);
  console.log(messages);
  const notifications = [
    {
      id: "1",
      message: "Your PR has been merged",
      timestamp: new Date(),
    },
    {
      id: "2",
      message: "You have a new notification",
      timestamp: new Date(),
    },
  ];
  return (
    <Router>
      <Toaster />
      <div className="min-h-screen bg-background text-foreground">
        <DashedBackgroundLines />
        <Navbar
          notifications={notifications}
          unreadCount={1}
          handleNotificationClick={() => console.log()}
        />
        <Routes>
          <Route path="/" element={<GitHubSearch />} />
          <Route path="/my-repos" element={<MyRepos />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
