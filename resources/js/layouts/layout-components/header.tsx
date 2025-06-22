import { LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
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
const Header = () => {
	const { currentRouteName, auth, csrf_token } = usePage<PageProps>().props;

	const [mobileOpen, setMobileOpen] = useState(false);
	const isDashboard = ["dashboard", "dashboard.personal-info", "dashboard.user-management", "dashboard.complaint-management"].includes(currentRouteName);
	const isAdmin = auth?.user?.role == "admin";

	axios.defaults.headers.common["X-CSRF-TOKEN"] = csrf_token;
	const logout = async () => {
		router.post(route("logout"));
	};

	return (
		<header className="bg-[var(--dark-9)] shadow-md fixed top-0 inset-x-0 z-50 h-16">
			<div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Mobile Menu Button */}
					<div className="md:hidden">
						<button onClick={() => setMobileOpen(!mobileOpen)} className={`hover:text-[var(--hl1-7)] hover:ring-2 hover:ring-[var(--hl1-7)] focus:outline-none transition-all ${!mobileOpen ? "text-[var(--dark-1)]" : "text-[var(--hl1-5)] ring-2 ring-[var(--hl1-5)]"}`}>
							<Menu className="w-8 h-8" strokeWidth={3} />
						</button>
					</div>

					{/* Logo */}
					<Link href={route("home")} className="flex items-center space-x-2">
						<img src="/assets/images/logos/sitelogo.png" alt="Logo" className="h-7 w-6 xsm:h-10 xsm:w-8" />
						<span className="text-[18px] xsm:text-[22px] font-bold text-[var(--dark-1)] whitespace-nowrap">Public Complaint Portal</span>
					</Link>

					{/* Navigation */}
					{!isDashboard && (
						<nav className={`hidden md:flex ${auth?.user ? "md:gap-3 lg:gap-[10px] xl:gap-[50px]" : "md:gap-[20px] lg:gap-[30px] xl:gap-[50px]"} mx-4 items-center`}>
							{["home", "complaints"].map((item) => (
								<Link key={item} href={route(item)} className={`headerPageLinks ${currentRouteName == item ? "active" : ""}`}>
									{item.charAt(0).toUpperCase() + item.slice(1)}
								</Link>
							))}
						</nav>
					)}

					{/* Auth Buttons */}
					<div className="relative group h-full flex items-center lg:min-w-[225px] justify-end">
						{auth?.user ? (
							<>
								<nav className="hidden md:flex h-full items-center mr-2">
									{isDashboard ? (
										<Link href={route("home")} className="headerPageLinks">
											Home
										</Link>
									) : (
										<Link href={route("dashboard")} className="headerPageLinks">
											Dashboard
										</Link>
									)}
								</nav>
								<button className="btnStyle headerBtns cursor-pointer" onClick={logout}>
									Logout
								</button>
							</>
						) : (
							<>
								{currentRouteName !== "login" && (
									<Link href={route("login")} className="btnStyle headerBtns">
										Login
									</Link>
								)}
								{currentRouteName !== "register" && (
									<div className="absolute right-0 top-full w-56 bg-[var(--dark-8)] text-sm text-[var(--dark-2)] rounded shadow-lg p-4 pr-0 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity duration-300 flex-col">
										<p className="inline">Don't have an account?</p>
										<Link href={route("register")} className="text-[var(--hl1-4)] hover:underline">
											Sign Up
										</Link>
									</div>
								)}
							</>
						)}
					</div>
				</div>
			</div>

			{/* Mobile Nav */}
			<div className={`md:scale-y-0 ${mobileOpen ? "scale-y-100" : "scale-y-0"} px-4 py-4 bg-[var(--dark-8)] text-[var(--dark-1)] font-bold overflow-hidden transform origin-top transition-all duration-500`}>
				<nav className="flex flex-col space-y-2">
					{auth?.user && (
						<Link href={route("dashboard")} className={`hover:text-[var(--hl1-4)] transition ${currentRouteName == "dashboard" ? "activeMbMenu" : ""}`}>
							Dashboard
						</Link>
					)}
					<Link href={route("home")} className={`hover:text-[var(--hl1-4)] transition ${currentRouteName == "home" ? "activeMbMenu" : ""}`}>
						Home
					</Link>
					{!isDashboard ? (
						<>
							<Link href={route("complaints")} className={`hover:text-[var(--hl1-4)] transition ${currentRouteName == "complaints" ? "activeMbMenu" : ""}`}>
								Complaints
							</Link>
						</>
					) : (
						<>
							<Link href={route("dashboard.personal-info")} className={`hover:text-[var(--hl1-4)] transition ${currentRouteName == "dashboard.personal-info" ? "activeMbMenu" : ""}`}>
								Personal Info
							</Link>
							{isAdmin && (
								<>
									<Link href={route("dashboard.user-management")} className={`hover:text-[var(--hl1-4)] transition ${currentRouteName == "dashboard.user-management" ? "activeMbMenu" : ""}`}>
										User Management
									</Link>
									<Link href={route("dashboard.complaint-management")} className={`hover:text-[var(--hl1-4)] transition ${currentRouteName == "dashboard.complaint-management" ? "activeMbMenu" : ""}`}>
										Complaint Management
									</Link>
								</>
							)}
							<button onClick={logout} className="transition hover:text-[var(--hl1-4)] flex items-center gap-2">
								<LogOut className="w-5 h-5" />
								Logout
							</button>
						</>
					)}
				</nav>
			</div>
		</header>
	);
};

export default Header;
