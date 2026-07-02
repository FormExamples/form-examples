<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const cap = assessment.data.capacity;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const lacksCapacity = $derived(cap.hasCapacity === 'no');
</script>

<Fieldset legend="Step 7 of 9 — Capacity and involvement">
	<p class="hint">
		Whether the person has capacity for this decision, and who was involved (Mental Capacity Act
		2005).
	</p>

	<Field
		label="Does the person have capacity for this decision?"
		description="Capacity is decision- and time-specific."
		required
	>
		<RadioGroup label="Does the person have capacity for this decision?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="capacity-hasCapacity"
						value={opt.value}
						bind:group={cap.hasCapacity}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if lacksCapacity}
		<p class="hint">
			Because the person is recorded as lacking capacity, document the capacity assessment and the
			legal proxy / consultees involved in the best-interests decision.
		</p>

		<Field label="Capacity assessment" inputId="capacity-capacityAssessment">
			<TextAreaInput
				id="capacity-capacityAssessment"
				label="Capacity assessment"
				rows={3}
				placeholder="How capacity was assessed and the conclusion reached."
				bind:value={cap.capacityAssessment}
			/>
		</Field>

		<Field label="Who was involved" inputId="capacity-involvement">
			<Select id="capacity-involvement" label="Who was involved" bind:value={cap.involvement}>
				<option value="">— Select —</option>
				<option value="person">The person</option>
				<option value="legal-proxy">Legal proxy (welfare attorney / deputy)</option>
				<option value="consultees">Consultees / those close to the person</option>
			</Select>
		</Field>

		<Field label="Legal proxy / consultee details" inputId="capacity-proxyDetails">
			<TextAreaInput
				id="capacity-proxyDetails"
				label="Legal proxy / consultee details"
				rows={3}
				placeholder="Welfare attorney, court-appointed deputy, or consultee details."
				bind:value={cap.proxyDetails}
			/>
		</Field>
	{/if}
</Fieldset>
