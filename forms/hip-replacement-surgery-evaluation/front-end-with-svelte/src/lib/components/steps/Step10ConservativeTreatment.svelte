<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { OPTIONS, YES_NO } from '$lib/config/options';
	import { evaluationStore } from '$lib/stores/evaluation.svelte';

	const d = evaluationStore.data;
</script>

<Fieldset legend="10. Conservative Treatment Audit">
	<p class="hint">
		Whether physiotherapy, weight-management advice, and an analgesic or steroid-injection trial
		have been tried. Conservative measures not exhausted overrides every other candidacy factor and
		raises a safety flag.
	</p>

	<Field label="Physiotherapy tried" inputId="conservative-physiotherapyTried">
		<Select id="conservative-physiotherapyTried" label="Physiotherapy tried" bind:value={d.conservative.physiotherapyTried}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	{#if d.conservative.physiotherapyTried === 'yes'}
		<Field label="Physiotherapy duration (weeks)" inputId="conservative-physiotherapyDurationWeeks">
			<NumberInput id="conservative-physiotherapyDurationWeeks" label="Physiotherapy duration (weeks)" min={0} max={260} bind:value={d.conservative.physiotherapyDurationWeeks} />
		</Field>
	{/if}
	<Field label="Weight-management advice given" inputId="conservative-weightManagementAdviceGiven">
		<Select id="conservative-weightManagementAdviceGiven" label="Weight-management advice given" bind:value={d.conservative.weightManagementAdviceGiven}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Steroid injection given" inputId="conservative-steroidInjectionGiven">
		<Select id="conservative-steroidInjectionGiven" label="Steroid injection given" bind:value={d.conservative.steroidInjectionGiven}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	{#if d.conservative.steroidInjectionGiven === 'yes'}
		<Field label="Steroid injection count" inputId="conservative-steroidInjectionCount">
			<NumberInput id="conservative-steroidInjectionCount" label="Steroid injection count" min={0} max={20} bind:value={d.conservative.steroidInjectionCount} />
		</Field>
		<Field label="Steroid injection response" inputId="conservative-steroidInjectionResponse">
			<Select id="conservative-steroidInjectionResponse" label="Steroid injection response" bind:value={d.conservative.steroidInjectionResponse}>
				<option value="">— Select —</option>
				{#each OPTIONS.treatmentResponse as option (option.value)}
					<option value={option.value}>{option.label}</option>
				{/each}
			</Select>
		</Field>
	{/if}
	<Field label="Analgesic trial given" inputId="conservative-analgesicTrialGiven">
		<Select id="conservative-analgesicTrialGiven" label="Analgesic trial given" bind:value={d.conservative.analgesicTrialGiven}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	{#if d.conservative.analgesicTrialGiven === 'yes'}
		<Field label="Analgesic trial response" inputId="conservative-analgesicTrialResponse">
			<Select id="conservative-analgesicTrialResponse" label="Analgesic trial response" bind:value={d.conservative.analgesicTrialResponse}>
				<option value="">— Select —</option>
				{#each OPTIONS.treatmentResponse as option (option.value)}
					<option value={option.value}>{option.label}</option>
				{/each}
			</Select>
		</Field>
	{/if}
	<Field label="Walking-aid trial" inputId="conservative-walkingAidTrial">
		<Select id="conservative-walkingAidTrial" label="Walking-aid trial" bind:value={d.conservative.walkingAidTrial}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Conservative measures exhausted" inputId="conservative-conservativeMeasuresExhausted" required
		description="The primary gate on surgical candidacy: 'no' routes the recommendation to continue-conservative regardless of the Oxford Hip Score or imaging grade.">
		<Select id="conservative-conservativeMeasuresExhausted" label="Conservative measures exhausted" bind:value={d.conservative.conservativeMeasuresExhausted} required>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
</Fieldset>
