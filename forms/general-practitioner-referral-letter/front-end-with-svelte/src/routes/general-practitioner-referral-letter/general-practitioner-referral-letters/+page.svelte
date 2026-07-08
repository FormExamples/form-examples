<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { statusLabel, urgencyLabel } from '$lib/engine/utils';

	let statusFilter = $state('');
	let urgencyFilter = $state('');

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(statusFilter === '' || r.status === statusFilter) &&
				(urgencyFilter === '' || r.urgency === urgencyFilter)
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

	// SVAR DataGrid columns. Completeness status and urgency render through the
	// shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Referral', width: 140 },
		{ id: 'patientIdentifier', header: 'Patient ID', width: 130, sort: true },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'updatedDate', header: 'Updated', width: 120, sort: true },
		{
			id: 'urgency',
			header: 'Urgency',
			width: 200,
			sort: true,
			template: (v: string) => urgencyLabel(v as never)
		},
		{
			id: 'status',
			header: 'Status',
			width: 120,
			sort: true,
			template: (v: string) => statusLabel(v as never)
		},
		{
			id: 'completenessPercent',
			header: 'Complete',
			width: 110,
			sort: true,
			template: (v: number) => `${v}%`
		},
		{ id: 'referralSpecialty', header: 'Specialty', width: 150, sort: true },
		{ id: 'referrerName', header: 'Referrer', width: 150, sort: true },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		api.exec('sort-rows', { key: 'urgency', order: 'asc' });
		// Open a referral when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/general-practitioner-referral-letter/general-practitioner-referral-letters/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">General practitioner referral dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Urgency, completeness status, specialty, and flag count for each referral, computed by the
				shared engine. Select a row to open the referral.
			</p>
		</div>
		<a href="/general-practitioner-referral-letter/general-practitioner-referral-letters/new" class="button" data-variant="primary"
			>New referral</a
		>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Urgency</span>
			<select class="select inline-block w-auto" bind:value={urgencyFilter}>
				<option value="">All</option>
				<option value="routine">Routine</option>
				<option value="urgent">Urgent</option>
				<option value="two-week-wait">Two-week-wait (suspected cancer)</option>
				<option value="emergency">Emergency</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Status</span>
			<select class="select inline-block w-auto" bind:value={statusFilter}>
				<option value="">All</option>
				<option value="Complete">Complete</option>
				<option value="Incomplete">Incomplete</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} referrals</p>
</main>
