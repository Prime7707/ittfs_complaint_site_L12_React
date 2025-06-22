import { ReactNode, useEffect } from "react";
import Header from "./layout-components/header";
import Footer from "./layout-components/footer";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { usePage } from "@inertiajs/react";
import DashBoardSidebar from "./layout-components/dashboard-sidebar";

interface DashboardLayoutProps {
	children: ReactNode;
}
interface Notification {
	title: string;
	message: string;
	alert_type: "success" | "error" | "info" | "warning";
}
const DashboardLayout = ({ children }: DashboardLayoutProps) => {
	const { props } = usePage<{ flash: { notification?: Notification } }>();
	const notification = props.flash.notification;
	useEffect(() => {
		if (notification?.message && notification?.alert_type && ["success", "error", "info", "warning"].includes(notification.alert_type)) {
			// Pick the correct toast method
			const type = notification.alert_type as "success" | "error" | "info" | "warning";
			toast[type](
				<div>
					{notification.title && <strong>{notification.title}</strong>}
					<ul>{Array.isArray(notification.message) ? notification.message.map((msg, i) => <li key={i}>{msg}</li>) : notification.message}</ul>
				</div>
			);
		}
	}, [notification]);
	return (
		<div className="min-h-screen relative bg-[var(--dark-7)]">
			<Header />
			<div className="relative flex pt-16">
				<DashBoardSidebar />
				<div className="md:ml-64 flex-auto min-h-[calc(100vh)] flex flex-col transition-all">
					<main className="flex-1 container mx-auto p-4">{children}</main>
					<Footer />
				</div>
			</div>
			<ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} transition={Bounce} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover closeButton theme="light" limit={1} toastClassName="custom-toast" />
		</div>
	);
};

export default DashboardLayout;
