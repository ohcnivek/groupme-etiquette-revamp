import './App.css';
import HomeScreen from "./screens/HomeScreen"
import GroupScreen from './screens/GroupScreen';

import {
  BrowserRouter,
  Routes, //replaces "Switch" used till v5
  Route,
} from "react-router-dom";
import RankingScreen from './screens/RankingScreen';


// listGroups()
// getGroupMessageCountAndMessages()
// console.log(main())


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
