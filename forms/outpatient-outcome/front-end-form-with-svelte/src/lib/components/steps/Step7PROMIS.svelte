<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { promisGphTScore, promisMhTScore } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';

	// NOTE: PROMIS Global Health v1.2 items are paraphrased. Official wording
	// and IRT-based scoring are available from healthmeasures.net.
	// T-scores here use a documented linear approximation — see doc/licensing.md.

	const d = assessment.data.promPromis;

	const levelOptions = [
		{ value: '', label: '-- Select --' },
		{ value: '1', label: '1 — Poor' },
		{ value: '2', label: '2 — Fair' },
		{ value: '3', label: '3 — Good' },
		{ value: '4', label: '4 — Very Good' },
		{ value: '5', label: '5 — Excellent' }
	];

	const frequencyOptions = [
		{ value: '', label: '-- Select --' },
		{ value: '1', label: '1 — Never' },
		{ value: '2', label: '2 — Rarely' },
		{ value: '3', label: '3 — Sometimes' },
		{ value: '4', label: '4 — Often' },
		{ value: '5', label: '5 — Always' }
	];

	function parseNum(v: string): number | null {
		return v === '' ? null : parseInt(v);
	}

	const gph = $derived(promisGphTScore(d));
	const gmh = $derived(promisMhTScore(d));

	$effect(() => {
		assessment.data.promPromis.globalPhysicalHealthTScore = promisGphTScore(d);
		assessment.data.promPromis.globalMentalHealthTScore = promisMhTScore(d);
	});
</script>

<Fieldset title="PROM — PROMIS Global Health" description="PROMIS Global Health v1.2 (paraphrased). See doc/licensing.md for attribution and scoring notes.">

	<p class="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
		Please answer the following questions about your health <strong>over the past 7 days</strong>.
	</p>

	<h3 class="mb-3 font-semibold text-gray-800">General Health Ratings</h3>

	<div class="mb-4">
		<label for="item1" class="mb-1 block text-sm font-medium text-gray-700">In general, how would you rate your health?</label>
		<select id="item1" value={d.item1GeneralHealth ?? ''} onchange={(e) => { d.item1GeneralHealth = parseNum((e.target as HTMLSelectElement).value); }}
			class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none">
			{#each levelOptions as o}<option value={o.value}>{o.label}</option>{/each}
		</select>
	</div>

	<div class="mb-4">
		<label for="item2" class="mb-1 block text-sm font-medium text-gray-700">In general, how would you rate your quality of life?</label>
		<select id="item2" value={d.item2QualityOfLife ?? ''} onchange={(e) => { d.item2QualityOfLife = parseNum((e.target as HTMLSelectElement).value); }}
			class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none">
			{#each levelOptions as o}<option value={o.value}>{o.label}</option>{/each}
		</select>
	</div>

	<div class="mb-4">
		<label for="item3" class="mb-1 block text-sm font-medium text-gray-700">In general, how would you rate your physical health?</label>
		<select id="item3" value={d.item3PhysicalHealth ?? ''} onchange={(e) => { d.item3PhysicalHealth = parseNum((e.target as HTMLSelectElement).value); }}
			class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none">
			{#each levelOptions as o}<option value={o.value}>{o.label}</option>{/each}
		</select>
	</div>

	<div class="mb-4">
		<label for="item4" class="mb-1 block text-sm font-medium text-gray-700">In general, how would you rate your mental health, including your mood and ability to think?</label>
		<select id="item4" value={d.item4MentalHealth ?? ''} onchange={(e) => { d.item4MentalHealth = parseNum((e.target as HTMLSelectElement).value); }}
			class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none">
			{#each levelOptions as o}<option value={o.value}>{o.label}</option>{/each}
		</select>
	</div>

	<div class="mb-4">
		<label for="item5" class="mb-1 block text-sm font-medium text-gray-700">In general, how would you rate your satisfaction with your social activities and relationships?</label>
		<select id="item5" value={d.item5Satisfaction ?? ''} onchange={(e) => { d.item5Satisfaction = parseNum((e.target as HTMLSelectElement).value); }}
			class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none">
			{#each levelOptions as o}<option value={o.value}>{o.label}</option>{/each}
		</select>
	</div>

	<h3 class="mb-3 mt-6 font-semibold text-gray-800">Frequency Questions (past 7 days)</h3>

	<div class="mb-4">
		<label for="item6" class="mb-1 block text-sm font-medium text-gray-700">In general, how often did you feel tired?</label>
		<select id="item6" value={d.item6FatigueFrequency ?? ''} onchange={(e) => { d.item6FatigueFrequency = parseNum((e.target as HTMLSelectElement).value); }}
			class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none">
			{#each frequencyOptions as o}<option value={o.value}>{o.label}</option>{/each}
		</select>
	</div>

	<div class="mb-4">
		<label for="item7" class="mb-1 block text-sm font-medium text-gray-700">In general, how often did you have emotional problems such as feeling anxious or depressed?</label>
		<select id="item7" value={d.item7EmotionalProblems ?? ''} onchange={(e) => { d.item7EmotionalProblems = parseNum((e.target as HTMLSelectElement).value); }}
			class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none">
			{#each frequencyOptions as o}<option value={o.value}>{o.label}</option>{/each}
		</select>
	</div>

	<div class="mb-4">
		<label for="item8" class="mb-1 block text-sm font-medium text-gray-700">How often were you able to carry out your social activities and roles?</label>
		<select id="item8" value={d.item8SocialActivities ?? ''} onchange={(e) => { d.item8SocialActivities = parseNum((e.target as HTMLSelectElement).value); }}
			class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none">
			{#each frequencyOptions as o}<option value={o.value}>{o.label}</option>{/each}
		</select>
	</div>

	<div class="mb-4">
		<label for="item9" class="mb-1 block text-sm font-medium text-gray-700">
			How would you rate your pain on average?
			<span class="text-xs text-gray-400 ml-1">(0 = No pain, 10 = Worst pain imaginable)</span>
		</label>
		<input
			id="item9"
			type="number"
			min="0"
			max="10"
			value={d.item9Pain ?? ''}
			oninput={(e) => {
				const v = (e.target as HTMLInputElement).value;
				assessment.data.promPromis.item9Pain = v === '' ? null : Math.min(10, Math.max(0, parseInt(v)));
			}}
			class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
		/>
	</div>

	<div class="mb-4">
		<label for="item10" class="mb-1 block text-sm font-medium text-gray-700">How often were you able to carry out your everyday physical activities such as walking, climbing stairs, carrying groceries?</label>
		<select id="item10" value={d.item10EverydayActivities ?? ''} onchange={(e) => { d.item10EverydayActivities = parseNum((e.target as HTMLSelectElement).value); }}
			class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none">
			{#each frequencyOptions as o}<option value={o.value}>{o.label}</option>{/each}
		</select>
	</div>

	{#if gph !== null || gmh !== null}
		<div class="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
			<h3 class="mb-2 text-sm font-semibold text-gray-700">Calculated T-scores (linear approximation)</h3>
			<div class="grid grid-cols-2 gap-4 text-sm">
				<div>
					<span class="text-gray-500">Global Physical Health:</span>
					<span class="ml-2 font-medium">{gph !== null ? gph.toFixed(1) : '—'}</span>
				</div>
				<div>
					<span class="text-gray-500">Global Mental Health:</span>
					<span class="ml-2 font-medium">{gmh !== null ? gmh.toFixed(1) : '—'}</span>
				</div>
			</div>
			<p class="mt-2 text-xs text-gray-400">Population norm = 50. Note: these are approximate values only.</p>
		</div>
	{/if}
</Fieldset>
