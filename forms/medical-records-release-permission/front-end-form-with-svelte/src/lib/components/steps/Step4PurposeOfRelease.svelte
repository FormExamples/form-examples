<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { purposeOptions } from '$lib/engine/validation-rules';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const p = assessment.data.purposeOfRelease;
</script>

<Fieldset legend="Purpose of Release">
	<p class="hint">Indicate the reason for requesting the release of medical records.</p>

	<Field label="Purpose" required>
		<RadioGroup label="Purpose">
			{#each purposeOptions as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="purpose"
						value={opt.value}
						bind:group={p.purpose}
						required
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if p.purpose === 'other'}
		<Field label="Please provide details" inputId="otherDetails">
			<TextAreaInput
				id="otherDetails"
				label="Please provide details"
				placeholder="Describe the purpose of the records release..."
				bind:value={p.otherDetails}
			/>
		</Field>
	{/if}
</Fieldset>
