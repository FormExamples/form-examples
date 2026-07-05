// Accessibility toolbar for the Neurodiversity Adjustment front-end.
//
// A neurodiversity form should itself be exemplary for neurodivergent users.
// This module is self-contained: it injects its own toolbar, so a single
// `<script src="js/a11y.js">` include works on both the wizard (index.html) and
// the dashboard (dashboard.html). It layers on progressive enhancement — the
// page is fully usable if this script never runs.
//
// Features: comfortable reading mode (increased spacing + a dyslexia-friendly
// font stack), a text-size control, read-aloud (Web Speech API) of the current
// selection or the page introduction, and a "start over" control that clears
// the saved draft. Reduced motion is handled in CSS. Preferences persist in
// localStorage under a user-level key shared across the request and response
// forms.
//
// Wrapped in an IIFE; exposes nothing globally except an idempotent init.

(function () {
'use strict';

var PREFS_KEY = 'neurodiversity-adjustment.a11y.v1';
var SCALES = ['normal', 'large', 'xlarge'];
var SCALE_LABELS = { normal: 'Standard', large: 'Large', xlarge: 'Extra large' };

/** Load saved preferences, tolerating older / missing state. */
function loadPrefs() {
  try {
    var raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return { comfortable: false, scale: 'normal' };
    var p = JSON.parse(raw);
    return {
      comfortable: p.comfortable === true,
      scale: SCALES.indexOf(p.scale) >= 0 ? p.scale : 'normal'
    };
  } catch (e) {
    return { comfortable: false, scale: 'normal' };
  }
}

/** Persist preferences (best-effort). */
function savePrefs(prefs) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch (e) {
    /* ignore quota / privacy-mode errors */
  }
}

/** Apply preferences to the document root so CSS can react. */
function applyPrefs(prefs) {
  var root = document.documentElement;
  root.classList.toggle('a11y-comfortable', prefs.comfortable);
  root.setAttribute('data-a11y-scale', prefs.scale);
}

/** Build a labelled toolbar button. */
function makeButton(label, title) {
  var b = document.createElement('button');
  b.type = 'button';
  b.className = 'a11y-btn';
  b.textContent = label;
  if (title) b.setAttribute('title', title);
  return b;
}

/** Read the current text selection, or fall back to the page introduction. */
function textToRead() {
  var sel = window.getSelection && window.getSelection().toString().trim();
  if (sel) return sel;
  var parts = [];
  var h1 = document.querySelector('h1');
  if (h1) parts.push(h1.textContent);
  var intro = document.querySelector('.intro');
  if (intro) parts.push(intro.textContent);
  var subtitle = document.querySelector('.subtitle');
  if (!intro && subtitle) parts.push(subtitle.textContent);
  return parts.join('. ').replace(/\s+/g, ' ').trim();
}

function init() {
  if (document.getElementById('a11y-bar')) return; // idempotent
  var prefs = loadPrefs();
  applyPrefs(prefs);

  var bar = document.createElement('div');
  bar.id = 'a11y-bar';
  bar.className = 'a11y-bar';
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-label', 'Accessibility options');

  var label = document.createElement('span');
  label.className = 'a11y-bar-label';
  label.textContent = 'Accessibility:';
  bar.appendChild(label);

  // --- Comfortable reading mode -------------------------------------
  var comfort = makeButton(
    'Reading comfort',
    'Increase spacing and use a dyslexia-friendly font'
  );
  comfort.setAttribute('aria-pressed', String(prefs.comfortable));
  comfort.addEventListener('click', function () {
    prefs.comfortable = !prefs.comfortable;
    comfort.setAttribute('aria-pressed', String(prefs.comfortable));
    applyPrefs(prefs);
    savePrefs(prefs);
  });
  bar.appendChild(comfort);

  // --- Text size ----------------------------------------------------
  var size = makeButton('Text size: ' + SCALE_LABELS[prefs.scale], 'Cycle the text size');
  size.addEventListener('click', function () {
    var next = (SCALES.indexOf(prefs.scale) + 1) % SCALES.length;
    prefs.scale = SCALES[next];
    size.textContent = 'Text size: ' + SCALE_LABELS[prefs.scale];
    applyPrefs(prefs);
    savePrefs(prefs);
  });
  bar.appendChild(size);

  // --- Read aloud (progressive enhancement) -------------------------
  if ('speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function') {
    var speaking = false;
    var read = makeButton('Read aloud', 'Read the selected text, or the introduction, aloud');
    var stop = function () {
      window.speechSynthesis.cancel();
      speaking = false;
      read.textContent = 'Read aloud';
      read.setAttribute('aria-pressed', 'false');
    };
    read.setAttribute('aria-pressed', 'false');
    read.addEventListener('click', function () {
      if (speaking) {
        stop();
        return;
      }
      var text = textToRead();
      if (!text) return;
      var u = new window.SpeechSynthesisUtterance(text);
      u.rate = 0.95;
      u.onend = stop;
      u.onerror = stop;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
      speaking = true;
      read.textContent = 'Stop reading';
      read.setAttribute('aria-pressed', 'true');
    });
    window.addEventListener('beforeunload', stop);
    bar.appendChild(read);
  }

  // --- Start over (only where a draft can exist) --------------------
  var draftKey = window.__A11Y_DRAFT_KEY__;
  if (draftKey) {
    var reset = makeButton('Clear saved answers', 'Clear your saved answers and begin again');
    reset.classList.add('a11y-btn-quiet');
    reset.addEventListener('click', function () {
      var ok = window.confirm(
        'Clear your saved answers and start this form again? This cannot be undone.'
      );
      if (!ok) return;
      try {
        localStorage.removeItem(draftKey);
      } catch (e) {
        /* ignore */
      }
      window.location.reload();
    });
    bar.appendChild(reset);

    var saved = document.createElement('span');
    saved.className = 'a11y-saved';
    saved.textContent = 'Your answers save automatically on this device.';
    bar.appendChild(saved);
  }

  document.body.insertBefore(bar, document.body.firstChild);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
