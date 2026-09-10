<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the
	// clinician dashboard.
	const plural = 'diabetes-podiatry-assessments';
</script>

<main class="mx-16 px-4 py-12">
	<p class="max-w-2xl text-lg text-base-content/80">
		A structured diabetic foot risk-screening record aligned with NICE NG19, classifying each
		foot's risk and the overall review pathway from a single continuous single-page examination.
	</p>

	<div class="mt-6 grid gap-4 sm:grid-cols-2">
		<a
			href="/diabetes-podiatry-assessment/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step examination record. One continuous single-page wizard that
				classifies the per-foot and overall risk, review pathway, and interval on submit.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/diabetes-podiatry-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed per-foot and overall risk, review pathway,
				referral, and safety flags, and filter by risk and referral.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold text-primary">Open the dashboard →</span>
		</a>
	</div>

	<section class="mt-12">
		<h2 class="text-lg font-semibold text-base-content">About this work</h2>
		<dl class="mt-4 space-y-4 text-sm">
			<div>
				<dt class="font-semibold text-base-content">Purpose</dt>
				<dd class="mt-1 text-base-content/70">
					Capture an assessor's examination findings for each foot — sensory neuropathy status,
					pedal pulses, structural deformity, callus, skin breakdown, active ulceration (and its
					severity), ulceration/amputation history, and a suspected-Charcot-foot marker — together
					with patient-wide risk factors (renal replacement therapy, visual acuity impairment,
					self-care ability, footwear). From the two examined feet the engine classifies each
					foot's risk, applies patient-wide high-risk overrides, derives an overall risk category,
					review pathway and interval, and raises flagged issues. This is a risk-stratification
					form: it records examination findings and applies deterministic classification rules; it
					does not diagnose, debride, dress, or otherwise manage a wound.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the gated first-match
					per-foot and overall risk-classification engine, and the flag rules. The same engine
					grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from NICE NG19 (<em>Diabetic foot problems: prevention and management</em>) and the
					International Working Group on the Diabetic Foot (IWGDF) guidelines. A risk
					classification is not a diagnosis and does not replace urgent same-day vascular or
					surgical assessment where critical limb ischaemia, spreading infection, or suspected
					Charcot foot is already apparent.
				</dd>
			</div>
		</dl>
	</section>
</main>
