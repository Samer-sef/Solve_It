import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home"


function App() {

  return (
    <div className="App">
      <Router>
        <div >
          <div >
            <Routes>
              <Route path="/" element={<Home/>} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
