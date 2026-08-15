<script lang="ts">
	import { request } from '#lib/stores/request.svelte.js';
	import { ALLERGEN_PANELS, countSelectedPanels } from '#lib/engine/rules.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';

	const t = request.data.test;
	const selectedCount = $derived(countSelectedPanels(t));
</script>

<Fieldset legend="Requested test">
	<p class="hint">The test modality and the allergen panels to test — the highest-value fields.</p>

	<Field label="Requested test type" required inputId="testType">
		<Select id="testType" label="Requested test type" required bind:value={t.testType}>
			<option value="">— Select —</option>
			<option value="skin-prick-test">Skin-prick test</option>
			<option value="intradermal-test">Intradermal test</option>
			<option value="patch-test">Patch test</option>
			<option value="specific-ige-blood">Specific-IgE blood</option>
			<option value="drug-provocation-challenge">Drug-provocation challenge</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<div class="field" id="allergenPanels">
		<span class="label" data-required="true">Allergen panels</span>
		<p class="hint">
			{#if selectedCount === 0}
				No allergen panels selected yet — select at least one.
			{:else}
				{selectedCount} allergen panel{selectedCount === 1 ? '' : 's'} selected.
			{/if}
		</p>
		<div class="panel-wrap">
			<CheckboxGroup label="Allergen panels">
				{#each ALLERGEN_PANELS as panel (panel.field)}
					<label class="panel-option">
						<CheckboxInput label={panel.label} bind:checked={t[panel.field]} />
						<span class="panel-label">
							{panel.label}
							<span class="panel-hint">{panel.hint}</span>
						</span>
					</label>
				{/each}
			</CheckboxGroup>
		</div>
	</div>
</Fieldset>

<style>
	.panel-wrap :global(.checkbox-group) {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.75rem;
	}
	@media (max-width: 640px) {
		.panel-wrap :global(.checkbox-group) {
			grid-template-columns: 1fr;
		}
	}
	.panel-option {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
	}
	.panel-label {
		display: flex;
		flex-direction: column;
		font-weight: 500;
	}
	.panel-hint {
		font-weight: 400;
		font-size: 0.8125rem;
		color: var(--color-muted);
	}
</style>
