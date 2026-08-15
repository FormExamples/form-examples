<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const e = assessment.data.eligibility;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 3 of 8 — Eligibility">
	<p class="hint">
		QRISK3 is a primary-prevention tool. It is not valid for patients who already have established
		cardiovascular disease or familial hypercholesterolaemia.
	</p>

	<Field label="Established cardiovascular disease (angina, MI, stroke, TIA, or PAD)?">
		<RadioGroup label="Established cardiovascular disease?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="eligibility-hasEstablishedCvd"
						value={opt.value}
						bind:group={e.hasEstablishedCvd}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Familial hypercholesterolaemia?">
		<RadioGroup label="Familial hypercholesterolaemia?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="eligibility-hasFamilialHypercholesterolaemia"
						value={opt.value}
						bind:group={e.hasFamilialHypercholesterolaemia}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
