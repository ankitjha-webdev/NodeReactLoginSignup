import React from 'react';
import ReactDOM from 'react-dom/client';
import { Routes, Route } from 'react-router';
import { BrowserRouter} from 'react-router-dom';

import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import './Login.css';
import { NotFound } from './NotFound';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login />}></Route>
            <Route exact path='/register' element={<Register/>} />
            <Route path='/dashboard' element={<Dashboard/>} />
            <Route element={<NotFound/>}/>
        </Routes>
    </BrowserRouter>,

);