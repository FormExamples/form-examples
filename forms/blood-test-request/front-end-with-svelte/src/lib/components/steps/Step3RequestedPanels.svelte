<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { PANELS, countSelectedPanels } from '$lib/engine/panels';
	import { requestStore } from '$lib/stores/request.svelte';

	const d = requestStore.data.panels;
	const selectedCount = $derived(countSelectedPanels(d));
</script>

<Fieldset legend="3. Requested Panels">
	<p class="hint">
		Tick the blood-test panels to order. At least one panel is required. Critical tests escalate
		triage to stat; fasting tests should be collected fasting.
	</p>

	<Field label="Requested test panels" required>
		<CheckboxGroup label="Requested test panels">
			{#each PANELS as panel (panel.field)}
				<label>
					<CheckboxInput label={panel.label} bind:checked={d[panel.field]} />
					{panel.label}
					{#if panel.critical}
						<span class="ml-1 rounded px-1.5 py-0.5 text-xs font-semibold bg-error text-error-content">critical</span>
					{:else if panel.fasting}
						<span class="ml-1 rounded px-1.5 py-0.5 text-xs font-semibold bg-warning text-warning-content">fasting</span>
					{/if}
				</label>
			{/each}
		</CheckboxGroup>
	</Field>

	{#if selectedCount === 0}
		<Alert type="warning" heading="No panel selected">
			<p>A request with no panel selected cannot be processed and will be graded as a reject.</p>
		</Alert>
	{:else}
		<p class="text-sm text-base-content/70">{selectedCount} panel{selectedCount === 1 ? '' : 's'} selected.</p>
	{/if}
</Fieldset>
