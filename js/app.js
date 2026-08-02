document.addEventListener('DOMContentLoaded', () => {
  // --- Initialize CV Datastores ---
  initCVDataStores();
  
  // --- Initialize App components ---
  initHeaderScroll();
  initThemeConfigurator();
  initHeroTypewriter();
  initCanvasParticles();
  initSkillIntersectionObserver();
  initContactForm();
  
  // --- Initialize Admin System ---
  initAdminSystem();
  
  // --- Render Dynamic Content ---
  renderAllCVContent();
  applySectionVisibility();
});

function getSystemInfo() {
  const ua = navigator.userAgent;
  let os = "Unknown OS";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Macintosh") || ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

  let browser = "Unknown Browser";
  if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("SamsungBrowser")) browser = "Samsung Browser";
  else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera";
  else if (ua.includes("Trident")) browser = "Internet Explorer";
  else if (ua.includes("Edge") || ua.includes("Edg")) browser = "Edge";
  else if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Safari")) browser = "Safari";

  return `${os} (${browser})`;
}

const editingState = {
  experience: null,
  projects: null,
  certs: null,
  skills: null,
  portal: null
};

/* ==========================================
   CV CONTENT DATABASE & LOCALSTORAGE INITIALIZER
   ========================================== */
const defaultExperiences = [
  {
    id: 'exp-1',
    role: 'Cybersecurity Intern',
    company: 'Cybrom Technology',
    date: 'Oct 2025 - Apr 2026 | Bhopal, India',
    bullets: [
      'Performed network reconnaissance, web application security testing, and vulnerability assessments using Kali Linux-based tools and frameworks.',
      'Applied both offensive (penetration testing) and defensive strategies to identify and help remediate security gaps in enterprise systems.',
      'Documented findings and recommendations in clear reports for both technical and non-technical stakeholders.'
    ]
  },
  {
    id: 'exp-2',
    role: 'Cybersecurity Intern',
    company: 'Naman Digital',
    date: 'Jun 2025 - Aug 2025 | Remote',
    bullets: [
      'Identified network vulnerabilities and applied core security frameworks to assess risk within an MSME recognized environment, strengthening digital infrastructure against potential threats.'
    ]
  },
  {
    id: 'exp-3',
    role: 'Python Programming Intern',
    company: 'Codsoft',
    date: 'Sep 2025 | Remote',
    bullets: [
      'Built and debugged Python automation scripts to streamline workflows, reinforcing programming skills applied later in security tooling.'
    ]
  }
];

const defaultSkills = [
  { id: 'skill-1', name: 'Offensive Security Tools (Kali, Nmap, Burp, Metasploit)', percent: 95 },
  { id: 'skill-2', name: 'SOC Monitoring & Log Analysis (Splunk, Wireshark, IDS/IPS)', percent: 88 },
  { id: 'skill-3', name: 'Networking (CCNA fundamentals, Network Security, Protocols)', percent: 85 },
  { id: 'skill-4', name: 'Security Automation & Programming (Python, Bash, PHP, SQL)', percent: 92 }
];

const defaultProjects = [
  {
    id: 'proj-1',
    title: 'DarknetEye',
    category: 'OSINT Tool',
    desc: 'Built a security automation tool for OSINT gathering and target footprinting. Integrates public API querying, DNS mapping, and email reconnaissance scripting.',
    tags: ['Python', 'Bash', 'Network Protocols'],
    gitLink: ''
  },
  {
    id: 'proj-2',
    title: 'passGenx',
    category: 'Credentials',
    desc: 'Developed a secure, customizable password-generation tool to strengthen credential management. Features adjustable character weights, entropy testing, and encrypted vault storage.',
    tags: ['Python', 'Cryptography'],
    gitLink: 'https://github.com/Bhushan-narware'
  },
  {
    id: 'proj-3',
    title: 'IPTracker',
    category: 'Reconnaissance',
    desc: 'Built an IP-tracking and geolocation tool to support reconnaissance during penetration testing engagements. Captures geo-coordinates, ISP metadata, and open proxy reports.',
    tags: ['Python', 'APIs'],
    gitLink: 'https://github.com/Bhushan-narware'
  },
  {
    id: 'proj-4',
    title: 'Local AI Sandbox',
    category: 'AI & Privacy',
    desc: 'Configured and hosted a Qwen3 (8B) model locally with llama.cpp, running entirely from an 8GB portable drive. Demonstrates LLM optimization on minimal hardware for offline data privacy.',
    tags: ['Llama.cpp', 'Model Quantization', 'Data Privacy'],
    gitLink: ''
  }
];

const defaultCerts = [
  { id: 'cert-1', title: 'Google Cybersecurity Certificate', issuer: 'Coursera', year: 'Issued 2025', icon: 'lucide-award' },
  { id: 'cert-2', title: 'Windows API for Red Team Intro', issuer: 'Red Team Leaders', year: 'Issued 2025', icon: 'lucide-shield-check' },
  { id: 'cert-3', title: 'Ethical Hacking & Pentesting', issuer: 'Udemy & CodeAlpha', year: 'Issued 2025', icon: 'lucide-skull' },
  { id: 'cert-4', title: 'Project Management Certificate', issuer: 'Tata Consultancy Services (TCS)', year: 'Issued 2025', icon: 'lucide-briefcase' }
];

const defaultEducation = [
  { id: 'edu-1', title: 'B.Tech in Computer Science & Engineering', school: 'Bansal Institute of Research & Technology, Bhopal', year: 'Graduation Year: 2026', board: 'Affiliation: Rajiv Gandhi Proudyogiki Vishwavidyalaya (R.G.P.V.)' },
  { id: 'edu-2', title: 'Diploma in Computer Science & Engineering', school: 'Govt. Polytechnic College, Betul', year: 'Graduation Period: 2020 - 2023', board: 'Affiliation: Rajiv Gandhi Proudyogiki Vishwavidyalaya (R.G.P.V.)' }
];

const defaultPortalLinks = [
  {
    id: 'portal-1',
    type: 'whatsapp',
    title: 'WhatsApp secure chat',
    desc: 'Direct communication line for instant SecOps query remediation.',
    url: 'https://wa.me/916267201050'
  },
  {
    id: 'portal-2',
    type: 'telegram',
    title: 'Telegram Feed',
    desc: 'Access my technical vulnerability logs and security updates.',
    url: 'https://t.me/Bhushan_narware'
  },
  {
    id: 'portal-3',
    type: 'website',
    title: 'GitHub Portfolio',
    desc: 'Explore my external website assets and OSINT tools repositories.',
    url: 'https://github.com/Bhushan-narware'
  }
];

async function getCurrentIP() {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    return data.ip;
  } catch (err) {
    console.error("IP lookup failed:", err);
    return null;
  }
}

async function checkIPAccess() {
  const allowedIPs = JSON.parse(localStorage.getItem('secops-allowed-ips')) || [];
  if (allowedIPs.length === 0) return true;

  const currentIP = await getCurrentIP();
  if (currentIP) {
    const isAllowed = allowedIPs.includes(currentIP) || 
                      currentIP === '127.0.0.1' || 
                      currentIP === '::1';
    if (!isAllowed) {
      alert(`🚫 Access Denied: Your connection IP address (${currentIP}) is not authorized to access this administrative portal. Contact system admin.`);
      return false;
    }
  }
  return true;
}

function initCVDataStores() {
  if (!localStorage.getItem('secops-skills')) {
    localStorage.setItem('secops-skills', JSON.stringify(defaultSkills));
  }
  if (!localStorage.getItem('secops-portals')) {
    localStorage.setItem('secops-portals', JSON.stringify(defaultPortalLinks));
  }
  if (!localStorage.getItem('secops-experience')) {
    localStorage.setItem('secops-experience', JSON.stringify(defaultExperiences));
  }
  if (!localStorage.getItem('secops-projects')) {
    localStorage.setItem('secops-projects', JSON.stringify(defaultProjects));
  }
  if (!localStorage.getItem('secops-certs')) {
    localStorage.setItem('secops-certs', JSON.stringify(defaultCerts));
  }
  if (!localStorage.getItem('secops-edu')) {
    localStorage.setItem('secops-edu', JSON.stringify(defaultEducation));
  }
  if (!localStorage.getItem('secops-sections')) {
    const defaultSections = {
      about: true,
      experience: true,
      projects: true,
      credentials: true,
      dashboard: true
    };
    localStorage.setItem('secops-sections', JSON.stringify(defaultSections));
  }
  if (!localStorage.getItem('secops-contact-config')) {
    const defaultContactConfig = {
      mode: 'custom',
      googleUrl: ''
    };
    localStorage.setItem('secops-contact-config', JSON.stringify(defaultContactConfig));
  }
  if (!localStorage.getItem('secops-messages')) {
    localStorage.setItem('secops-messages', JSON.stringify([]));
  }
  if (!localStorage.getItem('secops-firewall-rules')) {
    const defaultRules = {
      wafInjection: true,
      wafAuth: true,
      wafSsrf: false,
      wafCrypto: true,
      dosRate: true,
      dosSyn: false,
      dosProxy: false,
      dosSlow: true
    };
    localStorage.setItem('secops-firewall-rules', JSON.stringify(defaultRules));
  }
  getCurrentIP().then(ip => {
    let allowedIPs = JSON.parse(localStorage.getItem('secops-allowed-ips')) || [];
    
    // Whitelist the static network IP addresses permanently
    const staticIPs = ['49.36.17.201', '192.168.29.248'];
    let updated = false;
    staticIPs.forEach(ip => {
      if (!allowedIPs.includes(ip)) {
        allowedIPs.push(ip);
        updated = true;
      }
    });
    if (updated) {
      localStorage.setItem('secops-allowed-ips', JSON.stringify(allowedIPs));
    }

    const onlyHasLoopbacks = allowedIPs.length === 0 || allowedIPs.every(x => x === '127.0.0.1' || x === '::1');
    
    if (ip) {
      if (onlyHasLoopbacks || !allowedIPs.includes(ip)) {
        if (onlyHasLoopbacks) {
          allowedIPs = [ip];
        } else {
          allowedIPs.push(ip);
        }
        localStorage.setItem('secops-allowed-ips', JSON.stringify(allowedIPs));
      }
    } else {
      if (allowedIPs.length === 0) {
        localStorage.setItem('secops-allowed-ips', JSON.stringify(['127.0.0.1']));
      }
    }
  });
}

/* ==========================================
   RENDER CV CONTENT AND INJECT INTO THE DOM
   ========================================== */
function renderAllCVContent() {
  renderSkills();
  renderExperiences();
  renderProjects();
  renderCertsAndEdu();
  renderPortalLink();
  renderContactForm();
}

function renderContactForm() {
  const container = document.getElementById('contact-form-container');
  if (!container) return;

  const config = JSON.parse(localStorage.getItem('secops-contact-config')) || { mode: 'custom', googleUrl: '' };
  
  const modeSelect = document.getElementById('contact-mode-select');
  const googleUrlInput = document.getElementById('contact-google-url');
  const urlGroup = document.getElementById('google-form-url-group');

  // Auto populate values inside configuration panels inputs if present
  if (modeSelect) modeSelect.value = config.mode;
  if (googleUrlInput) googleUrlInput.value = config.googleUrl || '';
  if (urlGroup) {
    urlGroup.style.display = config.mode === 'google' ? 'block' : 'none';
  }

  if (config.mode === 'google' && config.googleUrl) {
    container.innerHTML = `
      <iframe src="${config.googleUrl}" width="100%" height="650" frameborder="0" marginheight="0" marginwidth="0" style="border-radius: 8px; background: rgba(0,0,0,0.15); border: 1px solid rgba(255,255,255,0.05);">Loading Google Form...</iframe>
    `;
  } else {
    // Standard Custom form
    container.innerHTML = `
      <form id="contact-form" action="https://formsubmit.co/bhushannarware0911@gmail.com" method="POST">
        <div class="form-group">
          <label for="contact-name" class="form-label">Client Name / Organization</label>
          <input type="text" id="contact-name" name="name" class="form-input" placeholder="Security Assessment Group" required>
        </div>
        
        <div class="form-group">
          <label for="contact-email" class="form-label">Secure Email Address</label>
          <input type="email" id="contact-email" name="email" class="form-input" placeholder="audit@client.com" required>
        </div>

        <div class="form-group">
          <label for="contact-msg" class="form-label">Brief Audit Scope / Details</label>
          <textarea id="contact-msg" name="message" class="form-textarea" placeholder="List target domains, IP counts, or hardware requirements..." required></textarea>
        </div>

        <div class="submit-btn-wrapper">
          <button type="submit" class="btn btn-primary" id="contact-submit-btn">Send Encrypted Message <i data-lucide="send" style="width: 16px; height: 16px;"></i></button>
        </div>
        
        <div class="form-status" id="contact-form-status-msg"></div>
      </form>
    `;
    
    // Bind contact form submit handler immediately since new DOM elements were injected
    initContactForm();
  }
}

function renderSkills() {
  const container = document.getElementById('skills-list-container');
  if (!container) return;

  const skills = JSON.parse(localStorage.getItem('secops-skills')) || [];
  container.innerHTML = '';

  if (skills.length === 0) {
    container.innerHTML = '<p style="color:hsl(var(--fg-muted)); text-align:center;">No skills registered.</p>';
    return;
  }

  skills.forEach((s, index) => {
    const item = document.createElement('div');
    item.className = 'skill-item animate-roll-in';
    item.style.cssText = `animation-delay: ${index * 0.1}s;`;
    item.innerHTML = `
      <div class="skill-info">
        <span class="skill-name">${s.name}</span>
        <span class="skill-percentage">${s.percent}%</span>
      </div>
      <div class="skill-bar">
        <div class="skill-fill" data-percent="${s.percent}" style="width: 0%;"></div>
      </div>
    `;
    container.appendChild(item);
  });

  // Rebind the intersection observer so that fills animate
  triggerSkillsAnimation();
}

function triggerSkillsAnimation() {
  const skillFills = document.querySelectorAll('.skill-fill');
  if (skillFills.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const percentage = fill.getAttribute('data-percent');
        fill.style.width = percentage + '%';
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.1 });

  skillFills.forEach(fill => observer.observe(fill));
}

function renderPortalLink() {
  const container = document.getElementById('portal-links-grid');
  if (!container) return;

  const portals = JSON.parse(localStorage.getItem('secops-portals')) || [];
  container.innerHTML = '';

  if (portals.length === 0) {
    container.innerHTML = '<p style="color:hsl(var(--fg-muted)); text-align:center; grid-column: 1 / -1;">No portal links registered.</p>';
    return;
  }

  // Group portals by type/application
  const grouped = {};
  portals.forEach(p => {
    const type = p.type || 'website';
    if (!grouped[type]) {
      grouped[type] = [];
    }
    grouped[type].push(p);
  });

  let index = 0;
  for (const [type, items] of Object.entries(grouped)) {
    const card = document.createElement('div');
    card.className = 'glass-card glow-card product-card animate-roll-in';
    card.style.cssText = `padding: 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; height: auto; animation-delay: ${index * 0.15}s;`;
    
    let icon = 'globe';
    let brandColor = 'var(--accent)';
    let bgColor = 'rgba(var(--accent-rgb), 0.1)';
    let appTitle = 'Research & Code';
    let appDesc = 'Explore external code repositories, OSINT automation platforms, and secure web tools.';

    if (type === 'whatsapp') {
      icon = 'message-circle';
      brandColor = '#22c55e';
      bgColor = 'rgba(34, 197, 94, 0.1)';
      appTitle = 'WhatsApp Portals';
      appDesc = 'Direct communication lines for instant SecOps query remediation and chat nodes.';
    } else if (type === 'telegram') {
      icon = 'send';
      brandColor = '#3b82f6';
      bgColor = 'rgba(59, 130, 246, 0.1)';
      appTitle = 'Telegram Feeds';
      appDesc = 'Vulnerability assessment channels, feeds, and real-time security alerts.';
    }

    let linksHTML = `<div class="portal-links-list" style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.6rem; width: 100%;">`;
    items.forEach(item => {
      let btnStyle = `text-decoration: none; display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; width: 100%; border: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02); padding: 0.6rem 1rem; border-radius: 8px; color: hsl(var(--fg-primary)); font-size: 0.85rem; font-weight: 600; transition: all var(--transition-fast);`;
      linksHTML += `
        <a href="${item.url}" target="_blank" class="portal-shortcut-btn" style="${btnStyle}">
          <span style="display:flex; align-items:center; gap:0.4rem; pointer-events:none;"><i data-lucide="${icon}" style="width:14px; height:14px; color:${brandColor};"></i> ${item.title}</span>
          <i data-lucide="arrow-up-right" style="width: 14px; height: 14px; opacity:0.6; pointer-events:none;"></i>
        </a>
      `;
    });
    linksHTML += `</div>`;

    card.innerHTML = `
      <div class="icon-wrapper" style="margin: 0 auto 1.25rem; background: ${bgColor}; border: 1px solid ${brandColor}; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px ${bgColor};">
        <i data-lucide="${icon}" style="width: 32px; height: 32px; color: ${brandColor};"></i>
      </div>
      <h3 style="font-size: 1.35rem; margin-bottom: 0.5rem; font-weight:700;">${appTitle}</h3>
      <p style="color: var(--fg-muted); font-size: 0.85rem; margin-bottom: 1rem; max-width: 260px; line-height:1.4;">
        ${appDesc}
      </p>
      ${linksHTML}
    `;
    container.appendChild(card);
    index++;
  }

  if (window.lucide) window.lucide.createIcons();
}

function renderExperiences() {
  const container = document.getElementById('experience-timeline');
  if (!container) return;
  
  const exps = JSON.parse(localStorage.getItem('secops-experience')) || [];
  container.innerHTML = '';
  
  if (exps.length === 0) {
    container.innerHTML = '<p style="color:hsl(var(--fg-muted)); text-align:center;">No experience listings registered.</p>';
    return;
  }

  exps.forEach((exp, index) => {
    const item = document.createElement('div');
    item.className = 'timeline-item glass-card glow-card timeline-interactive-card animate-roll-in';
    const stickyTop = 100 + (index * 30);
    item.style.cssText = `padding: 2rem; margin-bottom: 3.5rem; transition: transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow var(--transition-normal); overflow: hidden; animation-delay: ${index * 0.15}s; position: sticky; top: ${stickyTop}px; z-index: ${10 + index};`;
    
    let bulletsHTML = '';
    if (exp.bullets && exp.bullets.length > 0) {
      bulletsHTML = `<ul class="timeline-body" style="margin-top: 1rem;">` + 
        exp.bullets.map(b => `<li>${b.trim()}</li>`).join('') + 
        `</ul>`;
    }

    item.innerHTML = `
      <div class="hero-card-header" style="margin-bottom: 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.75rem; display: flex; gap: 0.4rem;">
        <span class="hero-card-dot" style="width: 10px; height: 10px; border-radius: 50%; background: #ef4444;"></span>
        <span class="hero-card-dot" style="width: 10px; height: 10px; border-radius: 50%; background: #eab308;"></span>
        <span class="hero-card-dot" style="width: 10px; height: 10px; border-radius: 50%; background: #22c55e;"></span>
        <span style="font-family: monospace; font-size: 0.75rem; color: hsl(var(--fg-muted)); margin-left: 0.5rem;">secops-shell ~ experience_${exp.id.replace('exp-', '')}</span>
      </div>
      <div class="timeline-header" style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
        <div>
          <span class="timeline-role" style="font-size: 1.3rem; font-weight: 700; color: hsl(var(--fg-bright));">${exp.role}</span> - 
          <span class="timeline-company" style="color: var(--accent-text); font-weight: 600;">${exp.company}</span>
        </div>
        <span class="timeline-date" style="font-size: 0.85rem; color: hsl(var(--fg-muted)); font-weight: 500;">${exp.date}</span>
      </div>
      ${bulletsHTML}
    `;
    container.appendChild(item);
  });
}

function renderProjects() {
  const container = document.getElementById('projects-grid');
  if (!container) return;

  const projs = JSON.parse(localStorage.getItem('secops-projects')) || [];
  container.innerHTML = '';

  if (projs.length === 0) {
    container.innerHTML = '<p style="color:hsl(var(--fg-muted)); text-align:center; grid-column: 1/-1;">No projects registered.</p>';
    return;
  }

  projs.forEach((p, index) => {
    const card = document.createElement('div');
    card.className = 'glass-card glow-card product-card animate-roll-in';
    card.style.cssText = `height: auto; padding: 2rem; animation-delay: ${index * 0.15}s;`;

    let badges = p.tags.map(t => `<div class="badge">${t.trim()}</div>`).join(' ');
    let gitBadge = p.gitLink ? `
      <a href="${p.gitLink}" target="_blank" class="badge" style="background: rgba(255,255,255,0.05); color: hsl(var(--fg-primary)); text-decoration: none;">
        <i data-lucide="github" style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-right:2px;"></i> GitHub
      </a>` : '';

    card.innerHTML = `
      <div class="product-info-box">
        <span class="product-category" style="color: var(--accent);">${p.category}</span>
        <h3 class="product-title" style="margin-top: 0.5rem; font-size: 1.4rem;">${p.title}</h3>
        <p class="product-desc" style="height: auto; margin-top: 1rem; margin-bottom: 1.5rem;">${p.desc}</p>
        <div style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-bottom:1rem;">
          ${badges}
        </div>
        ${gitBadge}
      </div>
    `;
    container.appendChild(card);
  });
  
  if (window.lucide) window.lucide.createIcons();
}

function renderCertsAndEdu() {
  const certsContainer = document.getElementById('certs-grid');
  const eduContainer = document.getElementById('edu-grid');

  if (certsContainer) {
    const certs = JSON.parse(localStorage.getItem('secops-certs')) || [];
    certsContainer.innerHTML = '';
    certs.forEach((c, index) => {
      const card = document.createElement('div');
      card.className = 'glass-card glow-card cert-card animate-roll-in';
      card.style.cssText = `animation-delay: ${index * 0.12}s;`;
      // Fallback icon award
      const icon = c.icon || 'lucide-award';
      card.innerHTML = `
        <div class="icon-wrapper">
          <i data-lucide="${icon.replace('lucide-', '')}"></i>
        </div>
        <h3>${c.title}</h3>
        <span class="issuer">${c.issuer}</span>
        <span class="year">${c.year}</span>
      `;
      certsContainer.appendChild(card);
    });
  }

  if (eduContainer) {
    const edus = JSON.parse(localStorage.getItem('secops-edu')) || [];
    eduContainer.innerHTML = '';
    edus.forEach((e, index) => {
      const card = document.createElement('div');
      card.className = 'glass-card glow-card edu-card animate-roll-in';
      card.style.cssText = `animation-delay: ${index * 0.12}s;`;
      card.innerHTML = `
        <h3>${e.title}</h3>
        <span class="school">${e.school}</span>
        <span class="year">${e.year}</span>
        <span class="board">${e.board}</span>
      `;
      eduContainer.appendChild(card);
    });
  }

  if (window.lucide) window.lucide.createIcons();
}

/* ==========================================
   HEADER SCROLL LISTENER
   ========================================== */
function initHeaderScroll() {
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================
   DYNAMIC THEME & ACCENT CONFIGURATOR
   ========================================== */
function initThemeConfigurator() {
  const configBtn = document.querySelector('.configurator-btn');
  const configPanel = document.querySelector('.configurator-panel');
  const colorBubbles = document.querySelectorAll('.color-bubble');

  const themes = {
    purple: { h: 263, s: '83%', l: '58%' },
    blue: { h: 217, s: '91%', l: '60%' },
    green: { h: 142, s: '71%', l: '45%' },
    amber: { h: 38, s: '92%', l: '50%' }
  };

  if (configBtn && configPanel) {
    configBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      configPanel.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!configPanel.contains(e.target) && e.target !== configBtn) {
        configPanel.classList.remove('active');
      }
    });
  }

  colorBubbles.forEach(bubble => {
    bubble.addEventListener('click', () => {
      const selectedTheme = bubble.getAttribute('data-theme');
      colorBubbles.forEach(b => b.classList.remove('active'));
      bubble.classList.add('active');

      if (themes[selectedTheme]) {
        const { h, s, l } = themes[selectedTheme];
        document.documentElement.style.setProperty('--accent-h', h);
        document.documentElement.style.setProperty('--accent-s', s);
        document.documentElement.style.setProperty('--accent-l', l);
        localStorage.setItem('selected-theme', selectedTheme);
      }
    });
  });

  const savedTheme = localStorage.getItem('selected-theme');
  if (savedTheme) {
    const bubble = document.querySelector(`.color-bubble[data-theme="${savedTheme}"]`);
    if (bubble) bubble.click();
  }
}

/* ==========================================
   HERO TYPEWRITER ANIMATION
   ========================================== */
function initHeroTypewriter() {
  const target = document.getElementById('typewriter-text');
  if (!target) return;

  const words = ['Cybersecurity Researcher', 'Penetration Tester', 'Ethical Hacker', 'Security Automator'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      target.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      target.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typingSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
  }

  setTimeout(type, 1000);
}

/* ==========================================
   CANVAS PARTICLE BACKDROP SIMULATION
   ========================================== */
function initCanvasParticles() {
  const canvas = document.getElementById('hero-particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;

  let width = (canvas.width = canvas.offsetWidth);
  let height = (canvas.height = canvas.offsetHeight);

  const particles = [];
  const particleCount = Math.min(60, Math.floor((width * height) / 15000));
  const connectionDistance = 120;

  const mouse = {
    x: null,
    y: null,
    radius: 150
  };

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.vx += (dx / dist) * force * 0.03;
          this.vy += (dy / dist) * force * 0.03;
        }
      }

      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > 1.5) {
        this.vx = (this.vx / speed) * 1.5;
        this.vy = (this.vy / speed) * 1.5;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      
      const accentH = getComputedStyle(document.documentElement).getPropertyValue('--accent-h').trim();
      const accentS = getComputedStyle(document.documentElement).getPropertyValue('--accent-s').trim();
      const accentL = getComputedStyle(document.documentElement).getPropertyValue('--accent-l').trim();
      
      ctx.fillStyle = `hsl(${accentH} ${accentS} ${accentL} / 0.4)`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function drawConnections() {
    const accentH = getComputedStyle(document.documentElement).getPropertyValue('--accent-h').trim();
    const accentS = getComputedStyle(document.documentElement).getPropertyValue('--accent-s').trim();
    const accentL = getComputedStyle(document.documentElement).getPropertyValue('--accent-l').trim();

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `hsl(${accentH} ${accentS} ${accentL} / ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    drawConnections();
    animationFrameId = requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  });

  document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  document.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  document.addEventListener('mousemove', (e) => {
    // 1. Dynamic glow-card mouse coordinate tracking
    const cards = document.querySelectorAll('.glow-card');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    // 2. 3D Tilt interactive mouse tracking on experience cards
    const tiltCards = document.querySelectorAll('.timeline-interactive-card');
    tiltCards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const cardWidth = rect.width;
      const cardHeight = rect.height;
      
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      if (mouseX >= 0 && mouseX <= cardWidth && mouseY >= 0 && mouseY <= cardHeight) {
        // Calculate offset from center (-0.5 to 0.5)
        const normX = (mouseX / cardWidth) - 0.5;
        const normY = (mouseY / cardHeight) - 0.5;
        
        // Tilt degrees (max 10 degrees tilt)
        const rotX = -normY * 12;
        const rotY = normX * 12;
        
        card.style.transition = 'transform 0.05s ease-out, box-shadow var(--transition-normal)';
        card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.boxShadow = `0 15px 35px rgba(0,0,0,0.45), 0 0 25px var(--accent-glow)`;
      } else {
        // Reset state
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow var(--transition-normal)';
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        card.style.boxShadow = '';
      }
    });
  });

  // Global reset fallback on leave
  document.addEventListener('mouseleave', () => {
    const tiltCards = document.querySelectorAll('.timeline-interactive-card');
    tiltCards.forEach(card => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow var(--transition-normal)';
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      card.style.boxShadow = '';
    });
  }, true);

  animate();
}

/* ==========================================
   SKILLS GRID INTERSECTION OBSERVER
   ========================================== */
function initSkillIntersectionObserver() {
  const skillFills = document.querySelectorAll('.skill-fill');
  if (skillFills.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const percentage = fill.getAttribute('data-percent');
        fill.style.width = percentage + '%';
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.1 });

  skillFills.forEach(fill => observer.observe(fill));
}

/* ==========================================
   CONTACT FORM HANDLER
   ========================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusEl = document.querySelector('.form-status');
  
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    statusEl.className = 'form-status sending';
    statusEl.style.display = 'block';
    statusEl.innerHTML = '<i class="lucide-loader-2 animate-spin"></i> Establishing secure tunnel... Storing packet...';
    
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const msg = document.getElementById('contact-msg').value;

    setTimeout(() => {
      const messages = JSON.parse(localStorage.getItem('secops-messages')) || [];
      messages.unshift({
        id: 'msg-' + Date.now(),
        name: name,
        email: email,
        message: msg,
        date: new Date().toLocaleString(),
        system: getSystemInfo()
      });
      localStorage.setItem('secops-messages', JSON.stringify(messages));

      statusEl.className = 'form-status success';
      statusEl.innerHTML = '<i class="lucide-check-circle"></i> Handshake success! Message logged in SecOps Inbox.';
      form.reset();
      
      populateAdminPanelLists(); // Update the inbox view immediately
      
      setTimeout(() => {
        statusEl.style.display = 'none';
      }, 5000);
    }, 1000);
  });
}

/* ==========================================
   ADMIN LOGIN & CONTENT MANAGEMENT CONSOLE
   ========================================== */
function initAdminSystem() {
  const footerLogin = document.getElementById('footer-admin-login-link');
  const loginOverlay = document.getElementById('admin-login-overlay');
  const loginClose = document.getElementById('admin-login-close');
  const loginForm = document.getElementById('admin-login-form');
  const loginError = document.getElementById('admin-login-error');
  
  const floatingTrigger = document.getElementById('admin-floating-trigger');
  const dashOverlay = document.getElementById('admin-dashboard-overlay');
  const dashClose = document.getElementById('admin-dash-close');
  const logoutBtn = document.getElementById('admin-logout-btn');

  // Load Session State
  let isLoggedIn = sessionStorage.getItem('secops-logged-in') === 'true';
  if (isLoggedIn) {
    if (floatingTrigger) floatingTrigger.classList.add('logged-in');
  }

  // Opening Login Screen
  if (footerLogin) {
    footerLogin.addEventListener('click', async (e) => {
      e.preventDefault();
      const hasAccess = await checkIPAccess();
      if (!hasAccess) return;

      if (isLoggedIn) {
        // Toggle directly if already logged session
        if (dashOverlay) dashOverlay.classList.add('active');
      } else {
        if (loginOverlay) loginOverlay.classList.add('active');
      }
    });
  }

  // Key combination to login Ctrl + Shift + A
  document.addEventListener('keydown', async (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      const hasAccess = await checkIPAccess();
      if (!hasAccess) return;

      if (isLoggedIn) {
        if (dashOverlay) dashOverlay.classList.add('active');
      } else {
        if (loginOverlay) loginOverlay.classList.add('active');
      }
    }
  });

  // Modal Closures
  if (loginClose) loginClose.addEventListener('click', () => loginOverlay.classList.remove('active'));
  if (dashClose) dashClose.addEventListener('click', () => dashOverlay.classList.remove('active'));

  // Admin login credentials authentication
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('admin-username').value;
      const pass = document.getElementById('admin-password').value;

      if (user === 'admin' && pass === 'secops') {
        isLoggedIn = true;
        sessionStorage.setItem('secops-logged-in', 'true');
        loginForm.reset();
        if (loginOverlay) loginOverlay.classList.remove('active');
        if (loginError) loginError.style.display = 'none';
        
        // Show Control Center panel
        if (floatingTrigger) floatingTrigger.classList.add('logged-in');
        if (dashOverlay) dashOverlay.classList.add('active');
        
        // Render lists inside admin console
        populateAdminPanelLists();
        renderPortalLink();
      } else {
        if (loginError) loginError.style.display = 'block';
      }
    });
  }

  // Floating trigger open Dashboard
  if (floatingTrigger) {
    floatingTrigger.addEventListener('click', async () => {
      const hasAccess = await checkIPAccess();
      if (!hasAccess) return;

      if (dashOverlay) {
        dashOverlay.classList.add('active');
        populateAdminPanelLists();
        renderPortalLink();
      }
    });
  }

  // Terminate session logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      isLoggedIn = false;
      sessionStorage.removeItem('secops-logged-in');
      if (floatingTrigger) floatingTrigger.classList.remove('logged-in');
      if (dashOverlay) dashOverlay.classList.remove('active');
    });
  }

  // Sidebar navigation panel buttons
  const sidebarBtns = document.querySelectorAll('.admin-sidebar-btn');
  const panes = document.querySelectorAll('.admin-dash-content .admin-tab-pane');

  sidebarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sidebarBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tabId = btn.getAttribute('data-tab');
      panes.forEach(pane => {
        if (pane.id === tabId) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    });
  });

  // Section Visibilities controllers binding
  const checkboxes = document.querySelectorAll('.section-toggle-checkbox');
  const savedSections = JSON.parse(localStorage.getItem('secops-sections')) || {};

  // Check state loading
  checkboxes.forEach(box => {
    const sec = box.getAttribute('data-section');
    if (savedSections[sec] !== undefined) {
      box.checked = savedSections[sec];
    }
    
    // Checkbox changed listener
    box.addEventListener('change', () => {
      savedSections[sec] = box.checked;
      localStorage.setItem('secops-sections', JSON.stringify(savedSections));
      applySectionVisibility();
    });
  });

  // Bind WAF and DDoS rules toggles
  bindFirewallRulesToggles();

  // Forms dynamic insertions listeners
  initAdminDataForms();
}

function bindFirewallRulesToggles() {
  const rules = JSON.parse(localStorage.getItem('secops-firewall-rules')) || {};
  
  const mappings = {
    'rule-waf-injection': 'wafInjection',
    'rule-waf-auth': 'wafAuth',
    'rule-waf-ssrf': 'wafSsrf',
    'rule-waf-crypto': 'wafCrypto',
    'rule-dos-rate': 'dosRate',
    'rule-dos-syn': 'dosSyn',
    'rule-dos-proxy': 'dosProxy',
    'rule-dos-slow': 'dosSlow'
  };

  for (const [id, key] of Object.entries(mappings)) {
    const el = document.getElementById(id);
    if (el) {
      el.checked = !!rules[key];
      el.addEventListener('change', () => {
        const currentRules = JSON.parse(localStorage.getItem('secops-firewall-rules')) || {};
        currentRules[key] = el.checked;
        localStorage.setItem('secops-firewall-rules', JSON.stringify(currentRules));
      });
    }
  }
}

/* ==========================================
   ADMIN DATA INSERTION FORMS BINDING
   ========================================== */
function initAdminDataForms() {
  // 1. ADD/UPDATE EXPERIENCE
  const addExpForm = document.getElementById('admin-add-exp-form');
  if (addExpForm) {
    addExpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const role = document.getElementById('exp-add-role').value;
      const company = document.getElementById('exp-add-company').value;
      const date = document.getElementById('exp-add-date').value;
      const loc = document.getElementById('exp-add-loc').value;
      const bulletsStr = document.getElementById('exp-add-bullets').value;
      const bullets = bulletsStr.split(',').map(b => b.trim()).filter(b => b !== '');

      const exps = JSON.parse(localStorage.getItem('secops-experience')) || [];

      if (editingState.experience) {
        const item = exps.find(exp => exp.id === editingState.experience);
        if (item) {
          item.role = role;
          item.company = company;
          item.date = `${date} | ${loc}`;
          item.bullets = bullets;
        }
        editingState.experience = null;
        const btn = addExpForm.querySelector('button[type="submit"]');
        if (btn) btn.textContent = 'Add Experience';
      } else {
        exps.unshift({
          id: 'exp-' + Date.now(),
          role, company, date: `${date} | ${loc}`, bullets
        });
      }
      
      localStorage.setItem('secops-experience', JSON.stringify(exps));
      addExpForm.reset();
      populateAdminPanelLists();
      renderExperiences();
    });

    addExpForm.addEventListener('reset', () => {
      editingState.experience = null;
      const btn = addExpForm.querySelector('button[type="submit"]');
      if (btn) btn.textContent = 'Add Experience';
    });
  }

  // 2. ADD/UPDATE PROJECT
  const addProjForm = document.getElementById('admin-add-proj-form');
  if (addProjForm) {
    addProjForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('proj-add-title').value;
      const category = document.getElementById('proj-add-cat').value;
      const desc = document.getElementById('proj-add-desc').value;
      const tagsStr = document.getElementById('proj-add-tags').value;
      const gitLink = document.getElementById('proj-add-git').value;
      const tags = tagsStr.split(',').map(t => t.trim()).filter(t => t !== '');

      const projs = JSON.parse(localStorage.getItem('secops-projects')) || [];

      if (editingState.projects) {
        const item = projs.find(p => p.id === editingState.projects);
        if (item) {
          item.title = title;
          item.category = category;
          item.desc = desc;
          item.tags = tags;
          item.gitLink = gitLink;
        }
        editingState.projects = null;
        const btn = addProjForm.querySelector('button[type="submit"]');
        if (btn) btn.textContent = 'Register Project';
      } else {
        projs.unshift({
          id: 'proj-' + Date.now(),
          title, category, desc, tags, gitLink
        });
      }

      localStorage.setItem('secops-projects', JSON.stringify(projs));
      addProjForm.reset();
      populateAdminPanelLists();
      renderProjects();
    });

    addProjForm.addEventListener('reset', () => {
      editingState.projects = null;
      const btn = addProjForm.querySelector('button[type="submit"]');
      if (btn) btn.textContent = 'Register Project';
    });
  }

  // 3. ADD/UPDATE CERTIFICATE
  const addCertForm = document.getElementById('admin-add-cert-form');
  if (addCertForm) {
    addCertForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('cert-add-title').value;
      const issuer = document.getElementById('cert-add-issuer').value;
      const year = document.getElementById('cert-add-year').value;

      const certs = JSON.parse(localStorage.getItem('secops-certs')) || [];

      if (editingState.certs) {
        const item = certs.find(c => c.id === editingState.certs);
        if (item) {
          item.title = title;
          item.issuer = issuer;
          item.year = year;
        }
        editingState.certs = null;
        const btn = addCertForm.querySelector('button[type="submit"]');
        if (btn) btn.textContent = 'Add Certificate';
      } else {
        certs.unshift({
          id: 'cert-' + Date.now(),
          title, issuer, year, icon: 'lucide-award'
        });
      }

      localStorage.setItem('secops-certs', JSON.stringify(certs));
      addCertForm.reset();
      populateAdminPanelLists();
      renderCertsAndEdu();
    });

    addCertForm.addEventListener('reset', () => {
      editingState.certs = null;
      const btn = addCertForm.querySelector('button[type="submit"]');
      if (btn) btn.textContent = 'Add Certificate';
    });
  }

  // Shop add form handler removed

  // 4. ADD/UPDATE PORTAL LINK
  const addPortalForm = document.getElementById('admin-add-portal-form');
  if (addPortalForm) {
    addPortalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = document.getElementById('portal-add-type').value;
      const title = document.getElementById('portal-add-title').value;
      const desc = document.getElementById('portal-add-desc').value;
      const url = document.getElementById('portal-add-url').value;

      const portals = JSON.parse(localStorage.getItem('secops-portals')) || [];

      if (editingState.portal) {
        const item = portals.find(p => p.id === editingState.portal);
        if (item) {
          item.type = type;
          item.title = title;
          item.desc = desc;
          item.url = url;
        }
        editingState.portal = null;
        const btn = addPortalForm.querySelector('button[type="submit"]');
        if (btn) btn.textContent = 'Add Portal Link';
      } else {
        portals.push({
          id: 'portal-' + Date.now(),
          type, title, desc, url
        });
      }

      localStorage.setItem('secops-portals', JSON.stringify(portals));
      addPortalForm.reset();
      populateAdminPanelLists();
      renderPortalLink();
    });

    addPortalForm.addEventListener('reset', () => {
      editingState.portal = null;
      const btn = addPortalForm.querySelector('button[type="submit"]');
      if (btn) btn.textContent = 'Add Portal Link';
    });
  }

  // 5. ADD/UPDATE SKILL
  const addSkillForm = document.getElementById('admin-add-skill-form');
  if (addSkillForm) {
    addSkillForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('skill-add-name').value;
      const percent = parseInt(document.getElementById('skill-add-percent').value);

      const skills = JSON.parse(localStorage.getItem('secops-skills')) || [];

      if (editingState.skills) {
        const item = skills.find(s => s.id === editingState.skills);
        if (item) {
          item.name = name;
          item.percent = percent;
        }
        editingState.skills = null;
        const btn = addSkillForm.querySelector('button[type="submit"]');
        if (btn) btn.textContent = 'Add Skill';
      } else {
        skills.push({
          id: 'skill-' + Date.now(),
          name, percent
        });
      }

      localStorage.setItem('secops-skills', JSON.stringify(skills));
      addSkillForm.reset();
      populateAdminPanelLists();
      renderSkills();
    });

    addSkillForm.addEventListener('reset', () => {
      editingState.skills = null;
      const btn = addSkillForm.querySelector('button[type="submit"]');
      if (btn) btn.textContent = 'Add Skill';
    });
  }

  // 6. CONFIGURE CONTACT FORM (Standard vs Google Form)
  const configContactForm = document.getElementById('admin-config-contact-form');
  const contactModeSelect = document.getElementById('contact-mode-select');
  const googleUrlGroup = document.getElementById('google-form-url-group');

  if (contactModeSelect && googleUrlGroup) {
    contactModeSelect.addEventListener('change', () => {
      googleUrlGroup.style.display = contactModeSelect.value === 'google' ? 'block' : 'none';
    });
  }

  if (configContactForm) {
    configContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const mode = document.getElementById('contact-mode-select').value;
      const googleUrl = document.getElementById('contact-google-url').value;

      localStorage.setItem('secops-contact-config', JSON.stringify({ mode, googleUrl }));
      renderContactForm();
      alert('✉️ Contact Form settings updated successfully!');
    });
  }

  // 7. AUTHORIZE NEW IP
  const addIPForm = document.getElementById('admin-add-ip-form');
  if (addIPForm) {
    addIPForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newIP = document.getElementById('ip-add-val').value.trim();
      const allowedIPs = JSON.parse(localStorage.getItem('secops-allowed-ips')) || [];

      if (allowedIPs.includes(newIP)) {
        alert('This IP address is already authorized.');
        return;
      }

      allowedIPs.push(newIP);
      localStorage.setItem('secops-allowed-ips', JSON.stringify(allowedIPs));
      addIPForm.reset();
      populateAdminPanelLists();
      alert(`🔐 Firewall access rule added for IP ${newIP} successfully!`);
    });
  }
}

/* ==========================================
   POPULATE ADMIN EDIT/REMOVE LISTS
   ========================================== */
function populateAdminPanelLists() {
  // Populate Session System Diagnostics inside Admin Panel
  const aclOsEl = document.getElementById('acl-val-os');
  const aclBrowserEl = document.getElementById('acl-val-browser');
  const aclResEl = document.getElementById('acl-val-res');
  if (aclOsEl && aclBrowserEl && aclResEl) {
    const info = getSystemInfo();
    const parts = info.split(' (');
    aclOsEl.textContent = parts[0];
    aclBrowserEl.textContent = parts[1] ? parts[1].replace(')', '') : 'Unknown';
    aclResEl.textContent = `${window.screen.width} x ${window.screen.height}`;
  }

  // Experience list populate
  const expList = document.getElementById('admin-exp-list');
  if (expList) {
    const exps = JSON.parse(localStorage.getItem('secops-experience')) || [];
    expList.innerHTML = '';
    exps.forEach(e => {
      const row = document.createElement('div');
      row.className = 'admin-item-row';
      row.innerHTML = `
        <div class="admin-item-details">
          <h4>${e.role} @ ${e.company}</h4>
          <p>${e.date}</p>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <button class="admin-edit-btn" data-id="${e.id}" data-type="experience" style="background: rgba(var(--accent-rgb), 0.1); border: 1px solid rgba(var(--accent-rgb), 0.2); color: var(--accent); padding: 0.5rem; border-radius: 4px; cursor: pointer; transition: all 0.2s ease;"><i data-lucide="pencil" style="width: 16px; height: 16px; display: block;"></i></button>
          <button class="admin-delete-btn" data-id="${e.id}" data-type="experience"><i data-lucide="trash-2"></i></button>
        </div>
      `;
      expList.appendChild(row);
    });
  }

  // Projects list populate
  const projList = document.getElementById('admin-proj-list');
  if (projList) {
    const projs = JSON.parse(localStorage.getItem('secops-projects')) || [];
    projList.innerHTML = '';
    projs.forEach(p => {
      const row = document.createElement('div');
      row.className = 'admin-item-row';
      row.innerHTML = `
        <div class="admin-item-details">
          <h4>${p.title}</h4>
          <p>${p.category} • ${p.tags.join(', ')}</p>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <button class="admin-edit-btn" data-id="${p.id}" data-type="projects" style="background: rgba(var(--accent-rgb), 0.1); border: 1px solid rgba(var(--accent-rgb), 0.2); color: var(--accent); padding: 0.5rem; border-radius: 4px; cursor: pointer; transition: all 0.2s ease;"><i data-lucide="pencil" style="width: 16px; height: 16px; display: block;"></i></button>
          <button class="admin-delete-btn" data-id="${p.id}" data-type="projects"><i data-lucide="trash-2"></i></button>
        </div>
      `;
      projList.appendChild(row);
    });
  }

  // Certifications list populate
  const certList = document.getElementById('admin-certs-list');
  if (certList) {
    const certs = JSON.parse(localStorage.getItem('secops-certs')) || [];
    certList.innerHTML = '';
    certs.forEach(c => {
      const row = document.createElement('div');
      row.className = 'admin-item-row';
      row.innerHTML = `
        <div class="admin-item-details">
          <h4>${c.title}</h4>
          <p>${c.issuer} • ${c.year}</p>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <button class="admin-edit-btn" data-id="${c.id}" data-type="certs" style="background: rgba(var(--accent-rgb), 0.1); border: 1px solid rgba(var(--accent-rgb), 0.2); color: var(--accent); padding: 0.5rem; border-radius: 4px; cursor: pointer; transition: all 0.2s ease;"><i data-lucide="pencil" style="width: 16px; height: 16px; display: block;"></i></button>
          <button class="admin-delete-btn" data-id="${c.id}" data-type="certs"><i data-lucide="trash-2"></i></button>
        </div>
      `;
      certList.appendChild(row);
    });
  }

  // Shop populate catalog list removed

  // Skills list populate
  const adminSkillsList = document.getElementById('admin-skills-list');
  if (adminSkillsList) {
    const skills = JSON.parse(localStorage.getItem('secops-skills')) || [];
    adminSkillsList.innerHTML = '';
    skills.forEach(s => {
      const row = document.createElement('div');
      row.className = 'admin-item-row';
      row.innerHTML = `
        <div class="admin-item-details">
          <h4>${s.name}</h4>
          <p>Proficiency: ${s.percent}%</p>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <button class="admin-edit-btn" data-id="${s.id}" data-type="skills" style="background: rgba(var(--accent-rgb), 0.1); border: 1px solid rgba(var(--accent-rgb), 0.2); color: var(--accent); padding: 0.5rem; border-radius: 4px; cursor: pointer; transition: all 0.2s ease;"><i data-lucide="pencil" style="width: 16px; height: 16px; display: block;"></i></button>
          <button class="admin-delete-btn" data-id="${s.id}" data-type="skills"><i data-lucide="trash-2"></i></button>
        </div>
      `;
      adminSkillsList.appendChild(row);
    });
  }

  // Portals list populate
  const adminPortalsList = document.getElementById('admin-portals-list');
  if (adminPortalsList) {
    const portals = JSON.parse(localStorage.getItem('secops-portals')) || [];
    adminPortalsList.innerHTML = '';
    portals.forEach(p => {
      const row = document.createElement('div');
      row.className = 'admin-item-row';
      row.innerHTML = `
        <div class="admin-item-details">
          <h4>${p.title}</h4>
          <p>${p.type.toUpperCase()} • ${p.url}</p>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <button class="admin-edit-btn" data-id="${p.id}" data-type="portal" style="background: rgba(var(--accent-rgb), 0.1); border: 1px solid rgba(var(--accent-rgb), 0.2); color: var(--accent); padding: 0.5rem; border-radius: 4px; cursor: pointer; transition: all 0.2s ease;"><i data-lucide="pencil" style="width: 16px; height: 16px; display: block;"></i></button>
          <button class="admin-delete-btn" data-id="${p.id}" data-type="portal"><i data-lucide="trash-2"></i></button>
        </div>
      `;
      adminPortalsList.appendChild(row);
    });
  }

  // Inbox list populate
  const inboxList = document.getElementById('admin-inbox-list');
  if (inboxList) {
    const messages = JSON.parse(localStorage.getItem('secops-messages')) || [];
    inboxList.innerHTML = '';
    
    if (messages.length === 0) {
      inboxList.innerHTML = '<p style="color:hsl(var(--fg-muted)); text-align:center; padding: 2rem;">Inbox is empty.</p>';
    } else {
      messages.forEach(m => {
        const row = document.createElement('div');
        row.className = 'admin-item-row';
        row.style.cssText = 'flex-direction: column; align-items: flex-start; gap: 0.5rem; padding: 1rem;';
        row.innerHTML = `
          <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
            <h4 style="margin: 0; color: var(--accent);">${m.name}</h4>
            <span style="font-size: 0.8rem; color: var(--fg-muted);">${m.date}</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--fg-secondary); margin: 0;"><strong>Email:</strong> ${m.email} | <strong>System:</strong> ${m.system || 'Unknown'}</p>
          <p style="font-size: 0.9rem; color: var(--fg-bright); margin-top: 0.25rem; white-space: pre-wrap; background: rgba(0,0,0,0.15); border: 1px solid rgba(255,255,255,0.05); padding: 0.75rem; border-radius: 6px; width: 100%;">${m.message}</p>
          <div style="display: flex; justify-content: flex-end; width: 100%; margin-top: 0.5rem;">
            <button class="admin-delete-btn" data-id="${m.id}" data-type="message" style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: #ef4444; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 0.3rem;"><i data-lucide="trash-2" style="width: 14px; height: 14px;"></i> Delete</button>
          </div>
        `;
        inboxList.appendChild(row);
      });
    }
  }

  // Clear Inbox button listener
  const clearInboxBtn = document.getElementById('admin-clear-inbox-btn');
  if (clearInboxBtn) {
    // Clone button to remove previous event listeners
    const newBtn = clearInboxBtn.cloneNode(true);
    clearInboxBtn.parentNode.replaceChild(newBtn, clearInboxBtn);
    newBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all inbox messages?')) {
        localStorage.setItem('secops-messages', JSON.stringify([]));
        populateAdminPanelLists();
      }
    });
  }

  // IP Access List populate
  const aclList = document.getElementById('admin-acl-list');
  const currentIPDisplay = document.getElementById('acl-current-ip-display');
  if (aclList) {
    getCurrentIP().then(currentIP => {
      if (currentIPDisplay) currentIPDisplay.textContent = currentIP || 'Offline (Localhost)';

      const allowedIPs = JSON.parse(localStorage.getItem('secops-allowed-ips')) || [];
      aclList.innerHTML = '';

      allowedIPs.forEach(ip => {
        const row = document.createElement('div');
        row.className = 'admin-item-row';

        const isOwnIP = ip === currentIP;
        const deleteButton = isOwnIP
          ? `<span style="font-size: 0.8rem; color: #22c55e; background: rgba(34, 197, 94, 0.1); padding: 0.3rem 0.6rem; border-radius: 4px;">Active Session</span>`
          : `<button class="admin-delete-btn" data-id="${ip}" data-type="ip"><i data-lucide="trash-2"></i></button>`;

        row.innerHTML = `
          <div class="admin-item-details">
            <h4 style="font-family: monospace;">${ip}</h4>
            <p style="font-size: 0.8rem; color: var(--fg-muted);">${isOwnIP ? 'Your Current Authorized Laptop' : 'Authorized Access Point'}</p>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            ${deleteButton}
          </div>
        `;
        aclList.appendChild(row);
      });

      // Bind delete triggers for IP
      aclList.querySelectorAll('.admin-delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const ipToDelete = btn.getAttribute('data-id');
          if (confirm(`Remove IP authorization for ${ipToDelete}?`)) {
            deleteCVItem(ipToDelete, 'ip');
          }
        });
      });
      if (window.lucide) window.lucide.createIcons();
    });
  }

  // Bind deletion buttons events
  document.querySelectorAll('.admin-delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const type = btn.getAttribute('data-type');
      if (type !== 'ip') { // Handled separately due to async load
        deleteCVItem(id, type);
      }
    });
  });

  // Bind edit buttons events
  document.querySelectorAll('.admin-edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const type = btn.getAttribute('data-type');
      editCVItem(id, type);
    });
  });

  if (window.lucide) window.lucide.createIcons();
}

function deleteCVItem(id, type) {
  if (type === 'experience') {
    let exps = JSON.parse(localStorage.getItem('secops-experience')) || [];
    exps = exps.filter(e => e.id !== id);
    localStorage.setItem('secops-experience', JSON.stringify(exps));
    renderExperiences();
  } else if (type === 'projects') {
    let projs = JSON.parse(localStorage.getItem('secops-projects')) || [];
    projs = projs.filter(p => p.id !== id);
    localStorage.setItem('secops-projects', JSON.stringify(projs));
    renderProjects();
  } else if (type === 'certs') {
    let certs = JSON.parse(localStorage.getItem('secops-certs')) || [];
    certs = certs.filter(c => c.id !== id);
    localStorage.setItem('secops-certs', JSON.stringify(certs));
    renderCertsAndEdu();
  } else if (type === 'skills') {
    let skills = JSON.parse(localStorage.getItem('secops-skills')) || [];
    skills = skills.filter(s => s.id !== id);
    localStorage.setItem('secops-skills', JSON.stringify(skills));
    renderSkills();
  } else if (type === 'portal') {
    let portals = JSON.parse(localStorage.getItem('secops-portals')) || [];
    portals = portals.filter(p => p.id !== id);
    localStorage.setItem('secops-portals', JSON.stringify(portals));
    renderPortalLink();
  } else if (type === 'message') {
    let messages = JSON.parse(localStorage.getItem('secops-messages')) || [];
    messages = messages.filter(m => m.id !== id);
    localStorage.setItem('secops-messages', JSON.stringify(messages));
  } else if (type === 'ip') {
    let allowedIPs = JSON.parse(localStorage.getItem('secops-allowed-ips')) || [];
    allowedIPs = allowedIPs.filter(ip => ip !== id);
    localStorage.setItem('secops-allowed-ips', JSON.stringify(allowedIPs));
  }

  // If deleting the item currently being edited, reset the form
  if (editingState[type] === id) {
    let formEl = null;
    if (type === 'experience') formEl = document.getElementById('admin-add-exp-form');
    else if (type === 'projects') formEl = document.getElementById('admin-add-proj-form');
    else if (type === 'certs') formEl = document.getElementById('admin-add-cert-form');
    else if (type === 'skills') formEl = document.getElementById('admin-add-skill-form');
    else if (type === 'portal') formEl = document.getElementById('admin-add-portal-form');
    if (formEl) formEl.reset();
  }

  populateAdminPanelLists();
}

function editCVItem(id, type) {
  if (type === 'experience') {
    const exps = JSON.parse(localStorage.getItem('secops-experience')) || [];
    const item = exps.find(e => e.id === id);
    if (!item) return;

    editingState.experience = id;
    document.getElementById('exp-add-role').value = item.role;
    document.getElementById('exp-add-company').value = item.company;
    
    const parts = item.date.split('|');
    document.getElementById('exp-add-date').value = parts[0] ? parts[0].trim() : '';
    document.getElementById('exp-add-loc').value = parts[1] ? parts[1].trim() : '';
    document.getElementById('exp-add-bullets').value = item.bullets ? item.bullets.join(', ') : '';

    const form = document.getElementById('admin-add-exp-form');
    if (form) {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) btn.textContent = 'Update Experience';
    }
  } else if (type === 'projects') {
    const projs = JSON.parse(localStorage.getItem('secops-projects')) || [];
    const item = projs.find(p => p.id === id);
    if (!item) return;

    editingState.projects = id;
    document.getElementById('proj-add-title').value = item.title;
    document.getElementById('proj-add-cat').value = item.category;
    document.getElementById('proj-add-desc').value = item.desc;
    document.getElementById('proj-add-tags').value = item.tags ? item.tags.join(', ') : '';
    document.getElementById('proj-add-git').value = item.gitLink || '';

    const form = document.getElementById('admin-add-proj-form');
    if (form) {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) btn.textContent = 'Update Project';
    }
  } else if (type === 'certs') {
    const certs = JSON.parse(localStorage.getItem('secops-certs')) || [];
    const item = certs.find(c => c.id === id);
    if (!item) return;

    editingState.certs = id;
    document.getElementById('cert-add-title').value = item.title;
    document.getElementById('cert-add-issuer').value = item.issuer;
    document.getElementById('cert-add-year').value = item.year;

    const form = document.getElementById('admin-add-cert-form');
    if (form) {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) btn.textContent = 'Update Certificate';
    }
  } else if (type === 'skills') {
    const skills = JSON.parse(localStorage.getItem('secops-skills')) || [];
    const item = skills.find(s => s.id === id);
    if (!item) return;

    editingState.skills = id;
    document.getElementById('skill-add-name').value = item.name;
    document.getElementById('skill-add-percent').value = item.percent;

    const form = document.getElementById('admin-add-skill-form');
    if (form) {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) btn.textContent = 'Update Skill';
    }
  } else if (type === 'portal') {
    const portals = JSON.parse(localStorage.getItem('secops-portals')) || [];
    const item = portals.find(p => p.id === id);
    if (!item) return;

    editingState.portal = id;
    document.getElementById('portal-add-type').value = item.type;
    document.getElementById('portal-add-title').value = item.title;
    document.getElementById('portal-add-desc').value = item.desc;
    document.getElementById('portal-add-url').value = item.url;

    const form = document.getElementById('admin-add-portal-form');
    if (form) {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) btn.textContent = 'Update Portal Link';
    }
  }
}

/* ==========================================
   APPLY ACTIVE SECTION LAYOUT VISIBILITY
   ========================================== */
function applySectionVisibility() {
  const savedSections = JSON.parse(localStorage.getItem('secops-sections'));
  if (!savedSections) return;

  for (const [sectionId, isVisible] of Object.entries(savedSections)) {
    const secElement = document.getElementById(sectionId);
    
    // Also toggle corresponding links in header navigation menu
    let linkId = '';
    if (sectionId === 'about') linkId = 'link-about';
    else if (sectionId === 'experience') linkId = 'link-experience';
    else if (sectionId === 'projects') linkId = 'link-projects';
    else if (sectionId === 'credentials') linkId = 'link-credentials';
    else if (sectionId === 'dashboard') linkId = 'link-dashboard';

    const navLink = document.getElementById(linkId);

    if (isVisible) {
      if (secElement) secElement.style.display = 'block';
      if (navLink) navLink.parentNode.style.display = 'block';
    } else {
      if (secElement) secElement.style.display = 'none';
      if (navLink) navLink.parentNode.style.display = 'none';
    }
  }
}
