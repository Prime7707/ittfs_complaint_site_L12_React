import MainLayout from "../../layouts/main-layout";
import { Head, usePage } from "@inertiajs/react";
import { useState } from "react";
import { X } from "lucide-react";

interface Complaint {
	id: number;
	user_id?: number;
	title: string;
	description: string;
	category: string;
	submit_date: string;
	resolved_date: string;
	status: string;
	image?: string;
	admin_response?: string;
}

interface PageProps {
	currentRouteName: string;
	title: string;
	auth: {
		user?: {
			id: number;
			name: string;
			email: string;
			role: string;
		};
	};
	complaints?: Complaint[];
	[key: string]: unknown; // ✅ this line satisfies Inertia's constraint
}
const Complaints = () => {
	const { title, auth, complaints } = usePage<PageProps>().props;
	const [filter, setFilter] = useState<string>("All");
	const [selected, setSelected] = useState<Complaint | null>(null);

	// Safely default to empty array
	// const list = Array.isArray(complaints) ? complaints : [];

	// Build filter options
	const baseFilters = ["All", "Maintenance", "Security", "Cleanliness", "Cafeteria"];
	const filters = auth.user ? [...baseFilters, "My Complaints"] : baseFilters;
	// Apply filtering
	const filtered = complaints?.filter((c) => {
		if (filter === "All") return true;
		if (filter === "My Complaints") {
			return c.user_id === auth.user?.id;
		}
		return c.category.toLowerCase() === filter.toLowerCase();
	});

	return (
		<MainLayout>
			<>
				<Head title={title} />

				<div className="container mx-auto px-4 py-6 mt-15">
					<h1 className="text-2xl font-bold text-[var(--dark-1)] bg-[var(--dark-8)] text-center mb-2 py-3 rounded-full">Complaints</h1>

					{/* Filters */}
					<div className="flex flex-wrap gap-2 my-2 py-4">
						{filters.map((f) => (
							<button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full font-medium transition ${filter === f ? "bg-[var(--hl2-6)] text-[var(--dark-1)]" : "bg-[var(--dark-3)] text-[var(--dark-9)] hover:bg-[var(--hl2-5)]"}`}>
								{f}
							</button>
						))}
					</div>

					{/* Table */}
					<div className="overflow-auto max-h-[60vh] border border-[var(--dark-6)] rounded-lg text-[var(--dark-1)] text-center">
						<table className="min-w-full divide-y divide-[var(--dark-6)]">
							<thead className="bg-[var(--dark-8)] sticky top-0 text-[20px] tracking-wider font-bold text-[var(--dark-1)]">
								<tr>
									<th className="px-4 py-4">Sr. #</th>
									<th className="px-4 py-4">Title</th>
									<th className="px-4 py-4">Category</th>
									<th className="px-4 py-4">Submit Date</th>
									<th className="px-4 py-4">Status</th>
									<th className="px-4 py-4">Resolve Date</th>
								</tr>
							</thead>
							<tbody className="bg-[var(--dark-7)] divide-y divide-[var(--dark-6)]">
								{filtered?.map((c, i) => (
									<tr key={c.id} onClick={() => setSelected(c)} className="cursor-pointer hover:bg-[var(--dark-8)] transition-colors text-[16px] tracking-wider">
										<td className="px-4 py-4">{i + 1}</td>
										<td className="px-4 py-4">{c.title}</td>
										<td className="px-4 py-4">{c.category}</td>
										<td className="px-4 py-4">
											{new Date(c.submit_date).toLocaleString("en-GB", {
												weekday: "long", // e.g., Sunday
												hour: "2-digit", // e.g., 07
												minute: "2-digit", // e.g., 39
												hour12: true, // AM/PM
											})}
											{" , "}
											{new Date(c.submit_date)
												.toLocaleDateString("en-GB", {
													day: "2-digit",
													month: "short", // e.g., May
													year: "numeric",
												})
												.replace(/ /g, "-")}
										</td>
										<td className="px-4 py-4 capitalize">{c.status}</td>
										<td className="px-4 py-4">
											{c.status === "resolved" ? (
												<>
													{new Date(c.resolved_date).toLocaleString("en-GB", {
														weekday: "long",
														hour: "2-digit",
														minute: "2-digit",
														hour12: true,
													})}
													{", "}
													{new Date(c.resolved_date)
														.toLocaleDateString("en-GB", {
															day: "2-digit",
															month: "short",
															year: "numeric",
														})
														.replace(/ /g, "-")}
												</>
											) : (
												"-"
											)}
										</td>
									</tr>
								))}
								{filtered?.length === 0 && (
									<tr key="no-complaints">
										<td colSpan={6} className="px-4 py-4 text-center text-[var(--dark-1)]">
											No complaints found.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* Modal */}
				{selected && (
					<>
						{/* Overlay */}
						<div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 opacity-100" onClick={() => setSelected(null)} />

						{/* Centered modal panel */}
						<div className="fixed inset-0 flex items-center justify-center p-4">
							<div className="bg-white dark:bg-[var(--dark-8)] rounded-2xl shadow-xl max-w-2xl w-full transform transition-all duration-300 scale-100" role="dialog" aria-modal="true">
								{/* Header */}
								<div className="flex items-center px-6 py-4 border-b border-[var(--dark-6)]">
									<h3 className="flex-1 text-xl font-bold text-[var(--dark-1)] text-center">{selected.title}</h3>
									<button onClick={() => setSelected(null)} className="text-[var(--dark-3)] hover:text-[var(--dark-1)] w-[32px] flex items-center justify-center" aria-label="Close">
										<X className="w-6 h-6" strokeWidth={2.5} />
									</button>
								</div>

								{/* Body */}
								<div className="px-6 py-4 text-[var(--dark-1)] text-[18px] max-h-[65vh] overflow-y-auto space-y-6">
									<div>
										<h4 className="font-semibold mb-1 inline">Category :</h4>
										<p className="text-[var(--dark-3)] inline pl-3">{selected.category}</p>
									</div>

									<div>
										<h4 className="font-semibold mb-1 inline">Title :</h4>
										<p className="text-[var(--dark-3)] inline pl-3">{selected.title}</p>
									</div>

									<div>
										<h4 className="font-semibold mb-1">Description:</h4>
										<p className="text-[var(--dark-3)] whitespace-pre-line">{selected.description}</p>
									</div>

									<div>
										<h4 className="font-semibold mb-1">Image:</h4>
										{selected.image ? <img src={`/assets/images/complaints/${selected.image}`} alt="Complaint" className="rounded shadow max-w-full w-[300px] border border-[var(--dark-6)]" /> : <p className="text-[var(--dark-4)] italic">No image available</p>}
									</div>

									<div>
										<h4 className="font-semibold mb-1">Admin Response:</h4>
										<p className="text-[var(--dark-3)] whitespace-pre-line">{selected.admin_response || "No response yet"}</p>
									</div>
								</div>
							</div>
						</div>
					</>
				)}
			</>
		</MainLayout>
	);
};

export default Complaints;
