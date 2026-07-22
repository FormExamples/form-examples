<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { purposeOptions } from '$lib/engine/validation-rules';

	let statusFilter = $state('');
	let purposeFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(statusFilter === '' || r.completenessStatus === statusFilter) &&
				(purposeFilter === '' || r.purpose === purposeFilter)
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
		const update = () => (isDark = computeDark());
		update();
		const obs = new MutationObserver(() => setTimeout(update, 120));
		obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
		return () => obs.disconnect();
	});
	const GridTheme = $derived(isDark ? WillowDark : Willow);

	// SVAR DataGrid columns. The completeness status, validation status and flag
	// count render through the shared engine output so the dashboard and report
	// stay aligned.
	const columns = [
		{ id: 'id', header: 'Reference', width: 120 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'nhsNumber', header: 'NHS number', width: 130 },
		{ id: 'recipientOrg', header: 'Recipient', flexgrow: 2, sort: true },
		{ id: 'purpose', header: 'Purpose', width: 150, sort: true },
		{ id: 'submittedDate', header: 'Submitted', width: 120, sort: true },
		{
			id: 'completenessStatus',
			header: 'Completeness',
			width: 150,
			sort: true,
			template: (v: string, row: any) => `${v} (${row.completenessScore}%)`
		},
		{ id: 'validationStatus', header: 'Validation', width: 140, sort: true },
		{
			id: 'consentConfirmed',
			header: 'Consent',
			width: 100,
			template: (v: boolean) => (v ? 'Yes' : 'No')
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open a record when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/medical-records-release-permission/medical-records-release-permissions/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Records release clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Completeness status, validation status and flagged issues for submitted authorisations,
				computed by the shared engine. Select a row to open the form.
			</p>
		</div>
		<a href="/medical-records-release-permission/medical-records-release-permissions/new" class="button" data-variant="primary"
			>New form</a
		>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Completeness</span>
			<select class="select inline-block w-auto" bind:value={statusFilter}>
				<option value="">All</option>
				<option value="Complete">Complete</option>
				<option value="Nearly Complete">Nearly Complete</option>
				<option value="Partially Complete">Partially Complete</option>
				<option value="Incomplete">Incomplete</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Purpose</span>
			<select class="select inline-block w-auto" bind:value={purposeFilter}>
				<option value="">All</option>
				{#each purposeOptions as opt (opt.value)}
					<option value={opt.label}>{opt.label}</option>
				{/each}
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} authorisations</p>
</main>
