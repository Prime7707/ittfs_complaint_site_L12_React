import DashboardLoyout from "@/layouts/dashboard-layout";
import { Head } from "@inertiajs/react";

const Dashboard = () => {
	return (
		<DashboardLoyout>
			<Head title="Dashboard" />
			<main className="flex-1 p-8 text-[var(--dark-2)]">
				<h1 className="text-3xl font-bold text-[var(--hl1-4)] mb-4">Welcome to the Dashboard</h1>
				<p className="text-[var(--dark-2)]">Here you can manage your personal information, security settings, and more.</p>
			</main>
		</DashboardLoyout>
	);
}

export default Dashboard;