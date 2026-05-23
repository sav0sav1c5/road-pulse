import {BrowserRouter, Route, Routes, NavLink} from 'react-router-dom';
import AccidentPage from './pages/AccidentsPage';
import StatsPage from './pages/StatsPage';
import PredictionPage from './pages/PredictPage';

import './App.css'

function App() {
    return (
        <BrowserRouter>
            <div className='app'>
                <nav className='navbar'>
                    <span className='navbar-title'>ROAD PULSE SERBIA</span>
                    <div className='navbar-links'>
                        <NavLink to='/'>Accidents</NavLink>
                        <NavLink to='/statistics'>Statistics</NavLink>
                        <NavLink to='/predict'>Predictions</NavLink>
                    </div>
                </nav>

                <main className='main-content'>
                    <Routes>
                        <Route path='/' element={<AccidentPage/>}></Route>
                        <Route path='/statistics' element={<StatsPage/>}></Route>
                        <Route path='/predict' element={<PredictionPage/>}></Route>
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App
