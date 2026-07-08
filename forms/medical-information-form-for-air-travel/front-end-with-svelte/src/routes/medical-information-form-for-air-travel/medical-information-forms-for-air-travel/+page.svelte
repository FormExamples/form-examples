<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { fitnessBandLabel } from '$lib/engine/utils';
	import type { FitnessBand } from '$lib/engine/types';

	let bandFilter = $state('');
	let airlineFilter = $state('');

	const airlines = $derived(
		Array.from(new Set(sampleAssessmentRows.map((r) => r.airline))).sort()
	);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(bandFilter === '' || r.band === bandFilter) &&
				(airlineFilter === '' || r.airline === airlineFilter)
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

	// SVAR DataGrid columns. The fitness band and flag counts render through the
	// shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'MEDIF', width: 130 },
		{ id: 'passengerName', header: 'Passenger', flexgrow: 2, sort: true },
		{ id: 'airline', header: 'Airline', flexgrow: 2, sort: true },
		{ id: 'flight', header: 'Flight', width: 90, sort: true },
		{ id: 'outboundDate', header: 'Departure', width: 120, sort: true },
		{
			id: 'band',
			header: 'Fitness band',
			width: 150,
			sort: true,
			template: (v: FitnessBand) => fitnessBandLabel(v)
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true },
		{ id: 'highFlagCount', header: 'High', width: 80, sort: true },
		{ id: 'oxygenFlag', header: 'Oxygen', width: 90, template: (v: boolean) => (v ? 'Yes' : 'No') },
		{
			id: 'pregnancyFlag',
			header: 'Pregnant',
			width: 100,
			template: (v: boolean) => (v ? 'Yes' : 'No')
		}
	];

	function init(api: any) {
		api.exec('sort-rows', { key: 'passengerName', order: 'asc' });
		// Open a MEDIF when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/medical-information-form-for-air-travel/medical-information-forms-for-air-travel/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Airline medical-desk dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Fitness-to-fly band and safety-flag counts for submitted MEDIFs, computed by the shared
				engine. Select a row to open the form.
			</p>
		</div>
		<a href="/medical-information-form-for-air-travel/medical-information-forms-for-air-travel/new" class="button" data-variant="primary"
			>New MEDIF</a
		>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Fitness band</span>
			<select class="select inline-block w-auto" bind:value={bandFilter}>
				<option value="">All</option>
				<option value="fit">Fit to fly</option>
				<option value="fit-with-conditions">Fit with conditions</option>
				<option value="requires-review">Requires review</option>
				<option value="unfit-to-fly">Unfit to fly</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Airline</span>
			<select class="select inline-block w-auto" bind:value={airlineFilter}>
				<option value="">All</option>
				{#each airlines as a (a)}
					<option value={a}>{a}</option>
				{/each}
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} MEDIFs</p>
</main>
