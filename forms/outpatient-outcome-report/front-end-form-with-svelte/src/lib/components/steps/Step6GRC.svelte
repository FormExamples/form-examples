<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import SelectInput from '$lib/components/ui/SelectInput.svelte';

	const d = assessment.data.promGrc;

	const grcOptions = [
		{ value: '-3', label: '-3 — Very much worse' },
		{ value: '-2', label: '-2 — Much worse' },
		{ value: '-1', label: '-1 — Somewhat worse' },
		{ value: '0', label: '0 — About the same' },
		{ value: '1', label: '+1 — Somewhat better' },
		{ value: '2', label: '+2 — Much better' },
		{ value: '3', label: '+3 — Very much better' }
	];

	let grcString = $state(d.globalRatingOfChange !== null ? String(d.globalRatingOfChange) : '');

	$effect(() => {
		if (grcString === '') {
			assessment.data.promGrc.globalRatingOfChange = null;
		} else {
			assessment.data.promGrc.globalRatingOfChange = parseInt(grcString) as -3 | -2 | -1 | 0 | 1 | 2 | 3;
		}
	});
</script>

<SectionCard title="PROM — Global Rating of Change" description="Patient's overall assessment of change since the start of this episode of care">
	<div class="mb-6">
		<label for="grc" class="mb-2 block text-sm font-medium text-gray-700">
			Compared to before this episode of care began, how would you describe your overall health now?
		</label>
		<select
			id="grc"
			name="grc"
			bind:value={grcString}
			class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
		>
			<option value="">-- Select --</option>
			{#each grcOptions as opt}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</select>
	</div>

	<SelectInput
		label="How would you rate your health in general right now?"
		name="selfRatedHealth"
		options={[
			{ value: 'excellent', label: 'Excellent' },
			{ value: 'very_good', label: 'Very Good' },
			{ value: 'good', label: 'Good' },
			{ value: 'fair', label: 'Fair' },
			{ value: 'poor', label: 'Poor' }
		]}
		bind:value={d.selfRatedHealth}
	/>
</SectionCard>
