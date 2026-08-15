<script lang="ts">
	// Rendered by the wizard page only when
	// context.screeningPurpose === 'occupational-pre-placement' — see
	// AGENTS.md "conditionally rendered" and perioperative-optimization's
	// CPET-conditional pattern.
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { OPTIONS, YES_NO } from '$lib/config/options';
	import { questionnaireStore } from '$lib/stores/questionnaire.svelte';

	const d = questionnaireStore.data;
</script>

<Fieldset legend="10. Occupational / Role-specific Factors">
	<p class="hint">Shown because the screening purpose is occupational pre-placement.</p>

	<Field label="Job role" inputId="occupational-jobRole">
		<TextInput id="occupational-jobRole" label="Job role" bind:value={d.occupational.jobRole} />
	</Field>
	<Field label="Physical demands of role" inputId="occupational-physicalDemandsOfRole">
		<Select id="occupational-physicalDemandsOfRole" label="Physical demands of role" bind:value={d.occupational.physicalDemandsOfRole}>
			<option value="">— Select —</option>
			{#each OPTIONS.physicalDemandsOfRole as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Noise exposure" inputId="occupational-exposureNoise">
		<Select id="occupational-exposureNoise" label="Noise exposure" bind:value={d.occupational.exposureNoise}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Chemical exposure" inputId="occupational-exposureChemicals">
		<Select id="occupational-exposureChemicals" label="Chemical exposure" bind:value={d.occupational.exposureChemicals}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Manual-handling exposure" inputId="occupational-exposureManualHandling">
		<Select id="occupational-exposureManualHandling" label="Manual-handling exposure" bind:value={d.occupational.exposureManualHandling}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Other exposure risk" inputId="occupational-exposureOther">
		<Select id="occupational-exposureOther" label="Other exposure risk" bind:value={d.occupational.exposureOther}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	{#if d.occupational.exposureOther === 'yes'}
		<Field label="Other exposure detail" inputId="occupational-exposureOtherDetail">
			<TextAreaInput id="occupational-exposureOtherDetail" label="Other exposure detail" rows={2} bind:value={d.occupational.exposureOtherDetail} />
		</Field>
	{/if}
</Fieldset>
