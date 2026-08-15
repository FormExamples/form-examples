<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { OPTIONS, YES_NO } from '#lib/config/options.js';
	import { evaluationStore } from '#lib/stores/evaluation.svelte.js';

	const d = evaluationStore.data;
</script>

<Fieldset legend="10. Dilated Fundus Examination">
	<p class="hint">When the cataract is too dense to assess the fundus and the dilated exam was not performed, a medium-priority view-obscured flag fires because competing posterior-segment pathology cannot be excluded.</p>

	<Field label="Dilated fundus exam performed" inputId="fundus-dilatedFundusExamPerformed">
		<Select id="fundus-dilatedFundusExamPerformed" label="Dilated fundus exam performed" bind:value={d.fundus.dilatedFundusExamPerformed}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Cup:disc ratio — right" inputId="fundus-opticDiscCupDiscRatioRight">
		<NumberInput id="fundus-opticDiscCupDiscRatioRight" label="Cup:disc ratio — right" min={0} max={1} step="0.1" bind:value={d.fundus.opticDiscCupDiscRatioRight} />
	</Field>
	<Field label="Cup:disc ratio — left" inputId="fundus-opticDiscCupDiscRatioLeft">
		<NumberInput id="fundus-opticDiscCupDiscRatioLeft" label="Cup:disc ratio — left" min={0} max={1} step="0.1" bind:value={d.fundus.opticDiscCupDiscRatioLeft} />
	</Field>
	<Field label="Macula findings — right" inputId="fundus-maculaFindingsRight">
		<Select id="fundus-maculaFindingsRight" label="Macula findings — right" bind:value={d.fundus.maculaFindingsRight}>
			<option value="">— Select —</option>
			{#each OPTIONS.maculaFindings as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Macula findings — left" inputId="fundus-maculaFindingsLeft">
		<Select id="fundus-maculaFindingsLeft" label="Macula findings — left" bind:value={d.fundus.maculaFindingsLeft}>
			<option value="">— Select —</option>
			{#each OPTIONS.maculaFindings as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Retinal findings — right" inputId="fundus-retinalFindingsRight">
		<TextAreaInput id="fundus-retinalFindingsRight" label="Retinal findings — right" rows={2} bind:value={d.fundus.retinalFindingsRight} />
	</Field>
	<Field label="Retinal findings — left" inputId="fundus-retinalFindingsLeft">
		<TextAreaInput id="fundus-retinalFindingsLeft" label="Retinal findings — left" rows={2} bind:value={d.fundus.retinalFindingsLeft} />
	</Field>
	<Field label="View obscured by cataract — right" inputId="fundus-viewObscuredByCataractRight">
		<Select id="fundus-viewObscuredByCataractRight" label="View obscured by cataract — right" bind:value={d.fundus.viewObscuredByCataractRight}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="View obscured by cataract — left" inputId="fundus-viewObscuredByCataractLeft">
		<Select id="fundus-viewObscuredByCataractLeft" label="View obscured by cataract — left" bind:value={d.fundus.viewObscuredByCataractLeft}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
</Fieldset>
