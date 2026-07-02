<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import type { RiskGroup } from '$lib/engine/types';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const d = assessment.data;
</script>

{#snippet riskCard(rg: RiskGroup, key: string, title: string)}
	<div class="rounded-lg border border-base-300 bg-base-100 p-4">
		<h4 class="mb-3 text-sm font-semibold text-base-content">{title}</h4>
		<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
			<label class="block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Assessment done?</span>
				<Select label="{title} done" bind:value={rg.done}>
					<option value="">— Select —</option>
					<option value="yes">Yes</option>
					<option value="no">No</option>
				</Select>
			</label>
			<label class="block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Risk level</span>
				<Select label="{title} risk level" bind:value={rg.level}>
					<option value="">— Select —</option>
					<option value="low">Low</option>
					<option value="medium">Medium</option>
					<option value="high">High</option>
				</Select>
			</label>
			<label class="block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Assessed on</span>
				<TextInput
					label="{title} assessed on"
					type="date"
					class="date-input"
					bind:value={rg.assessedOn}
				/>
			</label>
			<label class="block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Actioned?</span>
				<Select label="{title} actioned" bind:value={rg.actioned}>
					<option value="">— Select —</option>
					<option value="yes">Yes</option>
					<option value="no">No</option>
				</Select>
			</label>
		</div>
		<p class="sr-only">{key}</p>
	</div>
{/snippet}

<Fieldset legend="Step 3 of 8 — Risk assessments referenced">
	<p class="hint">
		Record which specialist risk assessments were completed, their risk level, and whether they were
		actioned. This plan records the outcome; it does not replace the specialist tools.
	</p>

	<div class="space-y-4">
		{@render riskCard(d.fallsRisk, 'falls', 'Falls (e.g. multifactorial)')}
		{@render riskCard(d.pressureUlcerRisk, 'pressure-ulcer', 'Pressure ulcer (Waterlow / Braden)')}
		{@render riskCard(d.vteRisk, 'vte', 'Venous thromboembolism (VTE)')}
		{@render riskCard(d.nutritionRisk, 'nutrition', 'Nutrition (MUST)')}
	</div>
</Fieldset>
