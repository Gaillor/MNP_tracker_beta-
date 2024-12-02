import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Dashboard } from '../pages/Dashboard';
import { Login } from '../pages/Login';
import { AuthGuard } from '../components/auth/AuthGuard';
import { InvestmentList } from '../pages/investments/InvestmentList';
import { InvestmentForm } from '../pages/investments/InvestmentForm';
import { LivestockList } from '../pages/livestock/LivestockList';
import { LivestockForm } from '../pages/livestock/LivestockForm';
import { TaskList } from '../pages/tasks/TaskList';
import { TaskForm } from '../pages/tasks/TaskForm';
import { TimelineList } from '../pages/timeline/TimelineList';
import { TimelineForm } from '../pages/timeline/TimelineForm';
import { UserList } from '../pages/users/UserList';
import { UserForm } from '../pages/users/UserForm';
import { ReportsDashboard } from '../pages/reports/ReportsDashboard';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route
        path="/"
        element={
          <AuthGuard>
            <Layout />
          </AuthGuard>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="investments" element={<InvestmentList />} />
        <Route path="investments/new" element={<InvestmentForm />} />
        <Route path="investments/:id/edit" element={<InvestmentForm />} />
        <Route path="livestock" element={<LivestockList />} />
        <Route path="livestock/new" element={<LivestockForm />} />
        <Route path="livestock/:id/edit" element={<LivestockForm />} />
        <Route path="tasks" element={<TaskList />} />
        <Route path="tasks/new" element={<TaskForm />} />
        <Route path="tasks/:id/edit" element={<TaskForm />} />
        <Route path="timeline" element={<TimelineList />} />
        <Route path="timeline/new" element={<TimelineForm />} />
        <Route path="timeline/:id/edit" element={<TimelineForm />} />
        <Route path="users" element={<UserList />} />
        <Route path="users/new" element={<UserForm />} />
        <Route path="users/:id/edit" element={<UserForm />} />
        <Route path="reports" element={<ReportsDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}