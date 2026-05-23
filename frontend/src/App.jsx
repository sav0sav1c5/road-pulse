import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import AccidentsPage from './pages/AccidentsPage';
import StatsPage from './pages/StatsPage';
import PredictPage from './pages/PredictPage';
import './App.css'

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path='/' element={<StatsPage/>}></Route>
                    <Route path='/predict' element={<PredictPage/>}></Route>
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App
