<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { OPTIONS, YES_NO_OPTS } from '#lib/config/options.js';
	import { assessmentStore } from '#lib/stores/assessment.svelte.js';

	const d = assessmentStore.data;
</script>

<Fieldset legend="12. Frailty, Cognition and Falls">
	<p class="hint">Assessed and flagged, but not gated: frailty is rarely reversible in a weeks-long window, so it shapes the plan rather than stopping the clock.</p>

	<Field label="Clinical Frailty Scale" inputId="frailty-clinicalFrailtyScale" description="1 very fit to 9 terminally ill. 7 or above raises a flag; 5 or above indicates a Mini-Cog.">
		<NumberInput id="frailty-clinicalFrailtyScale" label="Clinical Frailty Scale" min={1} max={9} bind:value={d.frailty.clinicalFrailtyScale} />
	</Field>

	<Field label="Weakness" inputId="frailty-friedWeakness" description="Fried Frailty Phenotype criterion.">
		<Select id="frailty-friedWeakness" label="Weakness" bind:value={d.frailty.friedWeakness}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Slowness" inputId="frailty-friedSlowness">
		<Select id="frailty-friedSlowness" label="Slowness" bind:value={d.frailty.friedSlowness}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Low physical activity" inputId="frailty-friedLowPhysicalActivity">
		<Select id="frailty-friedLowPhysicalActivity" label="Low physical activity" bind:value={d.frailty.friedLowPhysicalActivity}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Exhaustion" inputId="frailty-friedExhaustion">
		<Select id="frailty-friedExhaustion" label="Exhaustion" bind:value={d.frailty.friedExhaustion}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Unintentional weight loss" inputId="frailty-friedUnintentionalWeightLoss">
		<Select id="frailty-friedUnintentionalWeightLoss" label="Unintentional weight loss" bind:value={d.frailty.friedUnintentionalWeightLoss}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Risk Analysis Index score" inputId="frailty-riskAnalysisIndexScore">
		<NumberInput id="frailty-riskAnalysisIndexScore" label="Risk Analysis Index score" min={0} max={100} bind:value={d.frailty.riskAnalysisIndexScore} />
	</Field>

	<Field label="Mini-Cog performed" inputId="frailty-miniCogPerformed" description="Indicated when the Clinical Frailty Scale is 5 or above.">
		<Select id="frailty-miniCogPerformed" label="Mini-Cog performed" bind:value={d.frailty.miniCogPerformed}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Mini-Cog score (0-5)" inputId="frailty-miniCogScore">
		<NumberInput id="frailty-miniCogScore" label="Mini-Cog score (0-5)" min={0} max={5} bind:value={d.frailty.miniCogScore} />
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
