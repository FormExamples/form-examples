<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { requestStore } from '$lib/stores/request.svelte';

	const d = requestStore.data.safety;
</script>

<Fieldset legend="6. Patient Safety">
	<p class="hint">Patient-safety factors affecting phlebotomy and specimen handling.</p>

	<Field label="Safety factors">
		<CheckboxGroup label="Safety factors">
			<label>
				<CheckboxInput label="Known blood-borne virus" bind:checked={d.knownBloodBorneVirus} />
				Known blood-borne virus
			</label>
			<label>
				<CheckboxInput label="Difficult venous access" bind:checked={d.difficultVenousAccess} />
				Difficult venous access
			</label>
		</CheckboxGroup>
	</Field>

	{#if d.knownBloodBorneVirus}
		<Alert type="warning" heading="Blood-borne-virus precaution">
			<p>
				Apply standard / enhanced phlebotomy precautions and label the sample as a biohazard per
				local policy.
			</p>
		</Alert>
	{/if}
</Fieldset>
