<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '#lib/data/sample-reports.js';

	let outcomeFilter = $state('');

	const rows = $derived(
		sampleAssessmentRows.filter((r) => outcomeFilter === '' || r.outcome === outcomeFilter)
	);

	let isDark = $state(false);
	function computeDark(): boolean {
		if (!browser) return false;
		const v = getComputedStyle(document.documentElement).getPropertyValue('--color-base-100').trim();
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

	const columns = [
		{ id: 'id', header: 'Assessment', width: 120 },
		{ id: 'supplier', header: 'Supplier', flexgrow: 2, sort: true },
		{ id: 'product', header: 'Product', flexgrow: 2, sort: true },
		{ id: 'assessedDate', header: 'Assessed', width: 120, sort: true },
		{ id: 'outcomeLabel', header: 'Outcome', width: 200, sort: true },
		{ id: 'mandatoryMet', header: 'Mandatory met', width: 140 },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		api.exec('sort-rows', { key: 'supplier', order: 'asc' });
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/uk-nhs-digital-technology-assessment-criteria/assessments/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">DTAC assessments dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Outcome, mandatory criteria met and flagged issues per assessed product, computed by the
				shared engine. Select a row to open the assessment.
			</p>
		</div>
		<a href="/uk-nhs-digital-technology-assessment-criteria/assessments/new" class="button" data-variant="primary">New assessment</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Outcome</span>
			<select class="select inline-block w-auto" bind:value={outcomeFilter}>
				<option value="">All</option>
				<option value="meets">Meets</option>
				<option value="conditional">Meets with conditions</option>
				<option value="does-not-meet">Does not meet</option>
				<option value="incomplete">Incomplete</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme><Grid data={rows} {columns} {init} /></GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} assessments</p>
</main>
