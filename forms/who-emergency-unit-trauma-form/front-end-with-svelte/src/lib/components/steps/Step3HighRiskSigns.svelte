<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';

	const r = assessment.data.highRiskSigns;
</script>

<Fieldset
	title="High Risk Signs"
	description="Tick any high-risk red signs (A/B, C, D, Other) and trauma indicators (general trauma, road traffic). These guide rapid clinical escalation."
>
	<h3 class="mb-2 text-base font-semibold text-base-content">A / B (airway / breathing)</h3>
	<Checkbox label="Stridor" name="redStridor" bind:checked={r.redStridor} />
	<Checkbox label="Cyanosis" name="redCyanosis" bind:checked={r.redCyanosis} />
	<Checkbox label="Respiratory distress" name="redRespiratoryDistress" bind:checked={r.redRespiratoryDistress} />

	<h3 class="mt-4 mb-2 text-base font-semibold text-base-content">C (circulation)</h3>
	<Checkbox label="Poor perfusion" name="redPoorPerfusion" bind:checked={r.redPoorPerfusion} />
	<Checkbox label="Weak / fast pulse" name="redWeakFastPulse" bind:checked={r.redWeakFastPulse} />
	<Checkbox label="Capillary refill > 3 sec" name="redCapRefillOver3" bind:checked={r.redCapRefillOver3} />
	<Checkbox label="Heavy bleeding" name="redHeavyBleeding" bind:checked={r.redHeavyBleeding} />
	<Checkbox label="Adult HR < 50 or > 150" name="redAdultHrAbnormal" bind:checked={r.redAdultHrAbnormal} />
	<Checkbox label="Child (≥2): lethargy" name="redChildLethargy" bind:checked={r.redChildLethargy} />
	<Checkbox label="Child (≥2): sunken eyes" name="redChildSunkenEyes" bind:checked={r.redChildSunkenEyes} />
	<Checkbox label="Child (≥2): slow skin pinch" name="redChildSlowSkinPinch" bind:checked={r.redChildSlowSkinPinch} />
	<Checkbox label="Child (≥2): poor drinking" name="redChildPoorDrinking" bind:checked={r.redChildPoorDrinking} />

	<h3 class="mt-4 mb-2 text-base font-semibold text-base-content">D (disability)</h3>
	<Checkbox label="Unresponsive" name="redUnresponsive" bind:checked={r.redUnresponsive} />
	<Checkbox label="Acute convulsions" name="redAcuteConvulsions" bind:checked={r.redAcuteConvulsions} />
	<Checkbox label="Hypoglycaemia" name="redHypoglycaemia" bind:checked={r.redHypoglycaemia} />
	<Checkbox label="Acute focal neurologic deficit" name="redAcuteFocalNeuroDeficit" bind:checked={r.redAcuteFocalNeuroDeficit} />
	<Checkbox
		label="Altered mental status with fever / hypothermia / stiff neck / headache"
		name="redAlteredMentalStatusWithFeverEtc"
		bind:checked={r.redAlteredMentalStatusWithFeverEtc}
	/>

	<h3 class="mt-4 mb-2 text-base font-semibold text-base-content">Other red signs</h3>
	<Checkbox label="Threatened limb" name="redThreatenedLimb" bind:checked={r.redThreatenedLimb} />
	<Checkbox label="Snake bite" name="redSnakeBite" bind:checked={r.redSnakeBite} />
	<Checkbox label="Poisoning, ingestion, chemical exposure" name="redPoisoningChemicalExposure" bind:checked={r.redPoisoningChemicalExposure} />
	<Checkbox label="Violent or aggressive" name="redViolentOrAggressive" bind:checked={r.redViolentOrAggressive} />
	<Checkbox label="Acute testicular pain or priapism" name="redAcuteTesticularPainOrPriapism" bind:checked={r.redAcuteTesticularPainOrPriapism} />
	<Checkbox
		label="Adult: severe chest / abdominal pain or ECG with ischemia"
		name="redAdultSevereChestOrAbdoPain"
		bind:checked={r.redAdultSevereChestOrAbdoPain}
	/>
	<Checkbox label="Pregnant with high-risk findings" name="redPregnantWithHighRiskFindings" bind:checked={r.redPregnantWithHighRiskFindings} />
	<Checkbox label="Infant < 8 days old" name="redInfantUnder8Days" bind:checked={r.redInfantUnder8Days} />
	<Checkbox
		label="Infant < 2 months with temp > 39°C or < 36°C"
		name="redInfantUnder2MonthsAbnormalTemp"
		bind:checked={r.redInfantUnder2MonthsAbnormalTemp}
	/>

	<h3 class="mt-6 mb-2 text-base font-semibold text-base-content">High-risk trauma — general</h3>
	<Checkbox label="Fall from twice person's height" name="traumaFallTwiceHeight" bind:checked={r.traumaFallTwiceHeight} />
	<Checkbox label="All penetrating trauma (excepting distal to knee/elbow)" name="traumaAllPenetrating" bind:checked={r.traumaAllPenetrating} />
	<Checkbox
		label="Penetrating trauma distal to knee/elbow with uncontrolled bleeding"
		name="traumaPenetratingDistalUncontrolledBleeding"
		bind:checked={r.traumaPenetratingDistalUncontrolledBleeding}
	/>
	<Checkbox label="Crush injury" name="traumaCrushInjury" bind:checked={r.traumaCrushInjury} />
	<Checkbox label="Polytrauma (injury to multiple body areas)" name="traumaPolytrauma" bind:checked={r.traumaPolytrauma} />
	<Checkbox
		label="Patient with bleeding disorder or on anticoagulation"
		name="traumaBleedingDisorderOrAnticoag"
		bind:checked={r.traumaBleedingDisorderOrAnticoag}
	/>
	<Checkbox label="Pregnant" name="traumaPregnant" bind:checked={r.traumaPregnant} />

	<h3 class="mt-6 mb-2 text-base font-semibold text-base-content">High-risk trauma — road traffic</h3>
	<Checkbox label="High speed motor vehicle crash" name="rtHighSpeedCrash" bind:checked={r.rtHighSpeedCrash} />
	<Checkbox label="Pedestrian or cyclist hit by vehicle" name="rtPedestrianOrCyclistHit" bind:checked={r.rtPedestrianOrCyclistHit} />
	<Checkbox label="Other person in same vehicle died at scene" name="rtOtherInVehicleDied" bind:checked={r.rtOtherInVehicleDied} />
	<Checkbox label="Motor vehicle crash without a seatbelt" name="rtNoSeatbelt" bind:checked={r.rtNoSeatbelt} />
	<Checkbox label="Trapped or thrown from vehicle (incl. motorcycle)" name="rtTrappedOrThrown" bind:checked={r.rtTrappedOrThrown} />
	<Checkbox label="Dead on arrival" name="rtDeadOnArrival" bind:checked={r.rtDeadOnArrival} />
</Fieldset>
