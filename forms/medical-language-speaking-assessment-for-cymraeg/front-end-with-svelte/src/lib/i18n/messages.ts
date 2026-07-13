// i18n message catalogue for the Cymraeg clinical-speaking assessment shell.
//
// This is the repo's i18n pilot (see `docs/i18n.md`): a thin, typed message
// layer that resolves semantic keys to the active locale's string. Only the
// front-end *chrome* — the welcome page and layout nav — is translated here.
// Clinical/step content and the scoring engine are intentionally out of scope
// and stay in their source language.
//
// `en` is the source locale (en-GB) and the fallback; `cy` is Welsh (Cymraeg).
// Keys are semantic and locale-invariant; the strings are data.

/** Supported UI locales: English (source) and Welsh. */
export type Locale = 'en' | 'cy';

/** The shape every locale catalogue must satisfy (the message contract). */
export interface Messages {
	/** Document/app title (browser tab + nav). */
	appTitle: string;
	/** Short brand shown at the left of the nav bar. */
	brand: string;
	/** Nav link: welcome/home. */
	navWelcome: string;
	/** Nav link: start a new assessment. */
	navNewAssessment: string;
	/** Nav link: exam-admin dashboard. */
	navDashboard: string;
	/** Accessible label for the theme switcher. */
	themeLabel: string;
	/** Accessible label for the locale switcher. */
	localeLabel: string;
	/** Small kicker above the page heading (the title in the *other* language). */
	eyebrow: string;
	/** Welcome-page main heading. */
	pageTitle: string;
	/** Welcome-page introductory paragraph. */
	intro: string;
	/** "Start a new assessment" card heading. */
	startNewAssessment: string;
	/** "Start a new assessment" card body. */
	startBody: string;
	/** "Start a new assessment" card call-to-action. */
	startCta: string;
	/** Dashboard card heading. */
	dashboardTitle: string;
	/** Dashboard card body. */
	dashboardBody: string;
	/** Dashboard card call-to-action. */
	dashboardCta: string;
	/** "About this work" section heading. */
	aboutThisWork: string;
	/** "Purpose" term. */
	purpose: string;
	/** "Purpose" definition. */
	purposeBody: string;
	/** "Specification" term. */
	specification: string;
	/** "Specification" definition. */
	specificationBody: string;
	/** "Documentation" term. */
	documentation: string;
	/** "Documentation" definition. */
	documentationBody: string;
}

/** A valid message key. */
export type MessageKey = keyof Messages;

/** The per-locale message catalogues. `en` is the source-of-truth/fallback. */
export const messages: Record<Locale, Messages> = {
	en: {
		appTitle: 'Medical Language Speaking Assessment for Cymraeg',
		brand: 'Cymraeg Clinical Speaking',
		navWelcome: 'Welcome',
		navNewAssessment: 'New assessment',
		navDashboard: 'Dashboard',
		themeLabel: 'Theme',
		localeLabel: 'Language',
		eyebrow: 'Asesiad Siarad Iaith Feddygol — Cymraeg',
		pageTitle: 'Medical Language Speaking Assessment for Cymraeg',
		intro:
			'A clinical Welsh-language (Cymraeg) speaking assessment for healthcare professionals working ' +
			'with Welsh-speaking patients, completed as a single continuous wizard: candidate details, two ' +
			'role-plays (Sgwrs gyda Chlaf and Esboniad Clinigol), per-criterion ratings, and overall ' +
			'feedback. The shared engine grades fluency, grammar, pronunciation, and clinical ' +
			'appropriateness, scores the five clinical-communication indicators, and maps the result to a ' +
			'CEFR-aligned grade (A-E) with a 0-500 scaled score and flagged issues, aligned to the NHS Wales ' +
			'"More Than Just Words" framework.',
		startNewAssessment: 'Start a new assessment',
		startBody:
			'Open the step-by-step examiner form. One continuous single-page wizard that grades the ' +
			'candidate as you complete it.',
		startCta: 'Open the form →',
		dashboardTitle: 'Exam-admin dashboard',
		dashboardBody:
			'Browse assessed candidates with their computed CEFR-mapped grade, scaled score, and ' +
			'linguistic / clinical totals, and filter by grade and clinical threshold.',
		dashboardCta: 'Open the dashboard →',
		aboutThisWork: 'About this work',
		purpose: 'Purpose',
		purposeBody:
			'Capture a structured Welsh-language clinical-speaking profile and produce a graded report — ' +
			'CEFR-mapped grade, scaled score, per-criterion breakdown, and flagged issues — to support ' +
			'NHS Wales Welsh-essential role decisions.',
		specification: 'Specification',
		specificationBody:
			'Spec-driven: the living domain spec defines the data model, the OET-style CEFR-mapped ' +
			'grading engine, and the flag rules. The same engine grades both the form and the dashboard.',
		documentation: 'Documentation',
		documentationBody:
			'Aligned to the NHS Wales "More Than Just Words" framework and the Welsh Language Standards, ' +
			'with CEFR-mapped bands parallel to the OET Medicine grades.'
	},
	cy: {
		appTitle: 'Asesiad Siarad Iaith Feddygol ar gyfer Cymraeg',
		brand: 'Siarad Clinigol Cymraeg',
		navWelcome: 'Croeso',
		navNewAssessment: 'Asesiad newydd',
		navDashboard: 'Dangosfwrdd',
		themeLabel: 'Thema',
		localeLabel: 'Iaith',
		eyebrow: 'Medical Language Speaking Assessment — Cymraeg',
		pageTitle: 'Asesiad Siarad Iaith Feddygol ar gyfer Cymraeg',
		intro:
			'Asesiad siarad Cymraeg clinigol ar gyfer gweithwyr gofal iechyd proffesiynol sy’n gweithio ' +
			'gyda chleifion sy’n siarad Cymraeg, wedi’i gwblhau fel un dewin di-dor: manylion yr ' +
			'ymgeisydd, dwy sesiwn chwarae rôl (Sgwrs gyda Chlaf ac Esboniad Clinigol), sgoriau fesul maen ' +
			'prawf, ac adborth cyffredinol. Mae’r injan a rennir yn graddio rhuglder, gramadeg, ynganu, ' +
			'a phriodoldeb clinigol, yn sgorio’r pum dangosydd cyfathrebu clinigol, ac yn mapio’r ' +
			'canlyniad i radd sy’n cyd-fynd â’r CEFR (A-E) gyda sgôr wedi’i graddio 0-500 a ' +
			'materion wedi’u fflagio, yn unol â fframwaith “Mwy na Geiriau” GIG Cymru.',
		startNewAssessment: 'Dechrau asesiad newydd',
		startBody:
			'Agorwch y ffurflen arholwr gam wrth gam. Un dewin un dudalen di-dor sy’n graddio’r ' +
			'ymgeisydd wrth i chi ei chwblhau.',
		startCta: 'Agor y ffurflen →',
		dashboardTitle: 'Dangosfwrdd gweinyddu arholiadau',
		dashboardBody:
			'Porwch ymgeiswyr a aseswyd gyda’u gradd wedi’i mapio i’r CEFR, sgôr wedi’i ' +
			'graddio, a chyfansymiau ieithyddol / clinigol, a hidlo yn ôl gradd a throthwy clinigol.',
		dashboardCta: 'Agor y dangosfwrdd →',
		aboutThisWork: 'Ynglŷn â’r gwaith hwn',
		purpose: 'Diben',
		purposeBody:
			'Casglu proffil siarad clinigol Cymraeg strwythuredig a chynhyrchu adroddiad graddedig — gradd ' +
			'wedi’i mapio i’r CEFR, sgôr wedi’i graddio, dadansoddiad fesul maen prawf, a ' +
			'materion wedi’u fflagio — i gefnogi penderfyniadau GIG Cymru am rolau lle mae’r Gymraeg ' +
			'yn hanfodol.',
		specification: 'Manyleb',
		specificationBody:
			'Yn seiliedig ar fanyleb: mae’r fanyleb barhaus yn diffinio’r model data, yr injan ' +
			'raddio wedi’i mapio i’r CEFR yn arddull OET, a’r rheolau fflagio. Mae’r un ' +
			'injan yn graddio’r ffurflen a’r dangosfwrdd.',
		documentation: 'Dogfennaeth',
		documentationBody:
			'Yn cyd-fynd â fframwaith “Mwy na Geiriau” GIG Cymru a Safonau’r Gymraeg, gyda ' +
			'bandiau wedi’u mapio i’r CEFR yn gyfochrog â graddau OET Meddygaeth.'
	}
};
