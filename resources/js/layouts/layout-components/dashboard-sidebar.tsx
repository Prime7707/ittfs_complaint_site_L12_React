import { Link, usePage, router } from "@inertiajs/react";
import { LogOut } from "lucide-react";
import axios from "axios";

interface PageProps {
	currentRouteName: string;
	csrf_token: string;
	auth: {
		user?: {
			name: string;
			role: string;
		};
	};
	[key: string]: unknown; // ✅ this line satisfies Inertia's constraint
}
const DashBoardSidebar = () => {
	const { currentRouteName, auth, csrf_token } = usePage<PageProps>().props;
	const isAdmin = auth?.user?.role == "admin";

	axios.defaults.headers.common["X-CSRF-TOKEN"] = csrf_token;
	const logout = async () => {
		router.post(route("logout"));
	};
	return (
		<>
			<aside className="w-0 md:w-64 block md:fixed bg-[var(--dark-8)] min-h-screen md:p-6 transition-all duration-150 origin-left ease-linear overflow-hidden whitespace-nowrap">
				<div className="max-h-screen">
					<div className="text-xl font-bold text-[var(--hl1-4)] mb-6">Hi, {auth.user?.name || "User"}</div>

					<nav className="space-y-4 text-lg font-semibold mt-20 text-[var(--dark-2)]">
						<Link href={route("dashboard")} className={`block transition hover:text-[var(--hl1-4)] ${currentRouteName === "dashboard" ? "text-[var(--hl1-4)]" : ""}`}>
							Dashboard
						</Link>

						<Link href={route("dashboard.personal-info")} className={`block transition hover:text-[var(--hl1-4)] ${currentRouteName === "dashboard.personal-info" ? "text-[var(--hl1-4)]" : ""}`}>
							Personal Info
						</Link>

						{isAdmin && (
							<>
								<Link href={route("dashboard.user-management")} className={`block transition hover:text-[var(--hl1-4)] ${currentRouteName === "dashboard.user-management" ? "text-[var(--hl1-4)]" : ""}`}>
									User Management
								</Link>

								<Link href={route("dashboard.complaint-management")} className={`block transition hover:text-[var(--hl1-4)] ${currentRouteName === "dashboard.complaint-management" ? "text-[var(--hl1-4)]" : ""}`}>
									Complaint Management
								</Link>
							</>
						)}

						<button onClick={logout} className="transition hover:text-[var(--hl1-4)] flex items-center gap-2 cursor-pointer">
							<LogOut className="w-6 h-6" />
							Logout
						</button>
					</nav>
				</div>
			</aside>
		</>
	);
};

export default DashBoardSidebar;
