import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import AccidentsPage from './pages/AccidentsPage';
import StatsPage from './pages/StatsPage';
import PredictPage from './pages/PredictPage';
import MapPage from './pages/MapPage'

import './App.css'

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path='/' element={<StatsPage/>}></Route>
                    <Route path='/predict' element={<PredictPage/>}></Route>
                    <Route path='/map' element={<MapPage/>}></Route>
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App
