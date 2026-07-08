<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the intake form and the clinician
	// dashboard. The collection routes (`/patient-intakes` and
	// `/patient-intakes/new`) hold the actual functionality.
	const plural = 'patient-intakes';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Patient Intake</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">General patient intake</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A general patient intake completed as a single continuous wizard: personal information,
			insurance and ID, reason for visit, medical history, current medications, allergies, family
			history, social history, review of systems, and consent and preferences. The shared engine
			classifies the patient into a low / medium / high risk level and flags safety-critical and
			administrative issues for the clinician.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/patient-intake/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new intake</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step intake form. One continuous single-page wizard that classifies the
				patient as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/patient-intake/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse intake records with their computed risk level, visit urgency, and safety flags, and
				filter by risk level and urgency.
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
					Capture a structured patient profile at registration and produce a graded report — a risk
					level and flagged issues — to support clinical triage and care planning.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the risk-classification engine,
					and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Risk stratification: Low = minimal risk factors, Medium = some risk factors present, High =
					significant risk factors requiring attention.
				</dd>
			</div>
		</dl>
	</section>
</main>
