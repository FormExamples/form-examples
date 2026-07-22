<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleCertificateRows } from '$lib/data/sample-reports';
	import { validityClassLabel } from '$lib/engine/utils';

	let validityFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleCertificateRows.filter(
			(r) => validityFilter === '' || r.validityClass === validityFilter
		)
	);

	// Follow the active Lily theme: pick the dark SVAR skin when the theme's base
	// surface is dark. Recomputed whenever <html data-theme> changes (after the
	// new theme stylesheet has applied its tokens).
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

	// SVAR DataGrid columns. Validity class and the derived underlying cause
	// render through the shared engine output so the dashboard and report stay
	// aligned.
	const columns = [
		{ id: 'id', header: 'Certificate', width: 150 },
		{ id: 'patientIdentifier', header: 'Patient ID', width: 130, sort: true },
		{ id: 'deceasedName', header: 'Deceased', flexgrow: 2, sort: true },
		{ id: 'certifyingDoctorName', header: 'Certifier', flexgrow: 1, sort: true },
		{ id: 'certifiedDate', header: 'Certified', width: 120, sort: true },
		{
			id: 'validityClass',
			header: 'Validity',
			width: 150,
			sort: true,
			template: (v: string) => validityClassLabel(v as never)
		},
		{ id: 'underlyingCause', header: 'Underlying cause', flexgrow: 2, sort: true },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'deceasedName', order: 'asc' });
		// Open a certificate when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/medical-certificate-of-cause-of-death/medical-certificates-of-cause-of-death/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">MCCD clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Validity class, derived underlying cause, and flag counts for certificates, computed by the
				shared engine. Select a row to open the certificate. This dashboard classifies and
				validates — it does not diagnose or replace statutory judgement.
			</p>
		</div>
		<a href="/medical-certificate-of-cause-of-death/medical-certificates-of-cause-of-death/new" class="button" data-variant="primary"
			>New certificate</a
		>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Validity</span>
			<select class="select inline-block w-auto" bind:value={validityFilter}>
				<option value="">All</option>
				<option value="valid">Valid</option>
				<option value="incomplete">Incomplete</option>
				<option value="refer-to-coroner">Refer to coroner</option>
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
