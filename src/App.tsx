import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import CardManagement from "./pages/CardManagement";

import AccountManagement from "./pages/AccountManagement";
import AddAccount from "./pages/AddAccount";
import CreditManagement from "./pages/CreditManagement";
import AddCredit from "./pages/AddCredit";
import RequestManagement from "./pages/RequestManagement";
import Notifications from "./pages/Notifications";
import Layout from "./components/Layout";
import ApplyCard from "./pages/ApplyCard";
import ApplyAccount from "./pages/ApplyAccount";
import ApplyCredit from "./pages/ApplyCredit";
import { Toaster } from "./components/ui/toaster";
import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UserManagement />} />
            //cart management
            <Route path="cards" element={<CardManagement />} />
            <Route path="apply/card" element={<ApplyCard />} />
            <Route path="cards/edit/:id" element={<ApplyCard />} />
            //account management
            <Route path="accounts" element={<AccountManagement />} />
            <Route path="accounts/add" element={<ApplyAccount />} />
            <Route path="accounts/edit/:id" element={<ApplyAccount />} />
            //credit management
            <Route path="credits" element={<CreditManagement />} />
            <Route path="credits/add" element={<ApplyCredit />} />
            <Route path="credits/edit/:id" element={<ApplyCredit />} />
            //request management
            <Route path="requests" element={<RequestManagement />} />
            <Route path="notifications" element={<Notifications />} />
            
            
            
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </ToastProvider>
  );
}

export default App;
