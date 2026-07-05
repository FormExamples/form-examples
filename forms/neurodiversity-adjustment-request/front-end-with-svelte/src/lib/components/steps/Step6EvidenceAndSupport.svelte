<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { requestStore } from '$lib/stores/result.svelte';

	const d = requestStore.data;
</script>

<Fieldset legend="6. Evidence and Support">
	<p class="hint">
		Any supporting evidence, and whether occupational health or the government Access to Work scheme
		is involved.
	</p>

	<Field label="Supporting-evidence type" inputId="supportingEvidenceType">
		<Select id="supportingEvidenceType" label="Supporting-evidence type" bind:value={d.supportingEvidenceType}>
			<option value="">Select…</option>
			<option value="occupational-health">Occupational-health report</option>
			<option value="gp-letter">GP letter</option>
			<option value="diagnostic-report">Diagnostic report</option>
			<option value="access-to-work">Access to Work assessment</option>
			<option value="none">None</option>
		</Select>
	</Field>

	<Field label="Support already involved">
		<CheckboxGroup label="Support already involved">
			<label>
				<CheckboxInput label="Occupational health involved" bind:checked={d.occupationalHealthInvolved} />
				Occupational health has been or should be involved
			</label>
			<label>
				<CheckboxInput label="Access to Work involved" bind:checked={d.accessToWorkInvolved} />
				The government Access to Work scheme is involved or has been applied for
			</label>
		</CheckboxGroup>
	</Field>
</Fieldset>
