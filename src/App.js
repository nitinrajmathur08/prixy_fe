import React from 'react';
import './App.css';
import Header from './layouts/Header';
import Siderbar from './layouts/Siderbar'; // Corrected import statement
import Footer from './layouts/Footer';
import Dashboard from './pages/Dashboard';
import UserList from './pages/users/List';
import UserDetail from './pages/users/Detail';
import Login from './pages/Login';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toastify styles
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useNavigate } from 'react-router-dom'; // Import Routes instead of Route
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import AgentList from './pages/agents/List';
import AgentDetail from './pages/agents/Detail';
import GobalSettingList from './pages/golbalSettings/List';
import AddGlobalSettings from './pages/golbalSettings/Add';
import RequestList from './pages/requests/List';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import DetailRequest from './pages/requests/Detail';
import FundraiserList from './pages/fundraisers/List';
import FundraiserDetail from './pages/fundraisers/Detail';

const queryClient = new QueryClient()

function App() {

  // Simulated authentication check
  const isAuthenticated = localStorage.getItem('isAuthenticated'); // Parse as boolean

  return (
    <QueryClientProvider client={queryClient}>
      <div className="wrapper">
        <Router basename="/admin-panel">
          <ToastContainer />
          <Routes>
            <Route
              path="/login"
              element={(isAuthenticated === 'true') ? <Navigate to="/dashboard" /> : <Login />}
            />
            <Route path="/" element={<DashboardLayout isAuthenticated={isAuthenticated} />}>
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/users" element={<UserList />} />
              <Route path="/users/detail/:id" element={<UserDetail />} />

              <Route path="/agents" element={<AgentList />} />
              <Route path="/agents/detail/:id" element={<AgentDetail />} />

              <Route path="/requests" element={<RequestList />} />
              <Route path="/fundraisers" element={<FundraiserList />} />
              <Route path="/fundraisers/detail/:id" element={<FundraiserDetail />} />
              <Route path="/requests/detail/:id" element={<DetailRequest />} />
              <Route path="/gobal-setting" element={<GobalSettingList />} />
              <Route path="/gobal-setting/add/" element={<AddGlobalSettings />} />
              <Route path="/gobal-setting/edit/:id" element={<AddGlobalSettings />} />


            </Route>
          </Routes>
        </Router>
      </div>

    </QueryClientProvider>
  );
}

function DashboardLayout({ isAuthenticated }) {
  const isAuthenticate = localStorage.getItem('isAuthenticated'); // Parse as boolean
  if (isAuthenticate === 'true') {
    return (
      <>
        <Header />
        <Siderbar />
        <Outlet /> {/* Renders child routes */}
        <Footer />
      </>
    );
  } else {
    return <Navigate to="/login" />;
  }
}
export default App;


// http://3.22.121.28/login
// prixy.admin@gmail.com
// 123456