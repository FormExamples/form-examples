<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const r = assessment.data.riskFactors;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 3 of 9 — Risk factors">
	<p class="hint">
		Hip risk factors and any relevant antenatal concerns. A hip risk factor triggers a hip referral
		even when the hip examination is normal.
	</p>

	<Field label="Breech presentation at or after 36 weeks, or at birth?">
		<RadioGroup label="Breech presentation at or after 36 weeks, or at birth?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="riskFactors-breechPresentation"
						value={opt.value}
						bind:group={r.breechPresentation}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="First-degree family history of hip problems?">
		<RadioGroup label="First-degree family history of hip problems?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="riskFactors-familyHistoryHipProblems"
						value={opt.value}
						bind:group={r.familyHistoryHipProblems}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Antenatal concerns" inputId="riskFactors-antenatalConcerns">
		<TextAreaInput
			id="riskFactors-antenatalConcerns"
			label="Antenatal concerns"
			rows={3}
			placeholder="Relevant antenatal findings or concerns."
			bind:value={r.antenatalConcerns}
		/>
	</Field>
</Fieldset>
