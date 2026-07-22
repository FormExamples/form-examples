<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleCardRows } from '$lib/data/sample-reports';
	import { waitingTimeStatusLabel } from '$lib/engine/utils';
	import type { WaitingTimeStatus } from '$lib/engine/types';

	let priorityFilter = $state('');
	let statusFilter = $state('');
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleCardRows.filter(
			(r) =>
				(priorityFilter === '' || r.clinicalPriority === priorityFilter) &&
				(statusFilter === '' || r.waitingTimeStatus === statusFilter)
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

	// SVAR DataGrid columns. The Waiting Time Status and flag count render
	// through the shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Card', width: 130 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'specialty', header: 'Specialty', width: 170, sort: true },
		{ id: 'clinicalPriority', header: 'Priority', width: 90, sort: true },
		{ id: 'rttClockStartDate', header: 'Clock-start', width: 120, sort: true },
		{
			id: 'weeksWaited',
			header: 'Weeks',
			width: 80,
			sort: true,
			template: (v: number | null) => (v === null ? '—' : String(v))
		},
		{
			id: 'waitingTimeStatus',
			header: 'Waiting Time Status',
			width: 180,
			sort: true,
			template: (v: WaitingTimeStatus) => waitingTimeStatusLabel(v)
		},
		{
			id: 'nextAppointmentDate',
			header: 'Next appt',
			width: 120,
			sort: true,
			template: (v: string | null) => v ?? '—'
		},
		{ id: 'practitionerName', header: 'Practitioner', width: 160, sort: true },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'weeksWaited', order: 'desc' });
		// Open a card when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/clinical-biology-waiting-list-card/clinical-biology-waiting-list-cards/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Waiting list — clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Waiting Time Status and flag counts for active waiting list cards, computed by the shared
				engine. Select a row to open the card.
			</p>
		</div>
		<a href="/clinical-biology-waiting-list-card/clinical-biology-waiting-list-cards/new" class="button" data-variant="primary">New card</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Clinical priority</span>
			<select class="select inline-block w-auto" bind:value={priorityFilter}>
				<option value="">All</option>
				<option value="P1a">P1a — Emergency (24 h)</option>
				<option value="P1b">P1b — Urgent (72 h)</option>
				<option value="P2">P2 — Cancer / time-critical (4 wk)</option>
				<option value="P3">P3 — Substantial harm (12 wk)</option>
				<option value="P4">P4 — Routine (18-wk RTT)</option>
				<option value="P5">P5 — Deferred (6 mo)</option>
				<option value="P6">P6 — Removed from list</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Waiting Time Status</span>
			<select class="select inline-block w-auto" bind:value={statusFilter}>
				<option value="">All</option>
				<option value="within-target">Within target</option>
				<option value="approaching-breach">Approaching breach</option>
				<option value="breached">Breached</option>
				<option value="long-wait">Long wait (&gt; 52 wk)</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} cards</p>
</main>
