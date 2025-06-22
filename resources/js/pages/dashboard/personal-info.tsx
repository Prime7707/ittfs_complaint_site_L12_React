import DashboardLoyout from "@/layouts/dashboard-layout";
import { Head, router, usePage } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PageProps {
	title: string;
	auth: {
		user?: {
			name: string;
		};
	};
	[key: string]: unknown; // ✅ this line satisfies Inertia's constraint
}
const PersonalInfo = () => {
	const { auth } = usePage<PageProps>().props;
	const [showCurrent, setShowCurrent] = useState(false);
	const [showNew, setShowNew] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const { data, setData, post, processing, errors } = useForm({
		name: auth.user?.name,
		current_password: "",
		password: "",
		password_confirmation: "",
	});
	const updateInfo = (e: React.FormEvent) => {
		e.preventDefault();
		router.put(route("dashboard.update.personalInfo"), { name: data.name }); // adjust route
	};

	const updatePassword = (e: React.FormEvent) => {
		e.preventDefault();

		router.put(
			route("dashboard.update.password"),
			{
				current_password: data.current_password,
				password: data.password,
				password_confirmation: data.password_confirmation,
			},
			{
				onFinish: () => {
					setData("current_password", "");
					setData("password", "");
					setData("password_confirmation", "");
				},
			}
		);
	};
	return (
		<DashboardLoyout>
			<Head title="Personal Info" />
			<section className="bg-[var(--dark-7)] text-[var(--dark-2)] flex flex-col items-center justify-center px-4 py-12">
				{/* Edit Personal Info */}
				<div className="max-w-2xl bg-[var(--dark-8)] p-8 rounded-xl shadow-md mb-16 w-full">
					<h2 className="text-2xl font-bold text-[var(--hl1-4)] mb-6">Edit Personal Info</h2>

					<form onSubmit={updateInfo} className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="col-span-2 min-w-[230px]">
							<label htmlFor="name" className="block text-sm font-medium mb-1">
								Name
							</label>
							<input type="text" id="name" value={data.name} onChange={(e) => setData("name", e.target.value)} required className="w-full bg-[var(--dark-9)] text-white border border-[var(--dark-6)] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--hl1-4)] transition" />
						</div>

						<div className="col-span-2 mt-4">
							<button type="submit" disabled={processing} className="btnStyle px-6 py-2 rounded-full transition w-full md:w-auto">
								Update Personal Info
							</button>
						</div>
					</form>
				</div>

				{/* Update Password */}
				<div className="max-w-2xl bg-[var(--dark-8)] p-8 rounded-xl shadow-md mb-16 w-full">
					<h2 className="text-2xl font-bold text-[var(--hl1-4)] mb-6">Update Password</h2>

					<form onSubmit={updatePassword} className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Current Password */}
						<div className="col-span-2">
							<label htmlFor="current_password" className="block text-sm font-medium mb-1">
								Current Password
							</label>
							<div className="relative">
								<input type={showCurrent ? "text" : "password"} id="current_password" value={data.current_password} onChange={(e) => setData("current_password", e.target.value)} required className="w-full pr-10 bg-[var(--dark-9)] text-white border border-[var(--dark-6)] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--hl1-4)] transition" />
								<button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute inset-y-0 right-2 flex items-center text-[var(--dark-4)] hover:text-[var(--hl1-4)]">
									{showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
								</button>
							</div>
						</div>

						{/* New Password */}
						<div className="col-span-2">
							<label htmlFor="password" className="block text-sm font-medium mb-1">
								New Password
							</label>
							<div className="relative">
								<input type={showNew ? "text" : "password"} id="password" value={data.password} onChange={(e) => setData("password", e.target.value)} required className="w-full pr-10 bg-[var(--dark-9)] text-white border border-[var(--dark-6)] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--hl1-4)] transition" />
								<button type="button" onClick={() => setShowNew(!showNew)} className="absolute inset-y-0 right-2 flex items-center text-[var(--dark-4)] hover:text-[var(--hl1-4)]">
									{showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
								</button>
							</div>
						</div>

						{/* Confirm Password */}
						<div className="col-span-2">
							<label htmlFor="password_confirmation" className="block text-sm font-medium mb-1">
								Confirm Password
							</label>
							<div className="relative">
								<input type={showConfirm ? "text" : "password"} id="password_confirmation" value={data.password_confirmation} onChange={(e) => setData("password_confirmation", e.target.value)} required className="w-full pr-10 bg-[var(--dark-9)] text-white border border-[var(--dark-6)] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--hl1-4)] transition" />
								<button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-2 flex items-center text-[var(--dark-4)] hover:text-[var(--hl1-4)]">
									{showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
								</button>
							</div>
						</div>

						<div>
							<button type="submit" disabled={processing} className="btnStyle px-6 py-2 rounded-full transition w-full md:w-auto">
								Update Password
							</button>
						</div>
					</form>
				</div>
			</section>
		</DashboardLoyout>
	);
};

export default PersonalInfo;
