const form = document.querySelector('#housing-application');
const panels = [...document.querySelectorAll('[data-step]')];
const progress = [...document.querySelectorAll('.progress-list li')];
const back = document.querySelector('[data-back]');
const next = document.querySelector('[data-next]');
const submit = document.querySelector('[data-submit]');
const errorSummary = document.querySelector('#error-summary');
let step = 1;
document.querySelector('#startedAt').value = Date.now();

function showStep(value) {
  step = value;
  panels.forEach((panel, index) => panel.hidden = index + 1 !== step);
  progress.forEach((item, index) => {
    item.classList.toggle('active', index + 1 === step);
    item.classList.toggle('complete', index + 1 < step);
  });
  back.hidden = step === 1;
  next.hidden = step === 6;
  submit.hidden = step !== 6;
  errorSummary.hidden = true;
  document.querySelector('.form-area').scrollIntoView({ behavior: 'smooth', block: 'start' });
  panels[step - 1].querySelector('h2').focus?.();
  if (step === 6) buildReview();
}

function validatePanel() {
  const fields = [...panels[step - 1].querySelectorAll('input,select,textarea')];
  const invalid = fields.find(field => !field.checkValidity());
  fields.forEach(field => field.removeAttribute('aria-invalid'));
  if (invalid) {
    invalid.setAttribute('aria-invalid', 'true');
    errorSummary.textContent = 'Please complete the required information before continuing.';
    errorSummary.hidden = false;
    invalid.reportValidity();
    invalid.focus();
    return false;
  }
  return true;
}

function value(name) {
  const data = new FormData(form);
  return data.get(name) || 'Not provided';
}

function buildReview() {
  const sections = [
    ['About You', [['Name', value('fullName')], ['Phone', value('phone')], ['Email', value('email')], ['Date of birth', value('birthDate')], ['Contact preference', value('contactMethod')]]],
    ['Housing Need', [['Applying for', value('applyingFor')], ['Move-in timeframe', value('moveIn')], ['Current situation', value('currentHousing')]]],
    ['Independent Living', [['Lives independently', value('independent')], ['Manages medications', value('medications')], ['Purchases and prepares food', value('food')], ['Circumstance', value('circumstance')]]],
    ['Income', [['Dependable monthly income', value('dependableIncome')], ['Income source', value('incomeSource')]]],
    ['Additional Information', [['Housing needs', value('additional')]]]
  ];
  document.querySelector('#review').innerHTML = sections.map(([title, rows]) => `<div class="review-section"><h3>${escapeHtml(title)}</h3>${rows.map(([label, content]) => `<div class="review-row"><b>${escapeHtml(label)}</b><span>${escapeHtml(content)}</span></div>`).join('')}</div>`).join('');
}

function escapeHtml(input) { const div = document.createElement('div'); div.textContent = input; return div.innerHTML; }
next.addEventListener('click', () => { if (validatePanel()) showStep(step + 1); });
back.addEventListener('click', () => showStep(step - 1));
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!validatePanel()) return;
  submit.disabled = true; submit.textContent = 'Submitting…';
  try {
    const endpoint = window.TCL_CONFIG?.applicationEndpoint;
    if (!endpoint || !endpoint.startsWith('https://')) throw new Error('Application delivery has not been configured yet.');
    const response = await fetch(endpoint, { method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(form) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || (result.errors && result.errors[0]?.message) || 'Unable to submit the application.');
    form.hidden = true;
    const success = document.querySelector('#success'); success.hidden = false; success.focus();
  } catch (error) {
    errorSummary.textContent = `${error.message} Please try again or return later.`;
    errorSummary.hidden = false;
    submit.disabled = false; submit.textContent = 'Submit Application';
  }
});
