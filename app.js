// ========== AI TUTOR WIDGET ==========
(function () {
  // ============================================================
  // PUBLIC DEPLOYMENT — AI tutor endpoint
  // When hosted on elufisantemidayo.com, set this to your
  // Cloudflare Worker URL (see DEPLOY.md). Locally / in preview,
  // leave null to fall back to window.claude.complete.
  // ============================================================
  const TUTOR_ENDPOINT = null; // e.g. "https://tutor.elufisantemidayo.com/chat"

  const SYSTEM_PROMPT = `You are Dr. Elufisan's teaching assistant — an AI tutor embedded on his personal academic website. Dr. Temidayo Oluyomi Elufisan (Sc.D) is an independent microbiologist and biotechnologist whose research covers next-generation sequencing, bacterial genome assembly and annotation, antimicrobial resistance, bacterial sphingolipids, and environmental microbiology (including Stenotrophomonas, Bdellovibrio, Caulobacter crescentus, Bacillus cereus PHA, and foodborne parasites).

You help visitors — especially students and science-curious readers — understand topics in:
- Next-generation sequencing (Illumina, Nanopore basics, read QC)
- Bacterial genome assembly, annotation and comparative analysis (SPAdes, Velvet, Prokka, Bakta)
- Introductory and applied microbiology (culture, PCR, 16S rRNA, antibiotic susceptibility)
- Bioinformatics workflows relevant to Dr. Elufisan's work

Style:
- Be concise (2-6 short paragraphs or a short numbered list).
- Use plain language first, then add the technical term in parentheses.
- If the question is clearly outside microbiology / bioinformatics / Dr. Elufisan's scope, politely redirect.
- Never invent publications or credentials for Dr. Elufisan.
- If asked "how can I contact him", point to the Contact section on this page.`;

  const messages = [];

  function $(id) { return document.getElementById(id); }

  function render() {
    const body = $('tutor-body');
    body.innerHTML = messages.map(m => `
      <div class="tutor-msg ${m.role}">
        <div class="who">${m.role === 'user' ? 'you' : 'tutor // dr. e'}</div>
        <div class="text">${m.role === 'assistant' ? m.text : escapeHtml(m.text)}</div>
      </div>
    `).join('');
    if (window.__tutorTyping) {
      body.innerHTML += `<div class="tutor-typing">thinking</div>`;
    }
    body.scrollTop = body.scrollHeight;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
  }

  async function callBackend(apiMsgs) {
    if (TUTOR_ENDPOINT) {
      const r = await fetch(TUTOR_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system: SYSTEM_PROMPT, messages: apiMsgs })
      });
      if (!r.ok) throw new Error('endpoint ' + r.status);
      const data = await r.json();
      return data.reply || data.content || '';
    }
    if (window.claude && window.claude.complete) {
      const stitched = [{
        role: 'user',
        content: SYSTEM_PROMPT + '\n\n---\nBegin conversation. First user message:\n' + apiMsgs[0].content
      }].concat(apiMsgs.slice(1));
      return await window.claude.complete({ messages: stitched });
    }
    return "The AI tutor isn't wired up on this deployment yet. Please email ptemidayo@gmail.com — Dr. Elufisan will be happy to answer directly.";
  }

  async function send(text) {
    if (!text.trim()) return;
    messages.push({ role: 'user', text });
    window.__tutorTyping = true;
    render();
    $('tutor-send').disabled = true;

    try {
      const apiMsgs = messages.map(m => ({ role: m.role, content: m.text }));
      const reply = await callBackend(apiMsgs);
      messages.push({ role: 'assistant', text: formatReply(reply) });
    } catch (e) {
      messages.push({ role: 'assistant', text: `<span style="color:var(--plasma)">error:</span> could not reach the tutor. please try again or email ptemidayo@gmail.com directly.` });
    } finally {
      window.__tutorTyping = false;
      $('tutor-send').disabled = false;
      render();
    }
  }

  function formatReply(s) {
    let out = escapeHtml(s);
    out = out.replace(/`([^`]+)`/g, '<code style="font-family:var(--mono);background:var(--culture-soft);padding:1px 4px;">$1</code>');
    return out;
  }

  window.__initTutor = function () {
    const root = $('tutor');
    $('tutor-open').addEventListener('click', () => {
      root.classList.add('open');
      if (messages.length === 0) {
        messages.push({ role: 'assistant', text: `Hi — I'm a teaching assistant for Dr. Elufisan's site. Ask me anything about bacterial genome assembly, NGS, antimicrobial resistance, or any topic he teaches. What are you working on?` });
        render();
      }
      setTimeout(() => $('tutor-input').focus(), 50);
    });
    $('tutor-close').addEventListener('click', () => root.classList.remove('open'));
    $('tutor-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const inp = $('tutor-input');
      const v = inp.value;
      inp.value = '';
      send(v);
    });
    document.querySelectorAll('.tutor-suggestions .sug').forEach(el => {
      el.addEventListener('click', () => {
        $('tutor-input').value = el.dataset.q;
        $('tutor-input').focus();
      });
    });
  };
})();

// ========== PUBLICATIONS FILTER/SEARCH ==========
(function () {
  window.__initPubs = function () {
    const tbody = document.getElementById('pub-body');
    const pubs = window.PUBLICATIONS || [];
    pubs.forEach((p, i) => {
      const tr = document.createElement('tr');
      tr.dataset.type = p.type;
      tr.dataset.text = (p.title + ' ' + p.authors + ' ' + p.venue).toLowerCase();
      tr.innerHTML = `
        <td class="num">${String(pubs.length - i).padStart(2,'0')}</td>
        <td class="yr">${p.y}</td>
        <td>
          <div class="title">${p.title}</div>
          <span class="venue">${p.venue}</span>
          <div class="authors">${p.authors}</div>
        </td>
        <td class="type">${p.type}</td>
      `;
      tbody.appendChild(tr);
    });

    const search = document.getElementById('pub-search');
    const chips = document.querySelectorAll('.pub-chip');
    let activeType = 'all';

    function apply() {
      const q = (search.value || '').toLowerCase().trim();
      let shown = 0;
      tbody.querySelectorAll('tr').forEach(tr => {
        const matchType = activeType === 'all' || tr.dataset.type === activeType;
        const matchQ = !q || tr.dataset.text.includes(q);
        const show = matchType && matchQ;
        tr.classList.toggle('hidden', !show);
        if (show) shown++;
      });
      document.getElementById('pub-count').textContent = `${shown} of ${pubs.length}`;
    }
    search.addEventListener('input', apply);
    chips.forEach(c => c.addEventListener('click', () => {
      chips.forEach(x => x.classList.remove('on'));
      c.classList.add('on');
      activeType = c.dataset.type;
      apply();
    }));
    apply();
  };
})();

// ========== CONTACT FORM (mailto fallback) ==========
(function () {
  window.__initContact = function () {
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = fd.get('name') || '';
      const email = fd.get('email') || '';
      const topic = fd.get('topic') || 'general';
      const msg = fd.get('message') || '';
      const body = encodeURIComponent(`From: ${name} <${email}>\nTopic: ${topic}\n\n${msg}`);
      const subj = encodeURIComponent(`[elufisantemidayo.com] ${topic} — ${name}`);
      window.location.href = `mailto:ptemidayo@gmail.com?subject=${subj}&body=${body}`;
      document.getElementById('form-msg').classList.add('show');
      document.getElementById('form-msg').textContent = '✓ message handed to your mail client — awaiting send';
    });
  };
})();

// ========== CLOCK ==========
(function () {
  window.__initClock = function () {
    const el = document.getElementById('clock');
    if (!el) return;
    function tick() {
      const d = new Date();
      const iso = d.toISOString().replace('T',' ').slice(0,19);
      el.textContent = iso + ' UTC';
    }
    tick(); setInterval(tick, 1000);
  };
})();

// ========== TWEAKS PANEL ==========
(function () {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "accent": "agar",
    "density": "normal",
    "serif_headings": true,
    "ascii_deco": true
  }/*EDITMODE-END*/;

  const ACCENTS = {
    agar:    { primary: "oklch(0.58 0.13 145)", dark: "oklch(0.42 0.11 145)", soft: "oklch(0.88 0.05 145)", label: "agar green" },
    dna:     { primary: "oklch(0.52 0.14 245)", dark: "oklch(0.38 0.12 245)", soft: "oklch(0.88 0.04 245)", label: "dna blue" },
    culture: { primary: "oklch(0.62 0.14 75)",  dark: "oklch(0.46 0.12 75)",  soft: "oklch(0.92 0.06 75)",  label: "culture amber" },
    plasma:  { primary: "oklch(0.58 0.18 25)",  dark: "oklch(0.44 0.16 25)",  soft: "oklch(0.90 0.05 25)",  label: "plasma red" },
  };

  let state = { ...TWEAK_DEFAULTS };

  function applyState() {
    const a = ACCENTS[state.accent] || ACCENTS.agar;
    const r = document.documentElement;
    r.style.setProperty('--agar', a.primary);
    r.style.setProperty('--agar-dark', a.dark);
    r.style.setProperty('--agar-soft', a.soft);
    document.body.dataset.density = state.density;
    if (!state.serif_headings) {
      r.style.setProperty('--serif', 'var(--sans)');
    } else {
      r.style.setProperty('--serif', '"IBM Plex Serif", Georgia, serif');
    }
  }

  function renderPanel() {
    const p = document.getElementById('tweaks-panel');
    p.innerHTML = `
      <h4>Tweaks <button id="tw-close">×</button></h4>
      <div class="tweak-row">
        <label>Accent hue</label>
        <div class="swatches">
          ${Object.entries(ACCENTS).map(([k,v]) => `
            <div class="sw ${state.accent===k?'on':''}" data-accent="${k}" title="${v.label}" style="background:${v.primary}"></div>
          `).join('')}
        </div>
      </div>
      <div class="tweak-row">
        <label>Density</label>
        <select id="tw-density">
          <option value="compact" ${state.density==='compact'?'selected':''}>compact</option>
          <option value="normal"  ${state.density==='normal' ?'selected':''}>normal</option>
          <option value="roomy"   ${state.density==='roomy'  ?'selected':''}>roomy</option>
        </select>
      </div>
      <div class="tweak-row toggle-row">
        <label style="margin:0">Serif headings</label>
        <input type="checkbox" id="tw-serif" ${state.serif_headings?'checked':''}>
      </div>
      <div class="tweak-row toggle-row">
        <label style="margin:0">ASCII decorations</label>
        <input type="checkbox" id="tw-ascii" ${state.ascii_deco?'checked':''}>
      </div>
    `;
    document.getElementById('tw-close').onclick = () => { document.getElementById('tweaks-panel').classList.remove('open'); };
    p.querySelectorAll('.sw').forEach(el => el.onclick = () => {
      state.accent = el.dataset.accent; applyState(); renderPanel(); persist();
    });
    document.getElementById('tw-density').onchange = (e) => { state.density = e.target.value; applyState(); persist(); };
    document.getElementById('tw-serif').onchange = (e) => { state.serif_headings = e.target.checked; applyState(); persist(); };
    document.getElementById('tw-ascii').onchange = (e) => { state.ascii_deco = e.target.checked; applyState(); persist(); };
  }

  function persist() {
    try {
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { ...state } }, '*');
    } catch (e) {}
  }

  window.addEventListener('message', (e) => {
    if (!e.data || !e.data.type) return;
    if (e.data.type === '__activate_edit_mode') {
      renderPanel();
      document.getElementById('tweaks-panel').classList.add('open');
    } else if (e.data.type === '__deactivate_edit_mode') {
      document.getElementById('tweaks-panel').classList.remove('open');
    }
  });

  window.__initTweaks = function () {
    applyState();
    try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch (e) {}
  };
})();

// ========== SMOOTH ANCHOR NAV ==========
(function () {
  window.__initNav = function () {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          window.scrollTo({ top: target.offsetTop - 60, behavior: 'smooth' });
          history.replaceState(null, '', '#' + id);
        }
      });
    });
  };
})();
