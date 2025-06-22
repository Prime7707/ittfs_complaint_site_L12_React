import MainLayout from "../../layouts/main-layout";
import { Head, usePage, useForm, router } from "@inertiajs/react";
import { useRef } from "react";
import axios from "axios";

interface PageProps {
	csrf_token: string;
	title: string;
	auth: {
		user?: {
			id: number;
			name: string;
			email: string;
			role: string;
		};
	};
	[key: string]: unknown; // this line satisfies Inertia's constraint
}
const Home = () => {
	const { title, auth, csrf_token } = usePage<PageProps>().props;
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const { data, setData, processing, errors } = useForm({
		category: "",
		title: "",
		description: "",
		image: null as File | null,
		anonymous: "0", // default: not anonymous
	});

	axios.defaults.headers.common["X-CSRF-TOKEN"] = csrf_token;
	const submit = (e: React.FormEvent) => {
		e.preventDefault();

		router.post(
			route("complaint.store"),
			{
				category: data.category,
				title: data.title,
				description: data.description,
				image: data.image,
				anonymous: data.anonymous,
			},
			{
				forceFormData: true,
				onSuccess: () => {
					setData({
						category: "",
						title: "",
						description: "",
						image: null,
						anonymous: "0",
					});
					// ✅ Also clear the file input
					if (fileInputRef.current) {
						fileInputRef.current.value = "";
					}
				},
			}
		);
	};

	return (
		<MainLayout>
			<>
				<Head title={title} />

				<div className="container mx-auto px-4 pt-[64px] pb-[30px]">
					{/* Introduction */}
					<div className="text-center mb-6 text-[var(--hl2-6)]">
						<h1 className="text-3xl font-bold text-[var(--hl2-6)]">Welcome to the Public Complaint Portal</h1>
						<p className="mt-4 text-2xl max-w-2xl mx-auto">Raise your voice to improve our community. Submit your concerns and help us make things better.</p>
					</div>

					{/* Complaint Form */}
					<form onSubmit={submit} className="max-w-2xl mx-auto space-y-3 bg-white dark:bg-[var(--dark-8)] p-6 rounded-xl shadow-md" encType="mutipart/formdata">
						{/* Category Dropdown */}
						<div>
							<label htmlFor="category" className="text-[18px] font-bold text-[var(--dark-1)]">
								Category
							</label>
							<select id="category" className="mt-1 block w-full rounded-md border border-gray-300 bg-white dark:bg-[var(--dark-7)] p-2 text-large font-bold text-[var(--dark-1)]" value={data.category} onChange={(e) => setData("category", e.target.value)} required>
								<option value="">Select a category</option>
								<option value="Maintenance">Maintenance</option>
								<option value="Security">Security</option>
								<option value="Cleanliness">Cleanliness</option>
								<option value="Cafeteria">Cafeteria</option>
							</select>
							{errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
						</div>

						{/* Title */}
						<div>
							<label htmlFor="title" className="text-[18px] font-bold text-[var(--dark-1)]">
								Title
							</label>
							<input id="title" placeholder="Complaint title..." className="w-full mt-1 rounded-md border border-gray-300 bg-white dark:bg-[var(--dark-7)] p-2 text-large font-bold text-[var(--dark-1)] tracking-wider" value={data.title} onChange={(e) => setData("title", e.target.value)} required />
							{errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
						</div>

						{/* Description */}
						<div>
							<label htmlFor="description" className="text-[18px] font-bold text-[var(--dark-1)]">
								Description
							</label>
							<textarea id="description" placeholder="Describe your complaint..." className="w-full mt-1 rounded-md border border-gray-300 bg-white dark:bg-[var(--dark-7)] p-2 text-large font-bold text-[var(--dark-1)] tracking-wider" rows={4} value={data.description} onChange={(e) => setData("description", e.target.value)} required />
							{errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
						</div>

						{/* Image Upload */}
						<div className="w-max">
							<label htmlFor="image" className="block mb-1 text-large font-bold text-[var(--dark-1)]">
								Upload Image (optional)
							</label>
							<input id="image" type="file" accept="image/*" onChange={(e) => setData("image", e.target.files?.[0] || null)} className="block w-full text-large font-bold text-[var(--dark-1)] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-[var(--hl2-6)] file:text-large file:font-bold file:text-[var(--dark-1)] hover:file:bg-[var(--hl2-7)] cursor-pointer" ref={fileInputRef} />
							{errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
						</div>

						{/* Anonymous Checkbox - only if logged in */}
						{auth.user && (
							<div className="flex items-center gap-2">
								<input id="anonymous" type="checkbox" className="h-5 w-5 text-[var(--hl2-6)] focus:ring-[var(--hl2-6)] border-gray-900 rounded" checked={data.anonymous === "0"} onChange={(e) => setData("anonymous", e.target.checked ? "0" : "1")} />
								<label htmlFor="anonymous" className="text-[18px] font-bold text-[var(--dark-1)] select-none">
									Submit anonymously
								</label>
							</div>
						)}

						{/* Submit Button */}
						<div className="pt-4">
							<button type="submit" disabled={processing} className={`w-full py-2 px-4 text-lg font-bold rounded-md transition-colors duration-300 text-[var(--dark-1)] ${processing ? "bg-[var(--hl2-4)] cursor-not-allowed opacity-60" : "bg-[var(--hl2-6)] hover:bg-[var(--hl2-7)]"}`}>
								{" "}
								Submit Complaint
							</button>
						</div>
					</form>
				</div>
			</>
		</MainLayout>
	);
};

export default Home;
