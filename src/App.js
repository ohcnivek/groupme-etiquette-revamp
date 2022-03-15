import './App.css';
import HomeScreen from "./screens/HomeScreen"
import GroupScreen from './screens/GroupScreen';
import RankingScreen from './screens/RankingScreen';

import {
  BrowserRouter,
  Routes, //replaces "Switch" used till v5
  Route,
} from "react-router-dom";


function App() {
  return (
    <div className="App">
      {/* <header className="App-header"> */}
        <BrowserRouter>
        <Routes> 
            <Route path="/" element={<HomeScreen/>}/>
            <Route path="/GroupScreen" element={<GroupScreen/>}/>
            <Route path="/GroupScreen/RankingScreen" element={<RankingScreen/>}/>

        </Routes>
        </BrowserRouter>
      {/* </header> */}
    </div>
  );
}

export default App;
