<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { OPTIONS, YES_NO } from '$lib/config/options';
	import { evaluationStore } from '$lib/stores/evaluation.svelte';

	const d = evaluationStore.data;
</script>

<Fieldset legend="9. Diagnostic Imaging">
	<p class="hint">
		Weight-bearing X-ray with the Kellgren-Lawrence grade per compartment (Kellgren &amp;
		Lawrence, <em>Ann Rheum Dis</em> 1957), plus MRI and CT where performed.
	</p>

	<Field label="Weight-bearing X-ray performed" inputId="imaging-weightBearingXrayPerformed">
		<Select id="imaging-weightBearingXrayPerformed" label="Weight-bearing X-ray performed" bind:value={d.imaging.weightBearingXrayPerformed}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Kellgren-Lawrence grade — medial (0–4)" inputId="imaging-kellgrenLawrenceGradeMedial">
		<NumberInput id="imaging-kellgrenLawrenceGradeMedial" label="Kellgren-Lawrence grade — medial (0–4)" min={0} max={4} bind:value={d.imaging.kellgrenLawrenceGradeMedial} />
	</Field>
	<Field label="Kellgren-Lawrence grade — lateral (0–4)" inputId="imaging-kellgrenLawrenceGradeLateral">
		<NumberInput id="imaging-kellgrenLawrenceGradeLateral" label="Kellgren-Lawrence grade — lateral (0–4)" min={0} max={4} bind:value={d.imaging.kellgrenLawrenceGradeLateral} />
	</Field>
	<Field label="Kellgren-Lawrence grade — patellofemoral (0–4)" inputId="imaging-kellgrenLawrenceGradePatellofemoral">
		<NumberInput id="imaging-kellgrenLawrenceGradePatellofemoral" label="Kellgren-Lawrence grade — patellofemoral (0–4)" min={0} max={4} bind:value={d.imaging.kellgrenLawrenceGradePatellofemoral} />
	</Field>
	<Field label="MRI performed" inputId="imaging-mriPerformed">
		<Select id="imaging-mriPerformed" label="MRI performed" bind:value={d.imaging.mriPerformed}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="MRI findings" inputId="imaging-mriFindings">
		<TextAreaInput id="imaging-mriFindings" label="MRI findings" rows={2} bind:value={d.imaging.mriFindings} />
	</Field>
	<Field label="CT performed" inputId="imaging-ctPerformed">
		<Select id="imaging-ctPerformed" label="CT performed" bind:value={d.imaging.ctPerformed}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="CT indication" inputId="imaging-ctIndication">
		<Select id="imaging-ctIndication" label="CT indication" bind:value={d.imaging.ctIndication}>
			<option value="">— Select —</option>
			{#each OPTIONS.ctIndication as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
</Fieldset>
