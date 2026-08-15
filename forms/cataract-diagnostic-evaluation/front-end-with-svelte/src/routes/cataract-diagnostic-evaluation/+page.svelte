<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the evaluation wizard and the review
	// dashboard. The collection routes (`/cataract-diagnostic-evaluations` and
	// `/cataract-diagnostic-evaluations/new`) hold the actual functionality.
	const plural = 'cataract-diagnostic-evaluations';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/cataract-diagnostic-evaluation/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new evaluation</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step cataract diagnostic evaluation. One continuous single-page wizard
				across fifteen steps that grades LOCS III severity and surgical candidacy as you complete
				it, and saves the draft as you work.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/cataract-diagnostic-evaluation/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse recorded evaluations with their LOCS III severity per eye, computed and final
				surgical candidacy, and safety flags, and filter by any of them.
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
					A comprehensive ophthalmic evaluation used to confirm the presence of a cataract, grade
					its severity against the validated LOCS III (Lens Opacities Classification System III)
					instrument, assess its functional impact on the patient's daily life, rule out competing
					posterior-segment pathology (glaucoma, age-related macular degeneration, diabetic
					retinopathy), and determine surgical candidacy. Performed by an optometrist or
					ophthalmologist. The full evaluation typically takes 1 to 2 hours, because it requires
					pupil dilation and precise structural measurements of the eye.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Scoring</dt>
				<dd class="mt-1 text-base-content/70">
					LOCS III grades four subscales (Nuclear Opalescence, Nuclear Colour, Cortical, Posterior
					Subcapsular) per eye on a continuous 0.1-step decimal scale. This form's own operational
					simplification collapses the four subscores into a mild / moderate / severe severity
					band per eye, which — together with best-corrected visual acuity and glare testing —
					drives a computed surgical-candidacy recommendation by max-grade: the worse eye and the
					worse test always set the band. Safety flags are computed independently and are never
					suppressed by a clinician override.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Clinician override</dt>
				<dd class="mt-1 text-base-content/70">
					The engine produces a computed LOCS III severity band per eye and a computed
					surgical-candidacy recommendation. The clinician may override the final
					surgical-candidacy recommendation with a documented reason; both the computed and final
					values are stored and shown in the report, so the audit trail is preserved.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the grading engine, and the
					safety-flag rules. The same pure engine grades both the form and the dashboard, and the
					HTML front-end runs an identical implementation.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Status</dt>
				<dd class="mt-1 text-base-content/70">
					Clinical decision support. It does not make a diagnosis and does not replace the clinical
					judgement of an optometrist or ophthalmologist, who must sign the evaluation before the
					report is final.
				</dd>
			</div>
		</dl>
	</section>
</main>
