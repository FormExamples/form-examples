<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { OPTIONS, YES_NO_OPTS } from '$lib/config/options';
	import { assessmentStore } from '$lib/stores/assessment.svelte';

	const d = assessmentStore.data;
</script>

<Fieldset legend="12. Frailty, Cognition and Falls">
	<p class="hint">Assessed and flagged, but not gated: frailty is rarely reversible in a weeks-long window, so it shapes the plan rather than stopping the clock.</p>

	<Field label="Clinical Frailty Scale" inputId="frailty-clinicalFrailtyScale" description="1 very fit to 9 terminally ill. 7 or above raises a flag.">
		<NumberInput id="frailty-clinicalFrailtyScale" label="Clinical Frailty Scale" min={1} max={9} bind:value={d.frailty.clinicalFrailtyScale} />
	</Field>
	<Field label="Cognitive screen tool" inputId="frailty-cognitiveScreenTool">
		<Select id="frailty-cognitiveScreenTool" label="Cognitive screen tool" bind:value={d.frailty.cognitiveScreenTool}>
			<option value="">— Select —</option>
			{#each OPTIONS.cognitiveTool as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Score" inputId="frailty-cognitiveScreenScore">
		<NumberInput id="frailty-cognitiveScreenScore" label="Score" step="0.1" bind:value={d.frailty.cognitiveScreenScore} />
	</Field>
	<Field label="Cognitive impairment" inputId="frailty-cognitiveImpairment">
		<Select id="frailty-cognitiveImpairment" label="Cognitive impairment" bind:value={d.frailty.cognitiveImpairment}>
			<option value="">— Select —</option>
			{#each OPTIONS.severity4 as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Capacity concern" inputId="frailty-capacityConcern">
		<Select id="frailty-capacityConcern" label="Capacity concern" bind:value={d.frailty.capacityConcern}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Falls in the last 12 months" inputId="frailty-fallsInLast12Months">
		<NumberInput id="frailty-fallsInLast12Months" label="Falls in the last 12 months" min={0} max={100} bind:value={d.frailty.fallsInLast12Months} />
	</Field>
	<Field label="Mobility aid" inputId="frailty-mobilityAid">
		<Select id="frailty-mobilityAid" label="Mobility aid" bind:value={d.frailty.mobilityAid}>
			<option value="">— Select —</option>
			{#each OPTIONS.mobilityAid as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Living situation" inputId="frailty-livingSituation">
		<Select id="frailty-livingSituation" label="Living situation" bind:value={d.frailty.livingSituation}>
			<option value="">— Select —</option>
			{#each OPTIONS.livingSituation as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Care package" inputId="frailty-carePackage">
		<Select id="frailty-carePackage" label="Care package" bind:value={d.frailty.carePackage}>
			<option value="">— Select —</option>
			{#each OPTIONS.carePackage as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Frailty notes" inputId="frailty-frailtyNotes">
		<TextAreaInput id="frailty-frailtyNotes" label="Frailty notes" rows={2} bind:value={d.frailty.frailtyNotes} />
	</Field>
</Fieldset>
