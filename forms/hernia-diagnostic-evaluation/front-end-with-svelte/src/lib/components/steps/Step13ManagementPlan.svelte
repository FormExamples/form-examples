<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { OPTIONS, YES_NO } from '#lib/config/options.js';
	import { evaluationStore } from '#lib/stores/assessment.svelte.js';

	const d = evaluationStore.data;
</script>

<Fieldset legend="13. Management Plan">
	<p class="hint">The plan the clinician recommends, independent of the computed urgency band.</p>

	<Field label="Management plan" inputId="management-managementPlan">
		<Select id="management-managementPlan" label="Management plan" bind:value={d.management.managementPlan}>
			<option value="">— Select —</option>
			{#each OPTIONS.managementPlan as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	{#if d.management.managementPlan === 'conservative'}
		<Field label="Conservative management detail" inputId="management-conservativeDetail">
			<TextAreaInput id="management-conservativeDetail" label="Conservative management detail" rows={2} bind:value={d.management.conservativeDetail} />
		</Field>
	{/if}
	<Field label="Referral made" inputId="management-referralMade">
		<Select id="management-referralMade" label="Referral made" bind:value={d.management.referralMade}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	{#if d.management.referralMade === 'yes'}
		<Field label="Referral target timeframe" inputId="management-referralTargetTimeframe">
			<Select id="management-referralTargetTimeframe" label="Referral target timeframe" bind:value={d.management.referralTargetTimeframe}>
				<option value="">— Select —</option>
				{#each OPTIONS.referralTargetTimeframe as option (option.value)}
					<option value={option.value}>{option.label}</option>
				{/each}
			</Select>
		</Field>
	{/if}
	<Field label="Management notes" inputId="management-managementNotes">
		<TextAreaInput id="management-managementNotes" label="Management notes" rows={3} bind:value={d.management.managementNotes} />
	</Field>
</Fieldset>
