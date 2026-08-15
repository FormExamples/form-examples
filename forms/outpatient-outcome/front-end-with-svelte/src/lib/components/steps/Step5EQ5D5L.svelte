<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	// NOTE: EQ-5D-5L item wording is paraphrased. Official wording requires a
	// signed EuroQol licence. See doc/licensing.md.

	const d = assessment.data.promEq5d5l;

	const levelOptions = [
		{ value: '', label: '-- Select --' },
		{ value: '1', label: '1 — No problems' },
		{ value: '2', label: '2 — Slight problems' },
		{ value: '3', label: '3 — Moderate problems' },
		{ value: '4', label: '4 — Severe problems' },
		{ value: '5', label: '5 — Extreme problems / unable to' }
	];

	function parseLevel(v: string): 1 | 2 | 3 | 4 | 5 | null {
		if (v === '') return null;
		const n = parseInt(v);
		if (n >= 1 && n <= 5) return n as 1 | 2 | 3 | 4 | 5;
		return null;
	}
</script>

<Fieldset title="PROM — EQ-5D-5L" description="Patient-reported health status before and after this episode of care. (Paraphrased item wording — see doc/licensing.md)">

	<p class="mb-4 rounded-lg border border-info/40 bg-info/10 px-4 py-3 text-sm text-info">
		For each dimension, rate how things were <strong>before</strong> the start of this episode of care
		and how things are <strong>now</strong>. Use the scale: 1 = No problems, 5 = Extreme problems.
	</p>

	<!-- Mobility -->
	<div class="mb-6 rounded-lg border border-base-200 bg-base-200 p-4">
		<h3 class="mb-1 font-semibold text-base-content">Mobility</h3>
		<p class="mb-3 text-xs text-base-content/60">How would you describe your ability to walk and move around?</p>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<div>
				<label for="beforeMobility" class="mb-1 block text-xs font-medium text-base-content/70">Before (start of episode)</label>
				<select id="beforeMobility" class="w-full rounded-lg border border-base-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					value={d.beforeMobility ?? ''} onchange={(e) => { d.beforeMobility = parseLevel((e.target as HTMLSelectElement).value); }}>
					{#each levelOptions as o}<option value={o.value}>{o.label}</option>{/each}
				</select>
			</div>
			<div>
				<label for="afterMobility" class="mb-1 block text-xs font-medium text-base-content/70">Now (after treatment)</label>
				<select id="afterMobility" class="w-full rounded-lg border border-base-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					value={d.afterMobility ?? ''} onchange={(e) => { d.afterMobility = parseLevel((e.target as HTMLSelectElement).value); }}>
					{#each levelOptions as o}<option value={o.value}>{o.label}</option>{/each}
				</select>
			</div>
		</div>
	</div>

	<!-- Self-Care -->
	<div class="mb-6 rounded-lg border border-base-200 bg-base-200 p-4">
		<h3 class="mb-1 font-semibold text-base-content">Self-Care</h3>
		<p class="mb-3 text-xs text-base-content/60">How would you describe your ability to wash, dress, and care for yourself?</p>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<div>
				<label for="beforeSelfCare" class="mb-1 block text-xs font-medium text-base-content/70">Before</label>
				<select id="beforeSelfCare" class="w-full rounded-lg border border-base-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					value={d.beforeSelfCare ?? ''} onchange={(e) => { d.beforeSelfCare = parseLevel((e.target as HTMLSelectElement).value); }}>
					{#each levelOptions as o}<option value={o.value}>{o.label}</option>{/each}
				</select>
			</div>
			<div>
				<label for="afterSelfCare" class="mb-1 block text-xs font-medium text-base-content/70">Now</label>
				<select id="afterSelfCare" class="w-full rounded-lg border border-base-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					value={d.afterSelfCare ?? ''} onchange={(e) => { d.afterSelfCare = parseLevel((e.target as HTMLSelectElement).value); }}>
					{#each levelOptions as o}<option value={o.value}>{o.label}</option>{/each}
				</select>
			</div>
		</div>
	</div>

	<!-- Usual Activities -->
	<div class="mb-6 rounded-lg border border-base-200 bg-base-200 p-4">
		<h3 class="mb-1 font-semibold text-base-content">Usual Activities</h3>
		<p class="mb-3 text-xs text-base-content/60">How would you describe your ability to carry out your usual activities (e.g. work, study, housework)?</p>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<div>
				<label for="beforeUsualActivities" class="mb-1 block text-xs font-medium text-base-content/70">Before</label>
				<select id="beforeUsualActivities" class="w-full rounded-lg border border-base-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					value={d.beforeUsualActivities ?? ''} onchange={(e) => { d.beforeUsualActivities = parseLevel((e.target as HTMLSelectElement).value); }}>
					{#each levelOptions as o}<option value={o.value}>{o.label}</option>{/each}
				</select>
			</div>
			<div>
				<label for="afterUsualActivities" class="mb-1 block text-xs font-medium text-base-content/70">Now</label>
				<select id="afterUsualActivities" class="w-full rounded-lg border border-base-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					value={d.afterUsualActivities ?? ''} onchange={(e) => { d.afterUsualActivities = parseLevel((e.target as HTMLSelectElement).value); }}>
					{#each levelOptions as o}<option value={o.value}>{o.label}</option>{/each}
				</select>
			</div>
		</div>
	</div>

	<!-- Pain / Discomfort -->
	<div class="mb-6 rounded-lg border border-base-200 bg-base-200 p-4">
		<h3 class="mb-1 font-semibold text-base-content">Pain / Discomfort</h3>
		<p class="mb-3 text-xs text-base-content/60">How would you describe any pain or discomfort you have?</p>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<div>
				<label for="beforePainDiscomfort" class="mb-1 block text-xs font-medium text-base-content/70">Before</label>
				<select id="beforePainDiscomfort" class="w-full rounded-lg border border-base-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					value={d.beforePainDiscomfort ?? ''} onchange={(e) => { d.beforePainDiscomfort = parseLevel((e.target as HTMLSelectElement).value); }}>
					{#each levelOptions as o}<option value={o.value}>{o.label}</option>{/each}
				</select>
			</div>
			<div>
				<label for="afterPainDiscomfort" class="mb-1 block text-xs font-medium text-base-content/70">Now</label>
				<select id="afterPainDiscomfort" class="w-full rounded-lg border border-base-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					value={d.afterPainDiscomfort ?? ''} onchange={(e) => { d.afterPainDiscomfort = parseLevel((e.target as HTMLSelectElement).value); }}>
					{#each levelOptions as o}<option value={o.value}>{o.label}</option>{/each}
				</select>
			</div>
		</div>
	</div>

	<!-- Anxiety / Depression -->
	<div class="mb-6 rounded-lg border border-base-200 bg-base-200 p-4">
		<h3 class="mb-1 font-semibold text-base-content">Anxiety / Depression</h3>
		<p class="mb-3 text-xs text-base-content/60">How would you describe any anxiety or depression you have?</p>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<div>
				<label for="beforeAnxietyDepression" class="mb-1 block text-xs font-medium text-base-content/70">Before</label>
				<select id="beforeAnxietyDepression" class="w-full rounded-lg border border-base-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					value={d.beforeAnxietyDepression ?? ''} onchange={(e) => { d.beforeAnxietyDepression = parseLevel((e.target as HTMLSelectElement).value); }}>
					{#each levelOptions as o}<option value={o.value}>{o.label}</option>{/each}
				</select>
			</div>
			<div>
				<label for="afterAnxietyDepression" class="mb-1 block text-xs font-medium text-base-content/70">Now</label>
				<select id="afterAnxietyDepression" class="w-full rounded-lg border border-base-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					value={d.afterAnxietyDepression ?? ''} onchange={(e) => { d.afterAnxietyDepression = parseLevel((e.target as HTMLSelectElement).value); }}>
					{#each levelOptions as o}<option value={o.value}>{o.label}</option>{/each}
				</select>
			</div>
		</div>
	</div>

	<!-- Visual Analogue Scale -->
	<div class="rounded-lg border border-base-200 bg-base-200 p-4">
		<h3 class="mb-1 font-semibold text-base-content">Overall Health (Visual Analogue Scale)</h3>
		<p class="mb-3 text-xs text-base-content/60">
			On a scale of 0 (worst health imaginable) to 100 (best health imaginable), how would you rate your overall health?
		</p>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<NumberInput label="Before (0–100)" name="beforeVas" bind:value={d.beforeVas} min={0} max={100} />
			<NumberInput label="Now (0–100)" name="afterVas" bind:value={d.afterVas} min={0} max={100} />
		</div>
	</div>
</Fieldset>
