import { Head } from "@inertiajs/react";

export default function PageTitle({ title }: { title: string }) {
	return (
		<Head>
			<title>{title}</title>
		</Head>
	);
}
