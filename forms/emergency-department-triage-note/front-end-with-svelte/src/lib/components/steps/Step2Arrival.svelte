<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const a = assessment.data.arrival;
	const modes = [
		{ value: 'walk-in', label: 'Walk-in' },
		{ value: 'ambulance', label: 'Ambulance' },
		{ value: 'other', label: 'Other' }
	];
</script>

<Fieldset legend="Step 2 of 8 — Arrival">
	<p class="hint">How and when the patient arrived, and who referred them.</p>

	<Field label="Arrival mode">
		<RadioGroup label="Arrival mode">
			{#each modes as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="arrival-arrivalMode"
						value={opt.value}
						bind:group={a.arrivalMode}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Date and time of arrival" inputId="arrival-arrivedAt">
		<TextInput
			id="arrival-arrivedAt"
			label="Date and time of arrival"
			type="datetime-local"
			class="date-input"
			bind:value={a.arrivedAt}
		/>
	</Field>

	<Field label="Referral source" inputId="arrival-referralSource">
		<TextInput
			id="arrival-referralSource"
			label="Referral source"
			placeholder="e.g. Self-presented, NHS 111, GP, 999 / paramedic"
			bind:value={a.referralSource}
		/>
	</Field>
</Fieldset>
