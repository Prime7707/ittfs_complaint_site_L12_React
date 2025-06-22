import DashboardLoyout from "@/layouts/dashboard-layout";
import api from "@/lib/axios";
import { Head, router, usePage, useForm } from "@inertiajs/react";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

interface Complaint {
	id: number;
	user_id?: number;
	sender: string;
	title: string;
	description: string;
	category: string;
	image?: string;
	status: string;
	submit_date: string;
	resolved_date?: string;
	admin_response?: string;
}

interface PageProps {
	csrf_token: string;
	title: string;
	auth: {
		user?: {
			id: string;
			name: string;
			role: string;
		};
	};
	complaints: Complaint[];
	responses: Response[];
	[key: string]: unknown; // ✅ this line satisfies Inertia's constraint
}
const ComplaintManagement = () => {
	const { auth, csrf_token, title } = usePage<PageProps>().props;
	axios.defaults.headers.common["X-CSRF-TOKEN"] = csrf_token;
	const [complaints, setComplaints] = useState<Complaint[]>([]);
	const [filter, setFilter] = useState("All");
	const [search, setSearch] = useState("");
	const [selected, setSelected] = useState<Complaint | null>(null);
	const [respondModal, setRespondModal] = useState(false);
	const [responseText, setResponseText] = useState("");
	const [deleteConfirm, setDeleteConfirm] = useState<Complaint | null>(null);

	const { data, setData, post, processing, reset, errors } = useForm({
		category: "",
		title: "",
		description: "",
		image: null as File | null,
		anonymous: "1",
	});

	const fetchComplaints = () => {
		api
			.get(route("dashboard.user_management.getComplaints"))
			.then((res) => {
				setComplaints(res.data);
			})
			.catch((err) => {
				console.error("Failed to fetch complaints", err);
				toast.error("Failed to load complaints.");
			});
	};

	useEffect(() => {
		fetchComplaints();
	}, []);

	const filtered = complaints.filter((c) => {
		if (filter !== "All" && c.category !== filter) return false;
		return c.title.toLowerCase().includes(search.toLowerCase());
	});

	const handleResponse = () => {
		if (!selected) return;

		router.post(
			route("dashboard.user_management.respondComplaint", selected.id),
			{
				response: responseText,
			},
			{
				preserveScroll: true,
				onSuccess: () => {
					setRespondModal(false);
					fetchComplaints(); // Optional: to refresh data after response
				},
				onError: (errors) => {
					console.error(errors);
					toast.error("Failed to submit response");
				},
			}
		);
	};

	const handleDelete = () => {
		if (!deleteConfirm) return;

		router.delete(route("dashboard.user_management.deleteComplaint", deleteConfirm.id), {
			preserveScroll: true,
			onSuccess: () => {
				setDeleteConfirm(null);
				fetchComplaints(); // ✅ Correct function to re-fetch complaints
			},
			onError: (errors) => {
				toast.error(errors?.message || "Failed to delete complaint.");
			},
		});
	};

	return (
		<DashboardLoyout>
			<Head title={title} />
			<div className="min-h-screen bg-[var(--dark-7)] text-[var(--dark-2)] p-6 space-y-6">
				<div className="flex flex-wrap gap-2 justify-between items-center">
					<h1 className="text-2xl font-bold text-[var(--hl1-4)]">Complaint Management</h1>
					<div className="flex gap-2 items-center">
						<select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-[var(--dark-8)] text-white px-4 py-2 rounded border border-[var(--dark-5)]">
							<option value="All">All</option>
							<option value="Maintenance">Maintenance</option>
							<option value="Security">Security</option>
							<option value="Cleanliness">Cleanliness</option>
							<option value="Cafeteria">Cafeteria</option>
						</select>
						<input type="text" placeholder="Search by title..." value={search} onChange={(e) => setSearch(e.target.value)} className="px-4 py-2 rounded bg-[var(--dark-8)] border border-[var(--dark-5)] text-white" />
					</div>
				</div>

				<div className="overflow-auto rounded-xl shadow-md max-h-[680px]">
					<table className="min-w-full table-auto text-sm text-left">
						<thead className="sticky top-0">
							<tr className="bg-[var(--dark-6)] text-[var(--dark-2)] text-[16px] font-bold tracking-wider">
								<th className="px-4 py-2 text-center">Sr #</th>
								<th className="px-4 py-2 text-center">Sender</th>
								<th className="px-4 py-2">Title</th>
								<th className="px-4 py-2 text-center">Category</th>
								<th className="px-4 py-2 text-center">Submit Date</th>
								<th className="px-4 py-2 text-center">Status</th>
								<th className="px-4 py-2 text-center">Resolved Date</th>
								<th className="px-4 py-2 text-center">Action</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-[var(--dark-6)]">
							{filtered.length === 0 ? (
								<tr className="bg-[var(--dark-8)] text-[16px] font-bold">
									<td colSpan={8} className="text-center px-4 py-6 text-[var(--dark-4)]">
										No complaints found.
									</td>
								</tr>
							) : (
								filtered.map((c, i) => (
									<tr key={c.id} className="bg-[var(--dark-8)] text-[16px] font-bold">
										<td className="px-4 py-2 text-center">{i + 1}</td>
										<td className="px-4 py-2 text-center">{c.sender}</td>
										<td className="px-4 py-2">{c.title}</td>
										<td className="px-4 py-2 text-center">{c.category}</td>
										<td className="px-4 py-2 text-center">
											{new Date(c.submit_date).toLocaleString("en-GB", {
												weekday: "long",
												hour: "2-digit",
												minute: "2-digit",
												hour12: true,
												day: "2-digit",
												month: "short",
												year: "numeric",
											})}
										</td>
										<td className="px-4 py-2 capitalize text-center">{c.status}</td>
										<td className="px-4 py-2 text-center">
											{c.status === "resolved" ? (
												<>
													{c.resolved_date
														? new Date(c.resolved_date).toLocaleString("en-GB", {
																weekday: "long",
																hour: "2-digit",
																minute: "2-digit",
																hour12: true,
																day: "2-digit",
																month: "short",
																year: "numeric",
															})
														: "-"}
												</>
											) : (
												"-"
											)}
										</td>
										<td className="px-4 py-2 space-x-2 text-center">
											<button
												onClick={() => {
													setSelected(c);
													setResponseText(c.admin_response || "");
													setRespondModal(true);
												}}
												className="btnStyle px-3 py-1 rounded-full text-sm">
												Respond
											</button>
											<button onClick={() => setDeleteConfirm(c)} className="btnStyleDngr px-3 py-1 rounded-full text-sm">
												Delete
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				{/* Respond Modal */}
				{respondModal && selected && (
					<div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
						<div className="bg-[var(--dark-8)] p-6 rounded-xl w-full max-w-xl">
							<div className="flex justify-between items-center border-b pb-2 mb-4">
								<h3 className="text-lg font-bold text-[var(--dark-1)]">Respond to: {selected.title}</h3>
								<button onClick={() => setRespondModal(false)} className="text-[var(--dark-4)] hover:text-red-500">
									<X className="w-5 h-5" />
								</button>
							</div>
							<textarea rows={5} value={responseText} onChange={(e) => setResponseText(e.target.value)} className="w-full rounded p-2 bg-[var(--dark-9)] border border-[var(--dark-6)] text-white" placeholder="Write your response..." />
							<div className="mt-4 text-right">
								<button onClick={handleResponse} className="btnStyle px-5 py-2 rounded-full">
									Submit Response
								</button>
							</div>
						</div>
					</div>
				)}

				{/* Delete Modal */}
				{deleteConfirm && (
					<div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
						<div className="bg-[var(--dark-8)] p-6 rounded-xl max-w-md w-full text-center">
							<h3 className="text-lg font-bold text-[var(--dark-1)] mb-4">Delete Complaint</h3>
							<p className="text-[var(--dark-3)] mb-6">Are you sure you want to delete complaint "{deleteConfirm.title}"?</p>
							<div className="flex justify-center gap-4">
								<button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 bg-[var(--hl2-6)] hover:bg-[var(--hl2-7)] text-white rounded font-bold">
									Cancel
								</button>
								<button onClick={handleDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold">
									Delete
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</DashboardLoyout>
	);
};

export default ComplaintManagement;
