import AdminNavbar from "../components/AdminNavbar";
import DashboardStats from "../components/DashboardStats";
import OrdersList from "../components/OrdersList";

const Dashboard = () => {
  return (
    <>
      <AdminNavbar />
      <DashboardStats />
      <OrdersList />
    </>
  );
};
export default Dashboard;
