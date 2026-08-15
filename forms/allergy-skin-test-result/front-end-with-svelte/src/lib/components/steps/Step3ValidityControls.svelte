<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = $state(resultStore.data);
</script>

<Fieldset legend="3. Validity Controls">
	<p class="hint">
		Pre-analytic validity controls. A skin-prick / intradermal test is only interpretable after an
		adequate antihistamine washout and with a valid positive histamine control.
	</p>

	<Field label="Validity controls">
		<CheckboxGroup label="Validity controls">
			<label>
				<CheckboxInput
					label="Antihistamines withheld for an adequate washout"
					bind:checked={d.antihistaminesWithheld}
				/> Antihistamines withheld for an adequate washout
			</label>
			<label>
				<CheckboxInput
					label="Positive histamine control produced an adequate weal"
					bind:checked={d.positiveControlValid}
				/> Positive histamine control produced an adequate weal
			</label>
		</CheckboxGroup>
	</Field>

	{#if !d.antihistaminesWithheld || !d.positiveControlValid}
		<Alert type="warning" heading="Validity controls incomplete">
			<p>
				Without an adequate antihistamine washout and a valid positive control, the test may be
				non-interpretable. Mark the test invalid on the reaction-summary step if appropriate.
			</p>
		</Alert>
	{/if}
</Fieldset>
