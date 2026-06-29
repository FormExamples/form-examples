<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleCertificateRows } from '$lib/data/sample-reports';
	import { diseaseLabel, validityStatusLabel } from '$lib/engine/utils';

	const plural = 'international-certificates-of-vaccination-or-prophylaxis';

	let diseaseFilter = $state('');
	let validityFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleCertificateRows.filter(
			(r) =>
				(diseaseFilter === '' || r.primaryDisease === diseaseFilter) &&
				(validityFilter === '' || r.validityStatus === validityFilter)
		)
	);

	// Follow the active Lily theme: pick the dark SVAR skin when the theme's base
	// surface is dark. Recomputed whenever <html data-theme> changes.
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
		const update = () => (isDark = computeDark());
		update();
		const obs = new MutationObserver(() => setTimeout(update, 120));
		obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
		return () => obs.disconnect();
	});
	const GridTheme = $derived(isDark ? WillowDark : Willow);

	// SVAR DataGrid columns. The validity status and error / warning counts render
	// through the shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Certificate', width: 140 },
		{ id: 'vaccineeName', header: 'Vaccinee', flexgrow: 2, sort: true },
		{ id: 'centre', header: 'Centre', flexgrow: 2, sort: true },
		{ id: 'issuingCountry', header: 'Country', width: 90, sort: true },
		{
			id: 'primaryDisease',
			header: 'Disease',
			width: 130,
			sort: true,
			template: (v: string) => diseaseLabel(v)
		},
		{ id: 'entriesCount', header: 'Entries', width: 80, sort: true },
		{ id: 'vaccinationDate', header: 'Vaccinated', width: 120, sort: true },
		{
			id: 'validityStatus',
			header: 'Validity',
			width: 100,
			sort: true,
			template: (v: string) => validityStatusLabel(v as never)
		},
		{ id: 'errorCount', header: 'Errors', width: 80, sort: true },
		{ id: 'warningCount', header: 'Warnings', width: 90, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'vaccineeName', order: 'asc' });
		// Open a certificate when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/${plural}/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Certificate registry</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Issued certificates with their primary disease, vaccination date, computed validity, and
				error / warning counts from the shared engine. Select a row to open the certificate.
			</p>
		</div>
		<a href="/{plural}/new" class="button" data-variant="primary">New certificate</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Disease</span>
			<select class="select inline-block w-auto" bind:value={diseaseFilter}>
				<option value="">All</option>
				<option value="yellow-fever">Yellow fever</option>
				<option value="polio">Polio</option>
				<option value="smallpox">Smallpox</option>
				<option value="cholera">Cholera</option>
				<option value="meningococcal">Meningococcal</option>
				<option value="covid-19">COVID-19</option>
				<option value="other">Other</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Validity</span>
			<select class="select inline-block w-auto" bind:value={validityFilter}>
				<option value="">All</option>
				<option value="valid">Valid</option>
				<option value="invalid">Invalid</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} certificates</p>
</main>
