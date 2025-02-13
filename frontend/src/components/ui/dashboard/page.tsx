import React from 'react';

interface DashboardProps {
  user: {
    name: string;
    role: string;
  };
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the Dashboard, {user.name}!</p>
      <p>Your role: {user.role}</p>
    </div>
  );
};

export default Dashboard;
