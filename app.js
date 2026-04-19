// ============================================================
// elufisan — shared art + nav + tutor + page logic
// ============================================================

// ---------- DECORATIVE SVG ART ----------
const ART = {
  // Helix — DNA ladder
  helix: (color1 = '#e8d596', color2 = '#c36a3b', bg = '#1f3a2e') => `
<svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="500" fill="${bg}"/>
  <g stroke="${color1}" stroke-width="1.5" fill="none">
    ${Array.from({length: 40}).map((_, i) => {
      const y = i * 12 + 10;
      const x1 = 200 + 80 * Math.sin(i * 0.32);
      const x2 = 200 - 80 * Math.sin(i * 0.32);
      return `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${i % 4 === 0 ? color2 : color1}" stroke-opacity="${0.3 + 0.6 * Math.abs(Math.sin(i * 0.32))}"/>`;
    }).join('')}
    ${Array.from({length: 200}).map((_, i) => {
      const t = i / 200 * Math.PI * 8;
      const y = i * 2.5;
      const x = 200 + 80 * Math.sin(t);
      return `<circle cx="${x}" cy="${y}" r="2" fill="${color1}" fill-opacity="0.9" stroke="none"/>`;
    }).join('')}
    ${Array.from({length: 200}).map((_, i) => {
      const t = i / 200 * Math.PI * 8;
      const y = i * 2.5;
      const x = 200 - 80 * Math.sin(t);
      return `<circle cx="${x}" cy="${y}" r="2" fill="${color2}" fill-opacity="0.9" stroke="none"/>`;
    }).join('')}
  </g>
</svg>`,

  // Petri dish — colony rings
  petri: (bg = '#f3eee4', ink = '#1f3a2e', accent = '#c36a3b') => `
<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="${bg}"/>
  <circle cx="200" cy="150" r="130" fill="none" stroke="${ink}" stroke-width="1"/>
  <circle cx="200" cy="150" r="128" fill="none" stroke="${ink}" stroke-width="0.5" opacity="0.5"/>
  <g>
    ${[[160,130,22,accent],[230,160,14,ink],[185,180,10,accent],[245,125,8,ink],[150,170,16,ink],[215,115,6,accent],[175,145,4,ink],[225,185,7,accent],[160,105,5,ink]].map(([cx,cy,r,c]) =>
      `<g><circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}" fill-opacity="0.12"/><circle cx="${cx}" cy="${cy}" r="${r*0.5}" fill="${c}" fill-opacity="0.28"/><circle cx="${cx}" cy="${cy}" r="${r*0.2}" fill="${c}" fill-opacity="0.6"/></g>`
    ).join('')}
  </g>
  <g stroke="${ink}" stroke-width="0.3" opacity="0.2">
    ${Array.from({length: 12}).map((_, i) => {
      const a = i * Math.PI / 6;
      const x1 = 200 + 60 * Math.cos(a);
      const y1 = 150 + 60 * Math.sin(a);
      const x2 = 200 + 130 * Math.cos(a);
      const y2 = 150 + 130 * Math.sin(a);
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    }).join('')}
  </g>
</svg>`,

  // Contour map — topographic lines
  contour: (bg = '#e9e2d3', ink = '#1f3a2e', accent = '#c36a3b') => `
<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="${bg}"/>
  <g fill="none" stroke="${ink}" stroke-width="0.8" opacity="0.7">
    ${Array.from({length: 14}).map((_, i) => {
      const scale = 1 - i * 0.06;
      const cx = 200 + Math.sin(i * 0.8) * 20;
      const cy = 150 + Math.cos(i * 0.6) * 10;
      const rx = 140 * scale;
      const ry = 80 * scale;
      return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${i * 3} ${cx} ${cy})"/>`;
    }).join('')}
  </g>
  <g fill="${accent}">
    <circle cx="200" cy="145" r="3"/>
  </g>
</svg>`,

  // Cells — cluster of circles
  cells: (bg = '#1f3a2e', c1 = '#e8d596', c2 = '#c36a3b', c3 = '#c8d4cc') => `
<svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="500" fill="${bg}"/>
  <g>
    ${Array.from({length: 70}).map(() => {
      const cx = Math.random() * 400;
      const cy = Math.random() * 500;
      const r = 8 + Math.random() * 28;
      const color = [c1,c2,c3][Math.floor(Math.random()*3)];
      const op = 0.15 + Math.random() * 0.4;
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" fill-opacity="${op}"/>`;
    }).join('')}
  </g>
  <g fill="none" stroke="#f3eee4" stroke-width="0.4" opacity="0.3">
    ${Array.from({length: 30}).map(() => {
      const cx = Math.random() * 400;
      const cy = Math.random() * 500;
      const r = 4 + Math.random() * 10;
      return `<circle cx="${cx}" cy="${cy}" r="${r}"/>`;
    }).join('')}
  </g>
</svg>`,

  // Waves — AGCT sequence waves
  waves: (bg = '#f3eee4', ink = '#1f3a2e', accent = '#c36a3b') => `
<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="${bg}"/>
  <g font-family="JetBrains Mono, monospace" font-size="14" fill="${ink}" opacity="0.55">
    ${Array.from({length: 18}).map((_, row) => {
      const line = Array.from({length: 40}).map(() => 'ACGT'[Math.floor(Math.random()*4)]).join(' ');
      return `<text x="10" y="${20 + row * 16}" xml:space="preserve">${line}</text>`;
    }).join('')}
  </g>
  <g stroke="${accent}" stroke-width="2" fill="none" opacity="0.8">
    <path d="M0,150 Q 100,80 200,150 T 400,150" />
    <path d="M0,180 Q 100,240 200,180 T 400,180" opacity="0.5"/>
  </g>
</svg>`,

  // Parasite — worm-like arc pattern
  worms: (bg = '#1f3a2e', c1 = '#e8d596', c2 = '#c8d4cc') => `
<svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="500" fill="${bg}"/>
  <g fill="none" stroke="${c1}" stroke-width="2" stroke-linecap="round">
    ${Array.from({length: 16}).map((_, i) => {
      const y0 = 30 + i * 30;
      const a = 0.015 + (i % 3) * 0.005;
      const phase = i * 0.7;
      const d = Array.from({length: 50}).map((_, j) => {
        const x = j * 8;
        const y = y0 + Math.sin(x * a + phase) * 12;
        return `${j===0?'M':'L'}${x},${y}`;
      }).join(' ');
      return `<path d="${d}" stroke="${i % 3 === 0 ? c2 : c1}" stroke-opacity="${0.4 + (i % 5) * 0.1}"/>`;
    }).join('')}
  </g>
</svg>`,
};

// Stenotrophomonas — rod-shaped Gram-negatives with polar flagella tuft
ART.stenotrophomonas = (bg = '#1f3a2e', rod = '#e8d596', rim = '#c36a3b', flag = '#c8d4cc') => {
  const rods = [];
  const rng = (s) => { let x = Math.sin(s) * 10000; return x - Math.floor(x); };
  for (let i = 0; i < 22; i++) {
    const cx = 40 + rng(i * 3.1) * 320;
    const cy = 40 + rng(i * 5.7 + 1) * 420;
    const angle = rng(i * 2.3 + 7) * 360;
    const len = 44 + rng(i * 7.9) * 22;
    const w = 14 + rng(i * 11.1) * 3;
    const op = 0.55 + rng(i * 13.3) * 0.4;
    // flagella tuft at one pole
    const flagLines = [];
    for (let j = 0; j < 5; j++) {
      const dev = (rng(i * 19 + j) - 0.5) * 20;
      const curl = (rng(i * 23 + j) - 0.5) * 30;
      flagLines.push(`<path d="M${len / 2},0 Q${len / 2 + 20 + dev},${curl} ${len / 2 + 42 + dev},${(rng(i * 31 + j) - 0.5) * 40}" fill="none" stroke="${flag}" stroke-width="0.8" stroke-opacity="0.65"/>`);
    }
    rods.push(`
      <g transform="translate(${cx},${cy}) rotate(${angle})" opacity="${op}">
        <rect x="-${len / 2}" y="-${w / 2}" width="${len}" height="${w}" rx="${w / 2}" ry="${w / 2}" fill="${rod}"/>
        <rect x="-${len / 2 + 0.5}" y="-${w / 2 + 0.5}" width="${len + 1}" height="${w + 1}" rx="${w / 2 + 0.5}" ry="${w / 2 + 0.5}" fill="none" stroke="${rim}" stroke-width="1" opacity="0.5"/>
        <ellipse cx="${-len / 4}" cy="0" rx="${len / 10}" ry="${w / 4}" fill="${rim}" opacity="0.35"/>
        <ellipse cx="${len / 4}" cy="-1" rx="${len / 10}" ry="${w / 5}" fill="#f3eee4" opacity="0.25"/>
        ${flagLines.join('')}
      </g>`);
  }
  return `
<svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="stenBg" cx="50%" cy="40%" r="80%">
      <stop offset="0%" stop-color="#2c5241"/>
      <stop offset="100%" stop-color="${bg}"/>
    </radialGradient>
  </defs>
  <rect width="400" height="500" fill="url(#stenBg)"/>
  <g opacity="0.12">
    ${Array.from({length: 60}).map((_,i) => {
      const cx = rng(i*7+101) * 400;
      const cy = rng(i*11+202) * 500;
      return `<circle cx="${cx}" cy="${cy}" r="${0.5 + rng(i*13)*1.5}" fill="#f3eee4"/>`;
    }).join('')}
  </g>
  ${rods.join('')}
  <g font-family="JetBrains Mono, monospace" font-size="10" fill="${flag}" opacity="0.6">
    <text x="16" y="24">Stenotrophomonas sp. Pemsol</text>
    <text x="16" y="38" opacity="0.5">Gram −, rod, 0.5 × 1.5 µm</text>
    <line x1="16" y1="476" x2="80" y2="476" stroke="${flag}" stroke-width="1"/>
    <text x="16" y="492">2 µm</text>
  </g>
</svg>`;
};

// Bdellovibrio — predator attaching to prey cell
ART.bdellovibrio = (bg = '#f3eee4', prey = '#c8d4cc', predator = '#c36a3b', forest = '#1f3a2e') => {
  const rng = (s) => { let x = Math.sin(s) * 10000; return x - Math.floor(x); };
  // big prey cells (Gram-negative rods)
  const preyCells = [
    {cx: 150, cy: 200, a: 22, rx: 90, ry: 38},
    {cx: 260, cy: 340, a: -15, rx: 75, ry: 30},
    {cx: 90, cy: 380, a: 60, rx: 55, ry: 22},
  ];
  // tiny predators (Bdellovibrio) — curved comma shape with flagellum, attaching
  const predators = [];
  for (let i = 0; i < 18; i++) {
    const cx = 40 + rng(i * 3.1) * 320;
    const cy = 40 + rng(i * 5.7 + 1) * 420;
    const angle = rng(i * 2.3 + 7) * 360;
    const scale = 0.7 + rng(i*9)*0.6;
    predators.push(`
      <g transform="translate(${cx},${cy}) rotate(${angle}) scale(${scale})">
        <!-- curved body -->
        <path d="M-14,-4 Q0,-8 14,-4 Q16,0 14,4 Q0,8 -14,4 Q-16,0 -14,-4 Z" fill="${predator}" opacity="0.92"/>
        <path d="M-14,-4 Q0,-8 14,-4 Q16,0 14,4 Q0,8 -14,4 Q-16,0 -14,-4 Z" fill="none" stroke="${forest}" stroke-width="0.8" opacity="0.55"/>
        <ellipse cx="-4" cy="-1" rx="3" ry="1.4" fill="#f3eee4" opacity="0.5"/>
        <!-- single polar flagellum, wavy -->
        <path d="M14,0 Q20,-3 24,2 Q28,7 34,-1 Q40,-7 46,2" fill="none" stroke="${forest}" stroke-width="0.9" opacity="0.7"/>
      </g>`);
  }
  // predators attached to big prey (showing the attack)
  const attached = [
    {px: 140, py: 180, rot: 210},
    {px: 230, py: 205, rot: 30},
    {px: 265, py: 315, rot: 260},
    {px: 85, py: 370, rot: 120},
  ].map(a => `
    <g transform="translate(${a.px},${a.py}) rotate(${a.rot}) scale(1.3)">
      <path d="M-14,-4 Q0,-8 14,-4 Q16,0 14,4 Q0,8 -14,4 Q-16,0 -14,-4 Z" fill="${predator}"/>
      <path d="M-14,-4 Q0,-8 14,-4 Q16,0 14,4 Q0,8 -14,4 Q-16,0 -14,-4 Z" fill="none" stroke="${forest}" stroke-width="1"/>
      <path d="M14,0 Q22,-4 28,3 Q34,10 42,-2" fill="none" stroke="${forest}" stroke-width="1" opacity="0.7"/>
      <circle cx="-14" cy="0" r="2" fill="${forest}" opacity="0.9"/>
    </g>`).join('');

  return `
<svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bdelBg" cx="50%" cy="50%" r="75%">
      <stop offset="0%" stop-color="#e9e2d3"/>
      <stop offset="100%" stop-color="${bg}"/>
    </radialGradient>
    <filter id="bdelSoft"><feGaussianBlur stdDeviation="0.3"/></filter>
  </defs>
  <rect width="400" height="500" fill="url(#bdelBg)"/>
  <!-- faint grid for micrograph feel -->
  <g stroke="${forest}" stroke-width="0.3" opacity="0.08">
    ${Array.from({length: 10}).map((_,i)=>`<line x1="0" y1="${i*50}" x2="400" y2="${i*50}"/>`).join('')}
    ${Array.from({length: 8}).map((_,i)=>`<line y1="0" x1="${i*50}" y2="500" x2="${i*50}"/>`).join('')}
  </g>
  <!-- prey cells -->
  ${preyCells.map(p => `
    <g transform="translate(${p.cx},${p.cy}) rotate(${p.a})">
      <ellipse rx="${p.rx}" ry="${p.ry}" fill="${prey}" opacity="0.88"/>
      <ellipse rx="${p.rx}" ry="${p.ry}" fill="none" stroke="${forest}" stroke-width="1.4" opacity="0.65"/>
      <ellipse cx="${-p.rx*0.35}" cy="${-p.ry*0.3}" rx="${p.rx*0.3}" ry="${p.ry*0.4}" fill="#f3eee4" opacity="0.5"/>
      <ellipse cx="${p.rx*0.4}" cy="${p.ry*0.2}" rx="${p.rx*0.18}" ry="${p.ry*0.25}" fill="${forest}" opacity="0.12"/>
    </g>`).join('')}
  <!-- free-swimming predators -->
  ${predators.join('')}
  <!-- attached predators -->
  ${attached}
  <g font-family="JetBrains Mono, monospace" font-size="10" fill="${forest}" opacity="0.75">
    <text x="16" y="24">Bdellovibrio reynosensis · attack phase</text>
    <text x="16" y="38" opacity="0.55">Predator 0.3 µm · prey 1.5 µm</text>
    <line x1="16" y1="476" x2="80" y2="476" stroke="${forest}" stroke-width="1"/>
    <text x="16" y="492">2 µm</text>
    <!-- arrow annotation -->
    <g opacity="0.7">
      <path d="M300,130 L240,180" stroke="${predator}" stroke-width="1.2" fill="none"/>
      <polygon points="240,180 248,176 246,184" fill="${predator}"/>
      <text x="306" y="128" fill="${predator}">attached</text>
    </g>
  </g>
</svg>`;
};

window.ART = ART;

// ---------- TUTOR WIDGET ----------
// Set this to your Cloudflare Worker URL after deploy, e.g. "https://tutor.elufisantemidayo.com"
const TUTOR_ENDPOINT = null;

const TUTOR_SYSTEM = `You are TA — Temidayo's teaching assistant, a knowledgeable, concise microbiology tutor embedded on Dr. Temidayo Elufisan's academic portfolio. You help visitors (students, collaborators, fellow scientists) understand genome assembly, next-generation sequencing, antimicrobial resistance, parasitology, and applied microbiology.

Keep replies under 140 words. Use plain language, a friendly academic tone, and concrete examples. Where useful, point the visitor at Dr. Elufisan's published work or the Tutorial page. Never invent citations.`;

function mountTutor() {
  if (document.querySelector('.tutor')) return;
  const el = document.createElement('div');
  el.className = 'tutor';
  el.innerHTML = `
    <button class="tutor-toggle"><span class="dot"></span> Ask TA · Tutor</button>
    <div class="tutor-panel">
      <div class="tutor-header">
        <div class="title"><span class="dot"></span> TA · Teaching Assistant</div>
        <button class="close" aria-label="Close">×</button>
      </div>
      <div class="tutor-body" id="tutorBody">
        <div class="tutor-msg assistant">
          <div class="who">TA</div>
          <div class="text">Hi — I can explain anything about Dr. Elufisan's research: genome assembly with SPAdes, NGS workflows, Stenotrophomonas, AMR, or parasitology in livestock. Ask away.</div>
        </div>
      </div>
      <div class="tutor-suggestions">
        <button class="sug">What is SPAdes?</button>
        <button class="sug">Why N50 matters</button>
        <button class="sug">What does Prokka do?</button>
      </div>
      <form class="tutor-input" id="tutorForm">
        <input id="tutorInput" placeholder="Ask about NGS, AMR, assembly…" autocomplete="off"/>
        <button type="submit">Send</button>
      </form>
    </div>`;
  document.body.appendChild(el);

  el.querySelector('.tutor-toggle').addEventListener('click', () => el.classList.add('open'));
  el.querySelector('.close').addEventListener('click', () => el.classList.remove('open'));
  el.querySelectorAll('.sug').forEach(b => b.addEventListener('click', () => {
    document.getElementById('tutorInput').value = b.textContent;
    document.getElementById('tutorForm').dispatchEvent(new Event('submit', {cancelable:true}));
  }));

  const body = document.getElementById('tutorBody');
  const form = document.getElementById('tutorForm');
  const input = document.getElementById('tutorInput');
  const history = [];

  function add(who, text) {
    const m = document.createElement('div');
    m.className = 'tutor-msg ' + who;
    m.innerHTML = `<div class="who">${who === 'user' ? 'You' : 'TA'}</div><div class="text"></div>`;
    m.querySelector('.text').textContent = text;
    body.appendChild(m);
    body.scrollTop = body.scrollHeight;
    return m.querySelector('.text');
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    input.value = '';
    add('user', q);
    history.push({role: 'user', content: q});

    const typing = document.createElement('div');
    typing.className = 'tutor-typing';
    typing.textContent = 'TA is thinking';
    body.appendChild(typing);
    body.scrollTop = body.scrollHeight;

    try {
      let answer;
      if (TUTOR_ENDPOINT) {
        const r = await fetch(TUTOR_ENDPOINT, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({system: TUTOR_SYSTEM, messages: history})
        });
        const j = await r.json();
        answer = j.text || j.completion || j.reply || 'Hmm, no reply.';
      } else if (window.claude && window.claude.complete) {
        answer = await window.claude.complete({
          messages: [{role: 'system', content: TUTOR_SYSTEM}, ...history]
        });
      } else {
        answer = "The AI tutor is only live in preview here. After you deploy to your domain with the Cloudflare Worker, I'll be available for real visitors.";
      }
      typing.remove();
      add('assistant', answer);
      history.push({role: 'assistant', content: answer});
    } catch (err) {
      typing.remove();
      add('assistant', 'Sorry — I hit an error. Try again in a moment.');
    }
  });
}

// ---------- NAV: mark active page ----------
function markActiveNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('on');
  });
}

// ---------- PUBLICATIONS filter (used on publications.html) ----------
function mountPublications() {
  const root = document.getElementById('pubsRoot');
  if (!root || !window.PUBLICATIONS) return;
  const list = document.createElement('ul');
  list.className = 'pub-list';
  window.PUBLICATIONS.forEach(p => {
    const li = document.createElement('li');
    li.dataset.type = p.type;
    li.dataset.text = (p.title + ' ' + p.authors + ' ' + p.venue).toLowerCase();
    li.innerHTML = `
      <div class="yr">${p.y}</div>
      <div>
        <div class="t">${p.title}</div>
        <div class="v">${p.venue}</div>
        <div class="a">${p.authors}</div>
      </div>
      <div class="type-col">${p.type}</div>`;
    list.appendChild(li);
  });
  root.appendChild(list);

  const chips = document.querySelectorAll('.pub-chip');
  const search = document.getElementById('pubSearch');
  let activeType = 'all';

  function applyFilter() {
    const q = (search?.value || '').toLowerCase().trim();
    list.querySelectorAll('li').forEach(li => {
      const matchType = activeType === 'all' || li.dataset.type === activeType;
      const matchText = !q || li.dataset.text.includes(q);
      li.classList.toggle('hidden', !(matchType && matchText));
    });
  }

  chips.forEach(c => c.addEventListener('click', () => {
    chips.forEach(cc => cc.classList.remove('on'));
    c.classList.add('on');
    activeType = c.dataset.type;
    applyFilter();
  }));
  search?.addEventListener('input', applyFilter);
}

// ---------- CONTACT form (contact.html) ----------
function mountContact() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(form);
    const subject = encodeURIComponent(fd.get('subject') || 'Hello from elufisantemidayo.com');
    const body = encodeURIComponent(
      `Name: ${fd.get('name')}\nEmail: ${fd.get('email')}\nAffiliation: ${fd.get('affiliation') || '—'}\n\n${fd.get('message')}`
    );
    window.location.href = `mailto:ptemidayo@gmail.com?subject=${subject}&body=${body}`;
    document.getElementById('formMsg')?.classList.add('show');
  });
}

// ---------- DOM ready ----------
document.addEventListener('DOMContentLoaded', () => {
  markActiveNav();
  mountPublications();
  mountContact();
  mountTutor();

  // Count-up for stats on home
  const stats = document.querySelectorAll('.stats-strip .n[data-num]');
  if (stats.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const target = +el.dataset.num;
        const suffix = el.dataset.suffix || '';
        let v = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const tick = () => {
          v = Math.min(target, v + step);
          el.innerHTML = v + (suffix ? `<sub>${suffix}</sub>` : '');
          if (v < target) requestAnimationFrame(tick);
        };
        tick();
        io.unobserve(el);
      });
    }, {threshold: 0.4});
    stats.forEach(el => io.observe(el));
  }
});
