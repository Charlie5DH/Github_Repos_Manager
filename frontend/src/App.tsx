import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/navbar";
import GitHubSearch from "./pages/search/github-search";
import MyRepos from "./pages/repos/my-repos";
import DashedBackgroundLines from "./components/layout/dashed-lines";

function App() {
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
