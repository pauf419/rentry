import How from "./component/HowTav/How";
import PreviewTab from "./component/PreviewTab/PreviewTab";
import TextTab from "./component/TextTab/TextTab";
import Toolbar from "./component/Toolbar/Toolbar";
import EditPage from "./page/EditPage/EditPage";
import PreviewPage from "./page/PreviewPage/PreviewPage";
import RootPage from "./page/RootPage/RootPage";
import StatsPage from "./page/StatsPage/StatsPage";
import "./styles/index.sass"
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootPage/>} />
          <Route path="/:id" element={<PreviewPage/>}/>
          <Route path="/:id/edit" element={<EditPage/>}/>
          <Route path="/:id/stats" element={<StatsPage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
