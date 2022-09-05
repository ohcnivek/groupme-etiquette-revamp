import HomeScreen from "./screens/HomeScreen";
import GroupScreen from "./screens/GroupScreen";
import RankingScreen from "./screens/RankingScreen";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/GroupScreen" element={<GroupScreen />} />
          <Route
            path="/GroupScreen/RankingScreen"
            element={<RankingScreen />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
