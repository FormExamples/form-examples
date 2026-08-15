<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '#lib/data/sample-reports.js';

	const plural = 'united-kingdom-maternity-certificates-mat-b1';

	let statusFilter = $state('');
	let partFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(statusFilter === '' || r.status === statusFilter) &&
				(partFilter === '' || r.certificateType === partFilter)
		)
	);

	// Follow the active Lily theme: pick the dark SVAR skin when the theme's
	// base surface is dark. Recomputed whenever <html data-theme> changes (after
	// the new theme stylesheet has applied its tokens).
	let isDark = $state(false);
	function computeDark(): boolean {
		if (!browser) return false;
		const v = getComputedStyle(document.documentElement)
			.getPropertyValue('--color-base-100')
			.trim();
		const m = v.match(/oklch\(\s*([0-9.]+%?)/);
		if (!m) return false;
		const l = m[1].endsWith('%') ? parseFloat(m[1]) / 100 : parseFloat(m[1]);
		return l < 0.5;
	}
	$effect(() => {
		if (!browser) return;
		const update = () => isDark = computeDark();
		update();
		const obs = new MutationObserver(() => setTimeout(update, 120));
		obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
		return () => obs.disconnect();
	});
	const GridTheme = $derived(isDark ? WillowDark : Willow);

	// SVAR DataGrid columns. The validation status, certificate part, and issuer
	// branch render through the shared engine output so the dashboard and report
	// stay aligned.
	const columns = [
		{ id: 'id', header: 'Certificate', width: 130 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'issueDate', header: 'Issued', width: 120, sort: true },
		{
			id: 'certificateType',
			header: 'Part',
			width: 110,
			sort: true,
			template: (v: string) => v === 'pre' ? 'Part A' : v === 'post' ? 'Part B' : '—'
		},
		{
			id: 'issuerType',
			header: 'Issuer',
			width: 110,
			sort: true,
			template: (v: string) => v === 'doctor' ? 'Doctor' : v === 'midwife' ? 'Midwife' : '—'
		},
		{
			id: 'status',
			header: 'Status',
			width: 120,
			sort: true,
			template: (v: string) => v === 'complete' ? 'Complete' : 'Incomplete'
		},
		{
			id: 'weeksBeforeEwc',
			header: 'Weeks to EWC',
			width: 130,
			sort: true,
			template: (v: number | null) => v == null ? '—' : String(v)
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open a certificate when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/united-kingdom-maternity-certificate-mat-b1/${plural}/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">MAT B1 issuer dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Validation status, certificate part, and issuer branch for issued certificates, computed
				by the shared engine. Select a row to open the certificate.
			</p>
		</div>
		<a href="/united-kingdom-maternity-certificate-mat-b1/{plural}/new" class="button" data-variant="primary">New certificate</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Status</span>
			<select class="select inline-block w-auto" bind:value={statusFilter}>
				<option value="">All</option>
				<option value="complete">Complete</option>
				<option value="incomplete">Incomplete</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Certificate part</span>
			<select class="select inline-block w-auto" bind:value={partFilter}>
				<option value="">All</option>
				<option value="pre">Part A — pre-confinement</option>
				<option value="post">Part B — post-confinement</option>
			</select>
		</label>
	</div>

	<div
		class="overflow-hidden rounded-xl border border-base-300"
		style="height: 600px;"
	><GridTheme><Grid data={rows} columns={columns} init={init} /></GridTheme></div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} certificates</p>
</main>
