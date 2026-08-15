<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { OPTIONS } from '#lib/config/options.js';
	import { evaluationStore } from '#lib/stores/evaluation.svelte.js';

	const d = evaluationStore.data;
	const result = $derived(evaluationStore.result);
</script>

<Fieldset legend="7. Slit-lamp Examination">
	<p class="hint">
		LOCS III (Lens Opacities Classification System III) grading, each subscale on a continuous
		0.1-step scale per eye: Nuclear Opalescence (NO) and Nuclear Colour (NC) 0.1–6.9, Cortical (C)
		and Posterior Subcapsular (P) 0.1–5.9. This form's own severity band: severe if any subscore
		&ge; 5.0, moderate if any subscore is 3.0–4.9, mild if all recorded subscores are below 3.0.
	</p>

	<h3 class="text-sm font-semibold text-base-content">LOCS III — right eye</h3>
	<Field label="NO — right" inputId="slitLamp-locsIiiNoRight">
		<NumberInput id="slitLamp-locsIiiNoRight" label="NO — right" min={0.1} max={6.9} step="0.1" bind:value={d.slitLamp.locsIiiNoRight} />
	</Field>
	<Field label="NC — right" inputId="slitLamp-locsIiiNcRight">
		<NumberInput id="slitLamp-locsIiiNcRight" label="NC — right" min={0.1} max={6.9} step="0.1" bind:value={d.slitLamp.locsIiiNcRight} />
	</Field>
	<Field label="C — right" inputId="slitLamp-locsIiiCRight">
		<NumberInput id="slitLamp-locsIiiCRight" label="C — right" min={0.1} max={5.9} step="0.1" bind:value={d.slitLamp.locsIiiCRight} />
	</Field>
	<Field label="P — right" inputId="slitLamp-locsIiiPRight">
		<NumberInput id="slitLamp-locsIiiPRight" label="P — right" min={0.1} max={5.9} step="0.1" bind:value={d.slitLamp.locsIiiPRight} />
	</Field>
	<Field label="LOCS III severity — right" inputId="slitLamp-severityRight" description="Computed live from the four subscores above.">
		<input id="slitLamp-severityRight" class="text-input" type="text" readonly value={result.locsIIISeverityRight || '—'} />
	</Field>

	<h3 class="mt-4 text-sm font-semibold text-base-content">LOCS III — left eye</h3>
	<Field label="NO — left" inputId="slitLamp-locsIiiNoLeft">
		<NumberInput id="slitLamp-locsIiiNoLeft" label="NO — left" min={0.1} max={6.9} step="0.1" bind:value={d.slitLamp.locsIiiNoLeft} />
	</Field>
	<Field label="NC — left" inputId="slitLamp-locsIiiNcLeft">
		<NumberInput id="slitLamp-locsIiiNcLeft" label="NC — left" min={0.1} max={6.9} step="0.1" bind:value={d.slitLamp.locsIiiNcLeft} />
	</Field>
	<Field label="C — left" inputId="slitLamp-locsIiiCLeft">
		<NumberInput id="slitLamp-locsIiiCLeft" label="C — left" min={0.1} max={5.9} step="0.1" bind:value={d.slitLamp.locsIiiCLeft} />
	</Field>
	<Field label="P — left" inputId="slitLamp-locsIiiPLeft">
		<NumberInput id="slitLamp-locsIiiPLeft" label="P — left" min={0.1} max={5.9} step="0.1" bind:value={d.slitLamp.locsIiiPLeft} />
	</Field>
	<Field label="LOCS III severity — left" inputId="slitLamp-severityLeft" description="Computed live from the four subscores above.">
		<input id="slitLamp-severityLeft" class="text-input" type="text" readonly value={result.locsIIISeverityLeft || '—'} />
	</Field>

	<h3 class="mt-4 text-sm font-semibold text-base-content">Other slit-lamp findings</h3>
	<Field label="Cataract type — right" inputId="slitLamp-cataractTypeRight">
		<Select id="slitLamp-cataractTypeRight" label="Cataract type — right" bind:value={d.slitLamp.cataractTypeRight}>
			<option value="">— Select —</option>
			{#each OPTIONS.cataractType as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Cataract type — left" inputId="slitLamp-cataractTypeLeft">
		<Select id="slitLamp-cataractTypeLeft" label="Cataract type — left" bind:value={d.slitLamp.cataractTypeLeft}>
			<option value="">— Select —</option>
			{#each OPTIONS.cataractType as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Anterior chamber depth — right" inputId="slitLamp-anteriorChamberDepthRight">
		<Select id="slitLamp-anteriorChamberDepthRight" label="Anterior chamber depth — right" bind:value={d.slitLamp.anteriorChamberDepthRight}>
			<option value="">— Select —</option>
			{#each OPTIONS.anteriorChamberDepth as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Anterior chamber depth — left" inputId="slitLamp-anteriorChamberDepthLeft">
		<Select id="slitLamp-anteriorChamberDepthLeft" label="Anterior chamber depth — left" bind:value={d.slitLamp.anteriorChamberDepthLeft}>
			<option value="">— Select —</option>
			{#each OPTIONS.anteriorChamberDepth as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Corneal clarity — right" inputId="slitLamp-cornealClarityRight">
		<Select id="slitLamp-cornealClarityRight" label="Corneal clarity — right" bind:value={d.slitLamp.cornealClarityRight}>
			<option value="">— Select —</option>
			{#each OPTIONS.cornealClarity as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Corneal clarity — left" inputId="slitLamp-cornealClarityLeft">
		<Select id="slitLamp-cornealClarityLeft" label="Corneal clarity — left" bind:value={d.slitLamp.cornealClarityLeft}>
			<option value="">— Select —</option>
			{#each OPTIONS.cornealClarity as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Pupil reaction — right" inputId="slitLamp-pupilReactionRight">
		<Select id="slitLamp-pupilReactionRight" label="Pupil reaction — right" bind:value={d.slitLamp.pupilReactionRight}>
			<option value="">— Select —</option>
			{#each OPTIONS.pupilReaction as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Pupil reaction — left" inputId="slitLamp-pupilReactionLeft">
		<Select id="slitLamp-pupilReactionLeft" label="Pupil reaction — left" bind:value={d.slitLamp.pupilReactionLeft}>
			<option value="">— Select —</option>
			{#each OPTIONS.pupilReaction as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
</Fieldset>
