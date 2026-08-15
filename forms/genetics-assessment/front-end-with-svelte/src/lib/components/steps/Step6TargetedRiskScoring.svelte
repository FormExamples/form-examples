<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateManchesterScore, countBethesdaMet } from '#lib/engine/genetics-grader.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const t = assessment.data.targetedRiskScoring;
	const m = t.manchester;
	const b = t.bethesda;
	const tc = t.tyrerCuzick;
	const pm = t.premm5;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const manchesterScore = $derived(calculateManchesterScore(assessment.data));
	const bethesdaMet = $derived(countBethesdaMet(assessment.data));
	const premm5 = $derived(pm.externalPREMM5Percent);
	const tcLifetime = $derived(tc.externalLifetimeRisk);
</script>

<Fieldset legend="Targeted Risk Scoring">
	<p class="hint">
		Inputs for the Manchester Score (BRCA1/2), Revised Bethesda criteria (Lynch syndrome),
		Tyrer-Cuzick (breast cancer) and PREMM5 (Lynch). Live scores update as you type.
	</p>

	<h3 class="mt-2 text-sm font-semibold text-base-content">Manchester Score for BRCA1/2</h3>
	<p class="hint">
		Enter a count for each cancer category in the proband and in first/second-degree relatives.
		Each entry contributes pre-defined points; summed across both columns the total is the
		Manchester score.
	</p>

	<div class="field-grid-3">
		<Field label="Proband — female breast <30" inputId="m-pfb30">
			<NumberInput id="m-pfb30" label="Proband female breast <30" min={0} max={10} bind:value={m.probandFemaleBreastUnder30} />
		</Field>
		<Field label="Proband — female breast 30-39" inputId="m-pfb3039">
			<NumberInput id="m-pfb3039" label="Proband female breast 30-39" min={0} max={10} bind:value={m.probandFemaleBreast30to39} />
		</Field>
		<Field label="Proband — female breast 40-49" inputId="m-pfb4049">
			<NumberInput id="m-pfb4049" label="Proband female breast 40-49" min={0} max={10} bind:value={m.probandFemaleBreast40to49} />
		</Field>
	</div>
	<div class="field-grid">
		<Field label="Proband — ovarian <60" inputId="m-pov">
			<NumberInput id="m-pov" label="Proband ovarian <60" min={0} max={10} bind:value={m.probandOvarianUnder60} />
		</Field>
		<Field label="Proband — male breast (any age)" inputId="m-pmb">
			<NumberInput id="m-pmb" label="Proband male breast" min={0} max={10} bind:value={m.probandMaleBreast} />
		</Field>
	</div>
	<div class="field-grid-3">
		<Field label="Relatives — female breast <30" inputId="m-rfb30">
			<NumberInput id="m-rfb30" label="Relatives female breast <30" min={0} max={30} bind:value={m.relativeFemaleBreastUnder30} />
		</Field>
		<Field label="Relatives — female breast 30-39" inputId="m-rfb3039">
			<NumberInput id="m-rfb3039" label="Relatives female breast 30-39" min={0} max={30} bind:value={m.relativeFemaleBreast30to39} />
		</Field>
		<Field label="Relatives — female breast 40-49" inputId="m-rfb4049">
			<NumberInput id="m-rfb4049" label="Relatives female breast 40-49" min={0} max={30} bind:value={m.relativeFemaleBreast40to49} />
		</Field>
	</div>
	<div class="field-grid">
		<Field label="Relatives — ovarian <60" inputId="m-rov">
			<NumberInput id="m-rov" label="Relatives ovarian <60" min={0} max={30} bind:value={m.relativeOvarianUnder60} />
		</Field>
		<Field label="Relatives — male breast (any age)" inputId="m-rmb">
			<NumberInput id="m-rmb" label="Relatives male breast" min={0} max={30} bind:value={m.relativeMaleBreast} />
		</Field>
	</div>
	<div class="field-grid">
		<Field label="Relatives — pancreatic <60" inputId="m-rpanc">
			<NumberInput id="m-rpanc" label="Relatives pancreatic <60" min={0} max={30} bind:value={m.relativePancreaticUnder60} />
		</Field>
		<Field label="Relatives — prostate <60" inputId="m-rpros">
			<NumberInput id="m-rpros" label="Relatives prostate <60" min={0} max={30} bind:value={m.relativeProstateUnder60} />
		</Field>
	</div>

	<h3 class="mt-2 text-sm font-semibold text-base-content">Revised Bethesda Criteria (Lynch syndrome)</h3>
	<Field label="1. Colorectal cancer diagnosed in proband under age 50?">
		<RadioGroup label="CRC under 50?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="b-crc" value={opt.value} bind:group={b.crcUnder50} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="2. Synchronous or metachronous colorectal or other Lynch-spectrum tumour?">
		<RadioGroup label="Synchronous/metachronous?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="b-syn" value={opt.value} bind:group={b.synchronousMetachronous} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="3. CRC under 60 with high microsatellite instability (MSI-H) histology?">
		<RadioGroup label="MSI-H histology?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="b-msi" value={opt.value} bind:group={b.msiHistology} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="4. CRC plus >=1 first-degree relative with a Lynch-spectrum tumour, one diagnosed <50?">
		<RadioGroup label="First-degree Lynch tumour?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="b-fdr" value={opt.value} bind:group={b.firstDegreeLynchTumour} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="5. CRC plus >=2 first- or second-degree relatives with Lynch-spectrum tumours at any age?">
		<RadioGroup label="Multiple relatives Lynch?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="b-mult" value={opt.value} bind:group={b.multipleRelativesLynch} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<h3 class="mt-2 text-sm font-semibold text-base-content">Tyrer-Cuzick (IBIS) — breast cancer</h3>
	<p class="hint">
		Capture inputs for the IBIS model. The model itself is not run in-browser; if you have already
		calculated the 10-year and lifetime risks externally, paste them at the bottom.
	</p>
	<div class="field-grid-3">
		<Field label="Age (years)" inputId="tc-age">
			<NumberInput id="tc-age" label="Age" min={0} max={120} bind:value={tc.ageYears} />
		</Field>
		<Field label="Age at menarche" inputId="tc-menarche">
			<NumberInput id="tc-menarche" label="Age at menarche" min={5} max={25} bind:value={tc.ageAtMenarche} />
		</Field>
		<Field label="Parous?">
			<RadioGroup label="Parous?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="tc-parous" value={opt.value} bind:group={tc.parous} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	</div>
	<div class="field-grid-3">
		<Field label="Age at first live birth" inputId="tc-flb">
			<NumberInput id="tc-flb" label="Age at first live birth" min={10} max={60} bind:value={tc.ageAtFirstLiveBirth} />
		</Field>
		<Field label="Menopausal?">
			<RadioGroup label="Menopausal?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="tc-meno" value={opt.value} bind:group={tc.menopausal} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		<Field label="Age at menopause" inputId="tc-menoage">
			<NumberInput id="tc-menoage" label="Age at menopause" min={20} max={70} bind:value={tc.ageAtMenopause} />
		</Field>
	</div>
	<div class="field-grid">
		<Field label="Height (cm)" inputId="tc-height">
			<NumberInput id="tc-height" label="Height (cm)" min={50} max={250} bind:value={tc.heightCm} />
		</Field>
		<Field label="Weight (kg)" inputId="tc-weight">
			<NumberInput id="tc-weight" label="Weight (kg)" min={1} max={400} bind:value={tc.weightKg} />
		</Field>
	</div>
	<Field label="Currently on HRT?">
		<RadioGroup label="HRT current?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="tc-hrt" value={opt.value} bind:group={tc.hrtCurrent} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Prior benign breast disease?">
		<RadioGroup label="Prior benign breast disease?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="tc-bbd" value={opt.value} bind:group={tc.priorBenignBreastDisease} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Atypical hyperplasia?">
		<RadioGroup label="Atypical hyperplasia?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="tc-ah" value={opt.value} bind:group={tc.atypicalHyperplasia} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="LCIS (lobular carcinoma in situ)?">
		<RadioGroup label="LCIS?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="tc-lcis" value={opt.value} bind:group={tc.lcis} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Mammographically dense breast tissue?">
		<RadioGroup label="Dense breast tissue?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="tc-dense" value={opt.value} bind:group={tc.dense} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<div class="field-grid">
		<Field label="External 10-year risk (%)" inputId="tc-ten">
			<NumberInput id="tc-ten" label="External 10-year risk" min={0} max={100} step={0.1} bind:value={tc.externalTenYearRisk} />
		</Field>
		<Field label="External lifetime risk (%)" inputId="tc-life">
			<NumberInput id="tc-life" label="External lifetime risk" min={0} max={100} step={0.1} bind:value={tc.externalLifetimeRisk} />
		</Field>
	</div>

	<h3 class="mt-2 text-sm font-semibold text-base-content">PREMM5 — Lynch syndrome</h3>
	<Field label="Proband has had colorectal cancer?">
		<RadioGroup label="Proband colorectal?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="pm-crc" value={opt.value} bind:group={pm.probandColorectal} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Proband has had endometrial cancer?">
		<RadioGroup label="Proband endometrial?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="pm-endo" value={opt.value} bind:group={pm.probandEndometrial} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Proband has had another Lynch-spectrum tumour (gastric, ovarian, urothelial, small bowel, biliary, brain, sebaceous)?">
		<RadioGroup label="Proband other Lynch tumour?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="pm-other" value={opt.value} bind:group={pm.probandOtherLynchTumour} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Youngest age at which the proband had any Lynch-spectrum tumour" inputId="pm-yage">
		<NumberInput id="pm-yage" label="Youngest proband age at Lynch tumour" min={0} max={120} bind:value={pm.youngestProbandAgeAtLynchTumour} />
	</Field>
	<div class="field-grid">
		<Field label="First-degree relatives with CRC" inputId="pm-fdcrc">
			<NumberInput id="pm-fdcrc" label="First-degree relatives with CRC" min={0} max={20} bind:value={pm.firstDegreeWithCRC} />
		</Field>
		<Field label="First-degree relatives with endometrial cancer" inputId="pm-fdendo">
			<NumberInput id="pm-fdendo" label="First-degree relatives with endometrial cancer" min={0} max={20} bind:value={pm.firstDegreeWithEndometrial} />
		</Field>
	</div>
	<div class="field-grid">
		<Field label="First-degree relatives with other Lynch tumour" inputId="pm-fdother">
			<NumberInput id="pm-fdother" label="First-degree relatives with other Lynch tumour" min={0} max={20} bind:value={pm.firstDegreeWithOtherLynch} />
		</Field>
		<Field label="Second-degree relatives with any Lynch tumour" inputId="pm-sd">
			<NumberInput id="pm-sd" label="Second-degree relatives with any Lynch tumour" min={0} max={20} bind:value={pm.secondDegreeWithLynch} />
		</Field>
	</div>
	<Field label="Youngest age at which any relative had a Lynch tumour" inputId="pm-yrage">
		<NumberInput id="pm-yrage" label="Youngest relative age at Lynch tumour" min={0} max={120} bind:value={pm.youngestRelativeAgeAtLynchTumour} />
	</Field>
	<Field
		label="External PREMM5 score (%)"
		description="If you have run PREMM5 externally, paste the percent here. Threshold for testing is >=5%."
		inputId="pm-ext"
	>
		<NumberInput id="pm-ext" label="External PREMM5 score" min={0} max={100} step={0.1} bind:value={pm.externalPREMM5Percent} />
	</Field>

	<div class="mt-4 rounded-xl border border-base-300 bg-base-100 p-4">
		<h4 class="text-sm font-semibold text-base-content">Live computed scores</h4>
		<dl class="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
			<div class="flex items-center justify-between rounded border border-base-300 px-3 py-2">
				<dt class="text-base-content/70">Manchester Score (BRCA1/2)</dt>
				<dd class="font-bold {manchesterScore >= 15 ? 'text-error' : 'text-base-content'}">{manchesterScore}</dd>
			</div>
			<div class="flex items-center justify-between rounded border border-base-300 px-3 py-2">
				<dt class="text-base-content/70">Bethesda criteria met</dt>
				<dd class="font-bold {bethesdaMet >= 1 ? 'text-warning' : 'text-base-content'}">{bethesdaMet} / 5</dd>
			</div>
			<div class="flex items-center justify-between rounded border border-base-300 px-3 py-2">
				<dt class="text-base-content/70">PREMM5 (external)</dt>
				<dd class="font-bold {premm5 !== null && Number(premm5) >= 5 ? 'text-error' : 'text-base-content'}">{premm5 === null ? '—' : `${premm5}%`}</dd>
			</div>
			<div class="flex items-center justify-between rounded border border-base-300 px-3 py-2">
				<dt class="text-base-content/70">Tyrer-Cuzick lifetime (external)</dt>
				<dd class="font-bold {tcLifetime !== null && Number(tcLifetime) >= 17 ? 'text-warning' : 'text-base-content'}">{tcLifetime === null ? '—' : `${tcLifetime}%`}</dd>
			</div>
		</dl>
	</div>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	.field-grid-3 {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid,
		.field-grid-3 {
			grid-template-columns: 1fr;
		}
	}
</style>
