import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { User } from "@/types";
import { X } from "lucide-react";

interface Props {
	user?: Partial<User> | null;
	onClose: () => void;
	isEdit?: boolean;
	refreshUsers: () => void;
}

export default function UserForm({ user, isEdit = false, onClose, refreshUsers }: Props) {
	const { data, setData, post, put, processing, reset } = useForm<{
		name: string;
		email: string;
		password: string;
		password_confirmation: string;
		role: string;
		status: string;
	}>({
		name: user?.name || "",
		email: user?.email || "",
		password: "",
		password_confirmation: "",
		role: String(user?.role || "user"),
		status: String(user?.status ?? "0"),
	});

	useEffect(() => {
		return () => reset();
	}, []);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const url = isEdit ? route("dashboard.user-management.editUser", { id: user?.id }) : route("dashboard.user-management.addUser");

		const method = isEdit ? put : post;
		method(url, {
			preserveScroll: true,
			onSuccess: () => {
				reset();
				onClose();
				refreshUsers(); // ✅ Trigger refetch
			},
		});
	};

	return (
		<div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
			<div className="bg-[var(--dark-9)] w-full max-w-2xl mx-auto rounded-xl shadow-lg p-6 relative">
				<button onClick={onClose} className="absolute top-4 right-4 text-[var(--dark-3)] hover:text-red-400">
					<X className="w-6 h-6" />
				</button>

				<h2 className="text-xl font-bold text-[var(--hl1-4)] mb-6">{isEdit ? `Edit User: ${user?.name}` : "Add New User"}</h2>

				<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{["name", "email"].map((field) => (
						<div key={field} className={["display_name", "phone"].includes(field) ? "md:col-span-2" : ""}>
							<label className="block text-sm mb-1 capitalize">{field.replace("_", " ")}</label>
							<input type="text" name={field} value={data[field as keyof typeof data]} onChange={(e) => setData(field as keyof typeof data, e.target.value)} className="w-full bg-[var(--dark-7)] border border-[var(--dark-6)] rounded-md px-4 py-2 focus:ring-2 focus:ring-[var(--hl1-4)]" />
						</div>
					))}

					{/* Password */}
					<div>
						<label className="block text-sm mb-1">Password</label>
						<input type="password" value={data.password} onChange={(e) => setData("password", e.target.value)} className="w-full bg-[var(--dark-7)] border border-[var(--dark-6)] rounded-md px-4 py-2 focus:ring-2 focus:ring-[var(--hl1-4)]" />
					</div>

					{/* Confirm Password */}
					<div>
						<label className="block text-sm mb-1">Confirm Password</label>
						<input type="password" value={data.password_confirmation} onChange={(e) => setData("password_confirmation", e.target.value)} className="w-full bg-[var(--dark-7)] border border-[var(--dark-6)] rounded-md px-4 py-2 focus:ring-2 focus:ring-[var(--hl1-4)]" />
					</div>

					{/* Role */}
					<div>
						<label className="block text-sm mb-1">Role</label>
						<select value={data.role} onChange={(e) => setData("role", e.target.value)} className="w-full bg-[var(--dark-7)] border border-[var(--dark-6)] rounded-md px-4 py-2">
							<option value="admin">Admin</option>
							<option value="user">User</option>
						</select>
					</div>

					{/* Status */}
					<div>
						<label className="block text-sm mb-1">Status</label>
						<select value={data.status} onChange={(e) => setData("status", e.target.value)} className="w-full bg-[var(--dark-7)] border border-[var(--dark-6)] rounded-md px-4 py-2">
							<option value="1">Active</option>
							<option value="0">Disabled</option>
						</select>
					</div>

					<div className="md:col-span-2 mt-4">
						<button type="submit" disabled={processing} className="w-full btnStyle py-2 rounded-full transition">
							{isEdit ? "Update User" : "Create User"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
