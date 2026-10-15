(() => {
  const config = window.DG_CLUB_CONFIG || {};
  const waNumber = '24264742678';
  const form = document.querySelector('[data-contact-form]');
  const status = document.querySelector('[data-form-status]');
  const formHelp = form?.querySelector('[data-form-help]');
  const formEndpoint = typeof config.formspreeEndpoint === 'string' ? config.formspreeEndpoint.trim() : '';
  const formspreeReady = /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(formEndpoint);

  if (form && status) {
    const submit = form.querySelector('[type="submit"]');
    if (formspreeReady && submit) submit.innerHTML = 'Envoyer ma demande <span aria-hidden="true">↗</span>';
    if (formspreeReady && formHelp) formHelp.textContent = 'En cliquant sur le bouton, votre demande sera transmise à DG Club.';
    form.addEventListener('submit', async event => {
      event.preventDefault();
      status.textContent = '';
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const phone = String(data.get('whatsapp') || '').trim();
      const situation = String(data.get('situation') || '').trim();
      const offers = data.getAll('offre');

      if (formspreeReady) {
        const originalLabel = submit ? submit.textContent : '';
        if (submit) { submit.disabled = true; submit.textContent = 'Envoi en cours…'; }
        try {
          const response = await fetch(formEndpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
          if (!response.ok) throw new Error('Formspree indisponible');
          form.reset();
          status.textContent = 'Votre demande a été transmise. DG Club pourra vous répondre par e-mail ou WhatsApp.';
          if (typeof window.gtag === 'function') window.gtag('event', 'contact_form_sent', { form_provider: 'formspree' });
        } catch (_) {
          status.textContent = 'L’envoi automatique a échoué. Contactez DG Club directement sur WhatsApp ou par e-mail.';
        } finally {
          if (submit) { submit.disabled = false; submit.innerHTML = originalLabel; }
        }
        return;
      }

      const text = [
        'Bonjour DG Club, je souhaite demander mon audit gratuit de 15 minutes pour clarifier ma présence en ligne.',
        `Nom : ${name}`,
        `E-mail : ${email}`,
        phone ? `WhatsApp : ${phone}` : '',
        situation ? `Objectif : ${situation}` : '',
        offers.length ? `Offre(s) : ${offers.join(', ')}` : ''
      ].filter(Boolean).join('\n');
      const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();
      status.textContent = 'WhatsApp s’ouvre avec votre message prérempli. Vous pourrez le relire et le modifier avant de l’envoyer.';
      if (typeof window.gtag === 'function') window.gtag('event', 'contact_whatsapp_opened');
    });
  }

  const consentBanner = document.querySelector('[data-analytics-consent]');
  const acceptButton = document.querySelector('[data-consent-accept]');
  const rejectButton = document.querySelector('[data-consent-reject]');
  const openConsent = document.querySelector('[data-open-consent]');
  const gaId = typeof config.gaMeasurementId === 'string' ? config.gaMeasurementId.trim() : '';
  const validGaId = /^G-[A-Z0-9]{6,}$/i.test(gaId);
  let analyticsLoaded = false;

  const loadAnalytics = () => {
    if (!validGaId || analyticsLoaded) return;
    analyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', gaId, { anonymize_ip: true });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
    script.onerror = () => { analyticsLoaded = false; };
    document.head.appendChild(script);
  };

  if (validGaId && consentBanner) {
    if (openConsent) openConsent.hidden = false;
    let saved = null;
    try { saved = localStorage.getItem('dgclub-analytics-consent'); } catch (_) { /* Le bandeau reste utilisable sans stockage. */ }
    if (saved === 'granted') loadAnalytics();
    else if (saved !== 'denied') consentBanner.hidden = false;

    acceptButton?.addEventListener('click', () => {
      try { localStorage.setItem('dgclub-analytics-consent', 'granted'); } catch (_) {}
      consentBanner.hidden = true;
      loadAnalytics();
    });
    rejectButton?.addEventListener('click', () => {
      try { localStorage.setItem('dgclub-analytics-consent', 'denied'); } catch (_) {}
      consentBanner.hidden = true;
    });
    openConsent?.addEventListener('click', () => {
      consentBanner.hidden = false;
      acceptButton?.focus();
    });
  } else {
    if (consentBanner) consentBanner.hidden = true;
    if (openConsent) openConsent.hidden = true;
  }
})();
