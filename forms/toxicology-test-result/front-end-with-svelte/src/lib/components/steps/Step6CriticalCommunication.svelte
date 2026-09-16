<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import { CheckboxGroup, CheckboxInput, TextInput } from "@lilydesignsystem/svelte-headless";
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="6. Critical Communication">
	<p class="hint">Whether a critical / urgent result was communicated, and to whom.</p>

	<Field label="Critical-result communication">
		<CheckboxGroup label="Critical-result communication">
			<label>
				<CheckboxInput
					label="Critical / urgent result communicated to requester"
					bind:checked={d.criticalResultCommunicated}
				/> Critical / urgent result communicated to requester
			</label>
		</CheckboxGroup>
	</Field>

	<Field label="Reported to" inputId="reportedTo">
		<TextInput
			id="reportedTo"
			label="Reported to"
			placeholder="Who was informed, with date and time"
			bind:value={d.reportedTo}
		/>
	</Field>
</Fieldset>
