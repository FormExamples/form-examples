<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const z = assessment.data.painZones;
</script>

<Fieldset legend="Step 4 of 8 — Pain zones">
	<p class="hint">
		The two decision preconditions. An ankle X-ray needs malleolar-zone pain; a foot X-ray needs
		midfoot-zone pain. Each region is gated (AND) by its zone of pain.
	</p>

	<Field label="Pain in the malleolar zone? (ankle precondition)">
		<RadioGroup label="Malleolar-zone pain">
			<label>
				<input
					type="radio"
					class="radio-input"
					name="painZones-malleolarZonePain"
					value="yes"
					bind:group={z.malleolarZonePain}
				/> Yes
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="painZones-malleolarZonePain"
					value="no"
					bind:group={z.malleolarZonePain}
				/> No
			</label>
		</RadioGroup>
	</Field>

	<Field label="Pain in the midfoot zone? (foot precondition)">
		<RadioGroup label="Midfoot-zone pain">
			<label>
				<input
					type="radio"
					class="radio-input"
					name="painZones-midfootZonePain"
					value="yes"
					bind:group={z.midfootZonePain}
				/> Yes
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="painZones-midfootZonePain"
					value="no"
					bind:group={z.midfootZonePain}
				/> No
			</label>
		</RadioGroup>
	</Field>
</Fieldset>
