<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const e = assessment.data.eligibility;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 3 of 7 — Symptom and consent check">
	<p class="hint">
		A woman with a breast symptom is not a screening candidate and must be referred via the
		symptomatic pathway.
	</p>

	<Field label="Is a breast symptom reported?" required>
		<RadioGroup id="eligibility-symptomatic" label="Is a breast symptom reported?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="eligibility-symptomatic"
						value={opt.value}
						bind:group={e.symptomatic}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Consent to image given?" required inputId="eligibility-consentGiven">
		<Select id="eligibility-consentGiven" label="Consent to image given?" required bind:value={e.consentGiven}>
			<option value="">— Select —</option>
			<option value="yes">Yes — consent given</option>
			<option value="no">No</option>
			<option value="declined">Declined</option>
		</Select>
	</Field>
</Fieldset>
