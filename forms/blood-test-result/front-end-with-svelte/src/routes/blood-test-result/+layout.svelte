<script lang="ts">
	import '../../app.css';
	import { page } from '$app/state';
	let { children } = $props();

	const navClass = (href: string) =>
		page.url.pathname === href
			? 'rounded-md px-3 py-2 text-sm font-semibold text-primary bg-blue-50'
			: 'rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100';
</script>

<svelte:head>
	<title>Blood Test Result</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<nav class="border-b border-gray-200 bg-white shadow-sm no-print">
		<div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
			<a href="/blood-test-result/" class="text-lg font-bold text-gray-900">Blood Test Result</a>
			<div class="flex gap-1">
				<a href="/blood-test-result/" class={navClass('/')}>Welcome</a>
				<a href="/blood-test-result/report" class={navClass('/report')}>New report</a>
				<a href="/blood-test-result/reports" class={navClass('/reports')}>Reports</a>
			</div>
		</div>
	</nav>

	{@render children()}
</div>
