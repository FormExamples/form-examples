<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const s = assessment.data.symptoms;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 6 of 7 — Symptoms">
	<p class="hint">
		Red-flag symptoms (e.g. rectal bleeding, change in bowel habit, unexplained weight loss) route
		the participant to the urgent suspected-cancer pathway regardless of the FIT result — a negative
		screen does not exclude cancer.
	</p>

	<Field label="Are red-flag lower-gastrointestinal symptoms reported?">
		<RadioGroup label="Are red-flag lower-gastrointestinal symptoms reported?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="symptoms-redFlagSymptoms"
						value={opt.value}
						bind:group={s.redFlagSymptoms}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
