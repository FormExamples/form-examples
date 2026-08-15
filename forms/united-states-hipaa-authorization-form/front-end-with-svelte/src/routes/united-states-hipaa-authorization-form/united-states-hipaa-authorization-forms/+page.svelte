<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAuthorizationRows } from '#lib/data/sample-reports.js';
	import { primaryPurposeLabel, validityStatusLabel } from '#lib/engine/utils.js';
	import type { PrimaryPurpose, ValidityStatus } from '#lib/engine/types.js';

	const plural = 'united-states-hipaa-authorization-forms';

	let validityFilter = $state('');
	let purposeFilter = $state('');
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAuthorizationRows.filter(
			(r) =>
				(validityFilter === '' || r.validityStatus === validityFilter) &&
				(purposeFilter === '' || r.primaryPurpose === purposeFilter)
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
		const update = () => isDark = computeDark();
		update();
		const obs = new MutationObserver(() => setTimeout(update, 120));
		obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
		return () => obs.disconnect();
	});
	const GridTheme = $derived(isDark ? WillowDark : Willow);

	// SVAR DataGrid columns. Validity status, completeness, and flag counts all
	// render through the shared engine output so the dashboard and report stay
	// aligned.
	const columns = [
		{ id: 'id', header: 'Authorization', width: 150 },
		{
			id: 'patientName',
			header: 'Patient',
			flexgrow: 2,
			sort: true
		},

		{
			id: 'recipientOrganization',
			header: 'Recipient',
			flexgrow: 2,
			sort: true
		},

		{
			id: 'primaryPurpose',
			header: 'Purpose',
			width: 180,
			sort: true,
			template: (v: PrimaryPurpose) => primaryPurposeLabel(v)
		},
		{ id: 'categories', header: 'Categories', flexgrow: 2 },
		{
			id: 'validityStatus',
			header: 'Validity',
			width: 100,
			sort: true,
			template: (v: ValidityStatus) => validityStatusLabel(v)
		},
		{
			id: 'completenessScore',
			header: 'Complete',
			width: 100,
			sort: true,
			template: (v: number) => `${v}%`
		},
		{ id: 'highFlagCount', header: 'High flags', width: 100, sort: true },
		{ id: 'flagCount', header: 'Total flags', width: 100, sort: true }
	];

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open an authorization when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/united-states-hipaa-authorization-form/${plural}/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">HIPAA authorization dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Validity status, completeness, and flag counts for submitted HIPAA authorizations, computed
				by the shared engine. Select a row to open the authorization.
			</p>
		</div>
		<a href="/united-states-hipaa-authorization-form/{plural}/new" class="button" data-variant="primary">New authorization</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Validity</span>
			<select class="select inline-block w-auto" bind:value={validityFilter}>
				<option value="">All</option>
				<option value="valid">Valid</option>
				<option value="invalid">Invalid</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Purpose</span>
			<select class="select inline-block w-auto" bind:value={purposeFilter}>
				<option value="">All</option>
				<option value="eligibility-determination">Eligibility determination</option>
				<option value="continuing-treatment">Continuing treatment</option>
				<option value="insurance-claim">Insurance claim</option>
				<option value="legal-proceeding">Legal proceeding</option>
				<option value="personal-use">Personal use</option>
				<option value="research">Research</option>
				<option value="at-the-request-of-the-individual">At the request of the individual</option>
				<option value="other">Other</option>
			</select>
		</label>
	</div>

	<div
		class="overflow-hidden rounded-xl border border-base-300"
		style="height: 600px;"
	><GridTheme><Grid data={rows} columns={columns} init={init} /></GridTheme></div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} authorizations</p>
</main>
