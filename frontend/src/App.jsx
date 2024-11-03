import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Goals from './components/Goals';
import Accounts from './components/Accounts';
import Transactions from './components/Transactions';
import Overview from './components/Overview';
import Bills from './components/Bills';
import Predictions from './components/Predictions';
import Header from './components/Header';
import Signup from './components/Signup';
import Login from './components/Login';
import Stocks from './components/Stocks'

function App() {
  return (
    <Router> 
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/bills" element={<Bills />} />
        <Route path="/predictions" element={<Predictions />} />
        <Route path="/stocks" element={<Stocks/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
