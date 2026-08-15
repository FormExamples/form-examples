<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const k = assessment.data.kit;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 4 of 7 — Kit return and adequacy">
	<p class="hint">
		Whether the home FIT kit was returned and whether the sample is adequate. A kit that was not
		returned, or a spoilt / insufficient / expired sample, requires a repeat kit rather than a
		classified result.
	</p>

	<Field label="Was the kit returned?">
		<RadioGroup label="Was the kit returned?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="kit-kitReturned"
						value={opt.value}
						bind:group={k.kitReturned}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Sample received date" inputId="kit-returnDate">
		<TextInput
			id="kit-returnDate"
			label="Sample received date"
			type="date"
			class="date-input"
			bind:value={k.returnDate}
		/>
	</Field>

	<Field label="Sample adequacy" inputId="kit-sampleAdequacy">
		<Select id="kit-sampleAdequacy" label="Sample adequacy" bind:value={k.sampleAdequacy}>
			<option value="">— Select —</option>
			<option value="adequate">Adequate</option>
			<option value="spoilt">Spoilt</option>
			<option value="insufficient">Insufficient</option>
			<option value="expired">Expired</option>
		</Select>
	</Field>

	<Field label="Spoilt reason (if not adequate)" inputId="kit-spoiltReason">
		<Select id="kit-spoiltReason" label="Spoilt reason (if not adequate)" bind:value={k.spoiltReason}>
			<option value="">— Not applicable —</option>
			<option value="leaked">Leaked</option>
			<option value="undated">Undated</option>
			<option value="unlabelled">Unlabelled</option>
			<option value="too-old">Too old</option>
			<option value="damaged">Damaged</option>
		</Select>
	</Field>
</Fieldset>
