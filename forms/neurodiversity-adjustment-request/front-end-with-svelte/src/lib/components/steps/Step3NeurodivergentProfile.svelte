<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { requestStore } from '$lib/stores/result.svelte';

	const d = requestStore.data;
</script>

<Fieldset legend="3. Neurodivergent Profile">
	<p class="hint">
		The worker's neurodivergent conditions and how they see them. A formal diagnosis is not required
		for the Equality Act 2010 duty to apply.
	</p>

	<Field label="Neurodivergent conditions">
		<CheckboxGroup label="Neurodivergent conditions">
			<label><CheckboxInput label="ADHD" bind:checked={d.conditionAdhd} /> ADHD</label>
			<label><CheckboxInput label="Autism" bind:checked={d.conditionAutism} /> Autism</label>
			<label><CheckboxInput label="Dyslexia" bind:checked={d.conditionDyslexia} /> Dyslexia</label>
			<label><CheckboxInput label="Dyspraxia" bind:checked={d.conditionDyspraxia} /> Dyspraxia</label>
			<label><CheckboxInput label="Dyscalculia" bind:checked={d.conditionDyscalculia} /> Dyscalculia</label>
			<label><CheckboxInput label="Tourette's syndrome" bind:checked={d.conditionTourettes} /> Tourette's syndrome</label>
			<label><CheckboxInput label="Other neurodivergence" bind:checked={d.conditionOther} /> Other neurodivergence</label>
		</CheckboxGroup>
	</Field>

	{#if d.conditionOther}
		<Field label="Other condition detail" inputId="conditionOtherDetail">
			<TextInput
				id="conditionOtherDetail"
				label="Other condition detail"
				placeholder="Describe the other neurodivergent condition(s)…"
				bind:value={d.conditionOtherDetail}
			/>
		</Field>
	{/if}

	<Field label="Diagnosis status" inputId="diagnosisStatus">
		<Select id="diagnosisStatus" label="Diagnosis status" bind:value={d.diagnosisStatus}>
			<option value="">Select…</option>
			<option value="diagnosed">Diagnosed</option>
			<option value="self-identified">Self-identified</option>
			<option value="awaiting-assessment">Awaiting assessment</option>
			<option value="prefer-not-to-say">Prefer not to say</option>
		</Select>
	</Field>

	<Field
		label="Does the worker consider this a disability?"
		inputId="considersDisability"
		description="Under the Equality Act 2010. The worker need not consider it a disability for the duty to apply."
	>
		<Select id="considersDisability" label="Considers a disability" bind:value={d.considersDisability}>
			<option value="">Select…</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
			<option value="unsure">Unsure</option>
			<option value="prefer-not-to-say">Prefer not to say</option>
		</Select>
	</Field>

	<Field label="Equality Act disability test">
		<CheckboxGroup label="Equality Act disability test">
			<label>
				<CheckboxInput
					label="Substantial and long-term adverse effect"
					bind:checked={d.substantialLongTermImpact}
				/>
				Substantial and long-term adverse effect on day-to-day activities
			</label>
		</CheckboxGroup>
	</Field>

	<Field label="Disclosure consent">
		<CheckboxGroup label="Disclosure consent">
			<label>
				<CheckboxInput label="Consent to share" bind:checked={d.disclosureConsent} />
				The worker consents to their details being shared with HR / occupational health to arrange
				adjustments
			</label>
		</CheckboxGroup>
	</Field>
</Fieldset>
