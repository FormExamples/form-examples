<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="6. Support &amp; Responsibilities">
	<p class="hint">
		Support and resources allocated, who is responsible for implementing each adjustment, and the
		worker's point of contact.
	</p>

	<Field label="Support referrals">
		<CheckboxGroup label="Support referrals">
			<label>
				<CheckboxInput
					label="Worker referred to occupational health"
					bind:checked={d.occupationalHealthReferred}
				/> Worker referred to occupational health
			</label>
			<label>
				<CheckboxInput
					label="Worker signposted / referred to the Access to Work scheme"
					bind:checked={d.accessToWorkReferred}
				/> Worker signposted / referred to the Access to Work scheme
			</label>
		</CheckboxGroup>
	</Field>

	<Field
		label="Support resources"
		inputId="supportResourcesDetail"
		description="Budget, equipment orders, training, and other resources allocated."
	>
		<TextAreaInput
			id="supportResourcesDetail"
			label="Support resources"
			rows={3}
			placeholder="e.g. Equipment ordered via facilities; £300 budget approved…"
			bind:value={d.supportResourcesDetail}
		/>
	</Field>

	<Field
		label="Responsibilities"
		inputId="responsibilitiesDetail"
		description="Who is responsible for implementing each agreed adjustment."
	>
		<TextAreaInput
			id="responsibilitiesDetail"
			label="Responsibilities"
			rows={3}
			placeholder="e.g. Line manager to arrange the desk move; IT to supply the headphones…"
			bind:value={d.responsibilitiesDetail}
		/>
	</Field>

	<Field
		label="Point of contact"
		inputId="pointOfContact"
		description="Named contact for the worker to raise concerns about the adjustments."
	>
		<TextInput
			id="pointOfContact"
			label="Point of contact"
			placeholder="e.g. Priya Shah (line manager)"
			bind:value={d.pointOfContact}
		/>
	</Field>
</Fieldset>
