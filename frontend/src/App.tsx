import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/navbar";
import GitHubSearch from "./pages/search/github-search";
import MyRepos from "./pages/repos/my-repos";
import DashedBackgroundLines from "./components/layout/dashed-lines";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <Router>
      <Toaster />
      <div className="min-h-screen bg-background text-foreground">
        <DashedBackgroundLines />
        <Navbar />
        <Routes>
          <Route path="/" element={<GitHubSearch />} />
          <Route path="/my-repos" element={<MyRepos />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
