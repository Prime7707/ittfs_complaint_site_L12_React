import React from "react";

export default function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="bg-[var(--dark-9)] px-6 pt-10 pb-7 text-[var(--dark-2)]">
			<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
				{/* Logo & Name */}
				<div>
					<h2 className="text-[var(--hl1-4)] text-2xl font-bold mb-2">Public Complaint Portal</h2>
					<p className="text-sm text-[var(--dark-4)]">Transparent platform to raise and resolve public complaints. Empowering voices, ensuring action.</p>
				</div>

				{/* Navigation Links */}
				<div>
					<h3 className="text-lg font-semibold mb-4 text-[var(--dark-1)]">Quick Links</h3>
					<ul className="space-y-2">
						{["Home", "Complaints"].map((label) => (
							<li key={label}>
								<a href="javascript:void(0)" className="hover:text-[var(--hl1-4)] transition">
									{label}
								</a>
							</li>
						))}
					</ul>
				</div>

				{/* Social Media Icons */}
				<div>
					<h3 className="text-lg font-semibold mb-4 text-[var(--dark-1)]">Follow Us</h3>
					<div className="flex space-x-4">
						{/* Facebook */}
						<a href="javascript:void(0)" aria-label="Facebook" className="text-[var(--dark-3)] hover:text-[var(--hl1-4)] transition">
							<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
								<path d="M22 12.07C22 6.49 17.52 2 12 2S2 6.49 2 12.07c0 5.05 3.66 9.24 8.44 9.93v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.25c-1.23 0-1.61.77-1.61 1.56v1.87h2.74l-.44 2.9h-2.3v7.03C18.34 21.3 22 17.11 22 12.07z" />
							</svg>
						</a>
						{/* Twitter */}
						<a href="javascript:void(0)" aria-label="Twitter" className="text-[var(--dark-3)] hover:text-[var(--hl1-4)] transition">
							<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
								<path d="M22.46 6c-.77.35-1.5.58-2.29.69a4.1 4.1 0 0 0 1.81-2.26 8.18 8.18 0 0 1-2.6.99 4.07 4.07 0 0 0-6.94 3.71A11.53 11.53 0 0 1 3.15 4.6a4.06 4.06 0 0 0 1.26 5.43 4.07 4.07 0 0 1-1.85-.51v.05a4.07 4.07 0 0 0 3.26 3.99 4.1 4.1 0 0 1-1.84.07 4.07 4.07 0 0 0 3.8 2.82A8.19 8.19 0 0 1 2 19.54 11.55 11.55 0 0 0 8.29 21c7.55 0 11.68-6.26 11.68-11.69 0-.18 0-.35-.01-.53A8.26 8.26 0 0 0 22.46 6z" />
							</svg>
						</a>
						{/* Instagram */}
						<a href="javascript:void(0)" aria-label="Instagram" className="text-[var(--dark-3)] hover:text-[var(--hl1-4)] transition">
							<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
								<path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-.5a1 1 0 110 2 1 1 0 010-2z" />
							</svg>
						</a>
					</div>
				</div>
			</div>

			<div className="mt-10 text-center text-[var(--dark-5)] text-sm border-t border-[var(--dark-7)] pt-4">&copy; {year} Public Complaint Portal. All rights reserved.</div>
		</footer>
	);
}
