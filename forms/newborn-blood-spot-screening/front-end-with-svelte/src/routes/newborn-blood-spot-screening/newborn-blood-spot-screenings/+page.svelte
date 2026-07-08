<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { outcomeLabel, referralStatusLabel, sexLabel } from '$lib/engine/utils';

	let outcomeFilter = $state('');
	let referralFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(outcomeFilter === '' || r.overallOutcome === outcomeFilter) &&
				(referralFilter === '' || r.referralStatus === referralFilter)
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

	// SVAR DataGrid columns. Overall outcome, referral status, and referral /
	// flag counts render through the shared engine output so the dashboard and
	// report stay aligned.
	const columns = [
		{ id: 'id', header: 'Screening', width: 150 },
		{ id: 'nhsNumber', header: 'NHS number', width: 150, sort: true },
		{ id: 'babyName', header: 'Baby', flexgrow: 2, sort: true },
		{
			id: 'sex',
			header: 'Sex',
			width: 110,
			sort: true,
			template: (v: string) => sexLabel(v as never) || '—'
		},
		{ id: 'recordDate', header: 'Recorded', width: 120, sort: true },
		{
			id: 'ageAtSampleDays',
			header: 'Age (days)',
			width: 110,
			sort: true,
			template: (v: number | null) => (v === null ? '—' : `Day ${v}`)
		},
		{
			id: 'overallOutcome',
			header: 'Outcome',
			width: 210,
			sort: true,
			template: (v: string) => outcomeLabel(v as never)
		},
		{
			id: 'referralStatus',
			header: 'Referral',
			width: 150,
			sort: true,
			template: (v: string) => referralStatusLabel(v as never)
		},
		{ id: 'referralCount', header: 'Referrals', width: 100, sort: true },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'babyName', order: 'asc' });
		// Open a screening when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/newborn-blood-spot-screening/newborn-blood-spot-screenings/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Blood spot clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Screening outcome, referral status, urgent referrals, and safety flags for screened babies,
				computed by the shared engine. Select a row to open the screening.
			</p>
		</div>
		<a href="/newborn-blood-spot-screening/newborn-blood-spot-screenings/new" class="button" data-variant="primary"
			>New screening</a
		>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Outcome</span>
			<select class="select inline-block w-auto" bind:value={outcomeFilter}>
				<option value="">All</option>
				<option value="all-not-suspected">All conditions not suspected</option>
				<option value="referral-required">Referral required</option>
				<option value="repeat-required">Repeat sample required</option>
				<option value="incomplete">Incomplete</option>
				<option value="declined-only-outstanding">Complete — some declined</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Referral status</span>
			<select class="select inline-block w-auto" bind:value={referralFilter}>
				<option value="">All</option>
				<option value="urgent">Urgent referral</option>
				<option value="repeat">Repeat sample</option>
				<option value="routine">Routine — no referral</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} babies</p>
</main>
