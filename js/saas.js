document.addEventListener('DOMContentLoaded', () => {
  initSaaSPanel();
});

function initSaaSPanel() {
  // Pricing toggle elements
  const billingCheckbox = document.getElementById('pricing-billing-checkbox');
  const pricePro = document.getElementById('price-pro');
  const periodPro = document.getElementById('period-pro');
  const billingLabels = document.querySelectorAll('.pricing-toggle-label');

  // ROI Calculator elements
  const sliderTeam = document.getElementById('slider-team');
  const valTeam = document.getElementById('val-team');
  const sliderHours = document.getElementById('slider-hours');
  const valHours = document.getElementById('val-hours');
  const valSavings = document.getElementById('roi-savings');
  const valTime = document.getElementById('roi-time');

  // 1. Pricing Billing Switcher logic
  if (billingCheckbox) {
    billingCheckbox.addEventListener('change', () => {
      const isAnnual = billingCheckbox.checked;

      // Update labels active class styling
      billingLabels.forEach(lbl => lbl.classList.toggle('active'));

      // Pricing numbers update with smooth counter animation
      if (isAnnual) {
        animatePrice(pricePro, 800);
        if (periodPro) periodPro.textContent = '/audit (billed annually)';
      } else {
        animatePrice(pricePro, 1200);
        if (periodPro) periodPro.textContent = '/audit';
      }
    });
  }

  // Smooth price number animation
  function animatePrice(element, endVal) {
    if (!element) return;
    const startVal = parseInt(element.textContent.replace(/[$,]/g, '')) || 0;
    let currentVal = startVal;
    
    // Choose step size dynamically for faster animation of large numbers
    const diff = endVal - startVal;
    if (diff === 0) return;
    
    const stepsCount = 20;
    const step = Math.ceil(diff / stepsCount);
    const duration = 200; // ms
    const delay = duration / stepsCount;

    const timer = setInterval(() => {
      currentVal += step;
      // Clamp values
      if ((step > 0 && currentVal >= endVal) || (step < 0 && currentVal <= endVal)) {
        currentVal = endVal;
        clearInterval(timer);
      }
      element.textContent = `$${currentVal.toLocaleString()}`;
    }, delay);
  }

  // 2. ROI Calculator logic
  function calculateROI() {
    if (!sliderTeam || !sliderHours || !valSavings || !valTime) return;

    const endpoints = parseInt(sliderTeam.value);
    const auditDepth = parseInt(sliderHours.value);

    if (valTeam) valTeam.textContent = endpoints;
    if (valHours) valHours.textContent = auditDepth;

    // ROI Math Formulas
    // Estimate vulnerability density based on team size / endpoint count and depth selection
    const vulnerabilitiesFound = Math.floor(endpoints * (auditDepth / 5) * 0.8) + 1;
    const averageBreachCostSaved = vulnerabilitiesFound * 4200; // Average cost avoided per security gap patched

    // Set numbers
    valTime.textContent = `${vulnerabilitiesFound} vulnerabilities`;
    valSavings.textContent = `$${averageBreachCostSaved.toLocaleString()}`;
  }

  if (sliderTeam && sliderHours) {
    sliderTeam.addEventListener('input', calculateROI);
    sliderHours.addEventListener('input', calculateROI);
    
    // Initial run
    calculateROI();
  }
}
