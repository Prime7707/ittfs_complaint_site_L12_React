import DashboardLoyout from "@/layouts/dashboard-layout";
import { Head, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { X, ChevronsUpDown } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import UserForm from "./user-form";
import api from "@/lib/axios";

type User = {
	id: number;
	name: string;
	email: string;
	role: string;
	status: number;
};
interface PageProps {
	title: string;
	users?: User[];
	[key: string]: unknown; // ✅ this line satisfies Inertia's constraint
}

const UserManagement = () => {
	const { title, users: initialUsers } = usePage<PageProps>().props;
	const [users, setUsers] = useState<User[]>(initialUsers || []);
	const [search, setSearch] = useState("");
	const [searchType, setSearchType] = useState<"name" | "email">("name");
	const [sortKey, setSortKey] = useState<keyof User>("name");
	const [sortAsc, setSortAsc] = useState(true);
	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [editUser, setEditUser] = useState<Partial<User> | null>(null);
	const [deleteUser, setDeleteUser] = useState<User | null>(null);

	const fetchUsers = async () => {
		try {
			const response = await axios.get(route("dashboard.user_management.getUsers"));
			setUsers(response.data);
		} catch (error) {
			console.error("Failed to fetch users:", error);
		}
	};
	useEffect(() => {
		api
			.get(route("dashboard.user_management.getUsers"))
			.then((res) => {
				setUsers(res.data);
			})
			.catch((err) => {
				console.error("Failed to fetch users", err);
			});
	}, []);

	const filtered = [...users]
		.filter((user) => user[searchType]?.toLowerCase().includes(search.toLowerCase()))
		.sort((a, b) => {
			const valA = String(a[sortKey] ?? "").toLowerCase();
			const valB = String(b[sortKey] ?? "").toLowerCase();
			return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
		});

	const confirmDeleteUser = async (user: User) => {
		try {
			await router.delete(route("dashboard.user-management.deleteUser", user.id), {
				preserveScroll: true,
				onSuccess: () => {
					setDeleteUser(null); // close modal
					fetchUsers(); // refresh table
				},
				onError: (errors) => {
					console.error(errors);
					toast.error("Failed to delete user.");
				},
			});
		} catch (err) {
			console.error("Unexpected error:", err);
			toast.error("Something went wrong.");
		}
	};

	const openEditForm = (user: User) => {
		setEditUser(user);
		setShowEditModal(true);
	};

	const handleSort = (key: keyof User) => {
		if (sortKey === key) setSortAsc(!sortAsc);
		else {
			setSortKey(key);
			setSortAsc(true);
		}
	};
	return (
		<DashboardLoyout>
			<Head title={title} />
			<div className="bg-[var(--dark-7)] text-[var(--dark-2)] p-6 mx-3 xsm:mx-10 min-h-[80vh]">
				{/* Header */}
				<div className="flex justify-between items-center bg-[var(--dark-8)] px-4 py-3 rounded-[40px]">
					<h1 className="text-[17px] md:text-2xl font-bold text-[var(--hl1-4)]">User Management</h1>
					<button onClick={() => setShowAddModal(true)} className="btnStyle px-5 py-2 rounded-full text-sm md:text-base">
						Add User
					</button>
				</div>

				{/* Search & Filter */}
				<div className="flex items-center gap-4 my-6">
					<select value={searchType} onChange={(e) => setSearchType(e.target.value as any)} className="bg-[var(--dark-8)] border border-[var(--dark-6)] rounded-md px-4 py-2">
						<option value="name">Search by Name</option>
						<option value="email">Search by Email</option>
					</select>
					<input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="flex-1 bg-[var(--dark-8)] border border-[var(--dark-6)] rounded-md px-4 py-2" />
				</div>

				{/* Table */}
				<div className="overflow-x-auto bg-[var(--dark-8)] rounded-[40px]">
					<table className="min-w-full table-auto text-sm text-left">
						<thead className="sticky top-0">
							<tr className="text-[var(--dark-3)] border-b border-[var(--dark-6)]">
								<th className="px-4 py-2 text-center">Sr #</th>
								<th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("name")}>
									name <ChevronsUpDown className="inline w-[18px] h-[18px]" />
								</th>
								<th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("email")}>
									Email <ChevronsUpDown className="inline w-[18px] h-[18px]" />
								</th>
								<th className="px-4 py-2 cursor-pointer text-center" onClick={() => handleSort("status")}>
									Status <ChevronsUpDown className="inline w-[18px] h-[18px]" />
								</th>
								<th className="px-4 py-2 text-center">Action</th>
							</tr>
						</thead>
						<tbody className="text-white divide-y divide-[var(--dark-6)]">
							{filtered.map((user, i) => (
								<tr key={user.id}>
									<td className="px-4 py-2 text-center">{i + 1}</td>
									<td className="px-4 py-2">{user.name}</td>
									<td className="px-4 py-2">{user.email}</td>
									<td className="px-4 py-2 text-center font-medium">
										<span className={user.status ? "text-green-400" : "text-red-400"}>{user.status ? "Active" : "Disabled"}</span>
									</td>
									<td className="px-4 py-2 text-center space-x-2">
										<button onClick={() => openEditForm(user)} className="btnStyle px-3 py-1 rounded">
											Edit
										</button>
										<button onClick={() => setDeleteUser(user)} className="btnStyleDngr px-3 py-1 rounded">
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Modals for Add/Edit (optional: split into components) */}
				{showAddModal && (
					<div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
						<div className="bg-[var(--dark-9)] w-full max-w-2xl mx-auto rounded-xl shadow-lg p-6 relative">
							<button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-[var(--dark-3)] hover:text-red-400">
								<X className="w-6 h-6" strokeWidth={3} />
							</button>
							<h2 className="text-xl font-bold text-[var(--hl1-4)] mb-6">Add New User</h2>
							{/* Add User Form - You can modularize this */}
							<p className="text-sm text-[var(--dark-3)]">{showAddModal && <UserForm isEdit={false} onClose={() => setShowAddModal(false)} refreshUsers={fetchUsers} />}</p>
						</div>
					</div>
				)}

				{showEditModal && editUser && (
					<div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
						<div className="bg-[var(--dark-9)] w-full max-w-2xl mx-auto rounded-xl shadow-lg p-6 relative">
							<button onClick={() => setShowEditModal(false)} className="absolute top-4 right-4 text-[var(--dark-3)] hover:text-red-400">
								<X className="w-6 h-6" strokeWidth={3} />
							</button>
							<h2 className="text-xl font-bold text-[var(--hl1-4)] mb-6">Edit User: {editUser.name}</h2>
							{/* Edit User Form - Modularize if needed */}
							<p className="text-sm text-[var(--dark-3)]">{editUser && <UserForm user={editUser} onClose={() => setEditUser(null)} isEdit refreshUsers={fetchUsers} />}</p>
						</div>
					</div>
				)}
			</div>
			{deleteUser && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-[var(--dark-8)] text-[var(--dark-2)] p-6 rounded-xl shadow-xl w-[90%] max-w-md">
						<h2 className="text-xl font-bold text-[var(--hl1-4)] mb-4">Confirm Deletion</h2>
						<p className="mb-6">
							Are you sure you want to delete user <span className="font-bold text-red-400">{deleteUser.name}</span>?
						</p>
						<div className="flex justify-end space-x-4">
							<button onClick={() => setDeleteUser(null)} className="px-4 py-2 rounded bg-[var(--dark-6)] hover:bg-[var(--dark-5)]">
								Cancel
							</button>
							{deleteUser && (
								<button onClick={() => confirmDeleteUser(deleteUser)} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-bold">
									Delete
								</button>
							)}
						</div>
					</div>
				</div>
			)}
		</DashboardLoyout>
	);
};

export default UserManagement;
