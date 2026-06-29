<script lang="ts">
	import { request } from '$lib/stores/request.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const d = request.data.logistics;

	const boreLimitOptions = [
		{ value: 'within-limit', label: 'Within bore / table limit' },
		{ value: 'borderline', label: 'Borderline — confirm with scanner specification' },
		{ value: 'exceeds-limit', label: 'Exceeds bore / table limit' },
		{ value: 'unknown', label: 'Unknown' }
	];

	const settingOptions = [
		{ value: 'outpatient', label: 'Outpatient' },
		{ value: 'inpatient', label: 'Inpatient' },
		{ value: 'community', label: 'Community' },
		{ value: 'emergency', label: 'Emergency' }
	];
</script>

<Fieldset legend="Logistics">
	<p class="hint">Bore / table weight fit, care setting, and site.</p>

	<Field label="Weight versus bore / table limit" inputId="weightVersusBoreLimit">
		<Select id="weightVersusBoreLimit" label="Weight versus bore / table limit" bind:value={d.weightVersusBoreLimit}>
			<option value="">— Select —</option>
			{#each boreLimitOptions as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<div class="field-grid">
		<Field label="Care setting" inputId="setting">
			<Select id="setting" label="Care setting" bind:value={d.setting}>
				<option value="">— Select —</option>
				{#each settingOptions as o (o.value)}
					<option value={o.value}>{o.label}</option>
				{/each}
			</Select>
		</Field>
		<Field label="Scanning site" inputId="logisticsSiteName">
			<TextInput id="logisticsSiteName" label="Scanning site" bind:value={d.siteName} />
		</Field>
	</div>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
