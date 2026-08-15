<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { OPTIONS, YES_NO } from '$lib/config/options';
	import { evaluationStore } from '$lib/stores/assessment.svelte';

	const d = evaluationStore.data;
</script>

<Fieldset legend="7. Reducibility Assessment">
	<p class="hint">
		This clinician judgement is the primary driver of the urgency band, alongside the step 8
		red-flag screen.
	</p>

	<Field label="Reducibility status" inputId="reducibility-reducibilityStatus" required>
		<Select id="reducibility-reducibilityStatus" label="Reducibility status" bind:value={d.reducibility.reducibilityStatus} required>
			<option value="">— Select —</option>
			{#each OPTIONS.reducibilityStatus as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Reduces spontaneously" inputId="reducibility-reducesSpontaneously">
		<Select id="reducibility-reducesSpontaneously" label="Reduces spontaneously" bind:value={d.reducibility.reducesSpontaneously}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Reduces with manual pressure" inputId="reducibility-reducesWithManualPressure">
		<Select id="reducibility-reducesWithManualPressure" label="Reduces with manual pressure" bind:value={d.reducibility.reducesWithManualPressure}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Does not reduce" inputId="reducibility-doesNotReduce">
		<Select id="reducibility-doesNotReduce" label="Does not reduce" bind:value={d.reducibility.doesNotReduce}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Reducibility notes" inputId="reducibility-reducibilityNotes">
		<TextAreaInput id="reducibility-reducibilityNotes" label="Reducibility notes" rows={3} bind:value={d.reducibility.reducibilityNotes} />
	</Field>
</Fieldset>
