<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const p = assessment.data.preferencesPriorities;

	const priorityOptions = [
		{ value: 'low', label: 'Low priority' },
		{ value: 'moderate', label: 'Moderate priority' },
		{ value: 'high', label: 'High priority' },
		{ value: 'very-high', label: 'Very high priority' }
	];

	const hormoneOptions = [
		{ value: 'no-preference', label: 'No preference' },
		{ value: 'prefer-hormone-free', label: 'Prefer hormone-free' },
		{ value: 'prefer-hormonal', label: 'Prefer hormonal' }
	];
</script>

<Fieldset legend="Preferences & Priorities">
	<p class="hint">Your preferences for contraceptive method selection.</p>

	<Field label="Preferred contraceptive method" inputId="preferredMethod">
		<Select id="preferredMethod" label="Preferred contraceptive method" bind:value={p.preferredMethod}>
			<option value="">-- Select --</option>
			<option value="combined-oral">Combined oral contraceptive (COC)</option>
			<option value="progestogen-only-pill">Progestogen-only pill (POP)</option>
			<option value="injectable">Injectable (e.g., Depo-Provera)</option>
			<option value="implant">Subdermal implant (e.g., Nexplanon)</option>
			<option value="copper-iud">Copper IUD (non-hormonal coil)</option>
			<option value="lng-ius">LNG-IUS (hormonal coil, e.g., Mirena)</option>
			<option value="patch">Contraceptive patch</option>
			<option value="vaginal-ring">Vaginal ring (e.g., NuvaRing)</option>
			<option value="barrier">Barrier method (condoms, diaphragm)</option>
			<option value="natural-methods">Natural family planning</option>
			<option value="sterilisation">Sterilisation</option>
		</Select>
	</Field>

	<Field label="How important is contraceptive efficacy?" inputId="efficacyPriority">
		<Select id="efficacyPriority" label="Efficacy priority" bind:value={p.efficacyPriority}>
			<option value="">-- Select --</option>
			{#each priorityOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="How important is convenience (e.g., not needing daily action)?" inputId="conveniencePriority">
		<Select id="conveniencePriority" label="Convenience priority" bind:value={p.conveniencePriority}>
			<option value="">-- Select --</option>
			{#each priorityOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="How important is period control (lighter/no periods)?" inputId="periodControlPriority">
		<Select id="periodControlPriority" label="Period control priority" bind:value={p.periodControlPriority}>
			<option value="">-- Select --</option>
			{#each priorityOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="How important is rapid return of fertility after stopping?" inputId="fertilityReturnPriority">
		<Select id="fertilityReturnPriority" label="Fertility return priority" bind:value={p.fertilityReturnPriority}>
			<option value="">-- Select --</option>
			{#each priorityOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Hormone-free preference">
		<RadioGroup label="Hormone-free preference">
			{#each hormoneOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hormoneFreePreference" value={opt.value} bind:group={p.hormoneFreePreference} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
