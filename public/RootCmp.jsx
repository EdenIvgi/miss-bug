// const Router = ReactRouterDOM.HashRouter
const Router = ReactRouterDOM.BrowserRouter
const { Route, Routes } = ReactRouterDOM
const { useState } = React

import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'
import { BugEdit } from './pages/BugEdit.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { AboutUs } from './pages/AboutUs.jsx'
import { BugIndex } from './pages/BugIndex.jsx'
import { BugDetails } from './pages/BugDetails.jsx'
import { UserProfile } from './pages/UserProfile.jsx'
import { AdminDashboard } from './pages/AdminDashboard.jsx'
import { authService } from './services/auth.service.js'
import { LoginSignup } from './cmps/LoginSignup.jsx'

export function RootCmp() {
    const [loggedinUser, setLoggedinUser] = useState(authService.getLoggedinUser())

    return (
        <Router>
            <AppHeader loggedinUser={loggedinUser} setLoggedinUser={setLoggedinUser}/>
            <main >
                <Routes>
                    <Route element={<HomePage />} path="/" />
                    <Route element={<BugIndex />} path="/bug" />
                    <Route element={<BugEdit />} path="/bug/edit" />
                    <Route element={<BugEdit />} path="/bug/edit/:bugId" />
                    <Route element={<BugDetails />} path="/bug/:bugId" />
                    <Route element={<AboutUs />} path="/about" />

                    <Route element={<LoginSignup setLoggedinUser={setLoggedinUser}/>} path="/auth"/>
                    <Route element={<UserProfile />} path="/user/:userId" />
                    <Route element={<AdminDashboard />} path="/admin" />
                </Routes>
            </main>
            <AppFooter />
        </Router>
    )
}