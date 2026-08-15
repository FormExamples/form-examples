<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { OPTIONS, YES_NO } from '#lib/config/options.js';
	import { evaluationStore } from '#lib/stores/evaluation.svelte.js';

	const d = evaluationStore.data;
</script>

<Fieldset legend="9. Diagnostic Imaging">
	<p class="hint">
		The Kellgren and Lawrence radiographic grade (0 none to 4 severe) is one of the three inputs to
		the surgical-candidacy recommendation, alongside the Oxford Hip Score and conservative-treatment
		status.
	</p>

	<Field label="Weight-bearing X-ray performed" inputId="imaging-weightBearingXrayPerformed">
		<Select id="imaging-weightBearingXrayPerformed" label="Weight-bearing X-ray performed" bind:value={d.imaging.weightBearingXrayPerformed}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Kellgren and Lawrence grade (0–4)" inputId="imaging-kellgrenLawrenceGrade">
		<NumberInput id="imaging-kellgrenLawrenceGrade" label="Kellgren and Lawrence grade (0–4)" min={0} max={4} bind:value={d.imaging.kellgrenLawrenceGrade} />
	</Field>
	<Field label="Joint-space narrowing" inputId="imaging-jointSpaceNarrowing">
		<Select id="imaging-jointSpaceNarrowing" label="Joint-space narrowing" bind:value={d.imaging.jointSpaceNarrowing}>
			<option value="">— Select —</option>
			{#each OPTIONS.jointSpaceNarrowing as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Subchondral sclerosis or cysts present" inputId="imaging-subchondralSclerosisOrCystsPresent">
		<Select id="imaging-subchondralSclerosisOrCystsPresent" label="Subchondral sclerosis or cysts present" bind:value={d.imaging.subchondralSclerosisOrCystsPresent}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="MRI performed" inputId="imaging-mriPerformed">
		<Select id="imaging-mriPerformed" label="MRI performed" bind:value={d.imaging.mriPerformed}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	{#if d.imaging.mriPerformed === 'yes'}
		<Field label="MRI findings" inputId="imaging-mriFindings">
			<TextAreaInput id="imaging-mriFindings" label="MRI findings" rows={2} bind:value={d.imaging.mriFindings} />
		</Field>
	{/if}
	<Field label="CT performed" inputId="imaging-ctPerformed">
		<Select id="imaging-ctPerformed" label="CT performed" bind:value={d.imaging.ctPerformed}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	{#if d.imaging.ctPerformed === 'yes'}
		<Field label="CT indication" inputId="imaging-ctIndication">
			<Select id="imaging-ctIndication" label="CT indication" bind:value={d.imaging.ctIndication}>
				<option value="">— Select —</option>
				{#each OPTIONS.ctIndication as option (option.value)}
					<option value={option.value}>{option.label}</option>
				{/each}
			</Select>
		</Field>
	{/if}
</Fieldset>
