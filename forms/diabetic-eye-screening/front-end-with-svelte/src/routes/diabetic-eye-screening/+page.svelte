<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the screening form and the clinician
	// dashboard.
	const plural = 'diabetic-eye-screenings';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Diabetic Eye Screening</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Diabetic eye screening record</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A structured record of a UK NHS Diabetic Eye Screening Programme retinal screening episode,
			completed as a single continuous wizard that classifies the <strong>worst-eye result</strong>
			across both eyes and derives a <strong>recall interval or referral pathway</strong>.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/diabetic-eye-screening/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new screening</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step screening record. One continuous single-page wizard that classifies
				the worst-eye outcome and recall pathway on submit.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/diabetic-eye-screening/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse screened patients with their computed worst-eye grades, recall / referral outcome,
				and safety flags, and filter by outcome and referral.
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
					Capture a grader's per-eye decision — the retinopathy (R) grade, maculopathy (M) grade,
					photocoagulation (P) marker, and ungradable (U) marker — and produce a classified report —
					the worst-eye grade, the recall / referral outcome (urgent ophthalmology, hospital eye
					service, slit-lamp, surveillance, or routine recall), and flagged issues — to support
					timely surveillance and referral under the programme pathway. This is a documentation and
					result-classification form: there is no numeric score.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the gated first-match
					worst-eye classification engine, and the flag rules. The same engine grades both the form
					and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from the NHS Diabetic Eye Screening Programme grading definitions (R0-R3, M0-M1, P,
					U) and pathway standards. A screening classification is not a diagnosis and does not
					interpret raw images.
				</dd>
			</div>
		</dl>
	</section>
</main>
