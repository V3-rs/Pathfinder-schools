export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-200/80 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="text-lg font-semibold text-neutral-900">ScaleKind AI</span>
          <nav className="flex items-center gap-6">
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#solutions" className="nav-link">Solutions</a>
            <a href="#results" className="nav-link">Results</a>
            <a href="#clients" className="nav-link">Clients</a>
            <a href="#pilot" className="nav-link">Pilot Program</a>
            <a href="#consultation" className="text-sm font-medium text-[var(--accent)] hover:text-[#0a4a3c] transition-colors">
              Book Consultation
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="pt-32 pb-24 px-6 animate-fade-in">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-semibold text-neutral-900 tracking-tight leading-tight mb-6">
              Automate Intake & Follow-Ups. Serve More People.
            </h1>
            <p className="text-xl text-neutral-600 mb-10 max-w-2xl mx-auto">
              AI chatbots and CRM automation designed specifically for NGOs and impact-driven
              organizations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#consultation" className="btn-primary">
                Book a Free Consultation
              </a>
              <a href="#how-it-works" className="btn-secondary">
                See How It Works
              </a>
            </div>
            {/* Workflow diagram */}
            <div className="mt-16 p-8 rounded-2xl border-2 border-neutral-200 bg-white shadow-sm hover:shadow-md hover:border-[var(--accent)]/20 transition-all duration-300">
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-10 h-10 rounded-full bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)] font-medium">1</span>
                  <span className="text-neutral-700">Intake</span>
                </div>
                <span className="text-neutral-300 hidden sm:inline">→</span>
                <div className="flex items-center gap-2">
                  <span className="w-10 h-10 rounded-full bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)] font-medium">2</span>
                  <span className="text-neutral-700">CRM</span>
                </div>
                <span className="text-neutral-300 hidden sm:inline">→</span>
                <div className="flex items-center gap-2">
                  <span className="w-10 h-10 rounded-full bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)] font-medium">3</span>
                  <span className="text-neutral-700">Follow-Up</span>
                </div>
                <span className="text-neutral-300 hidden sm:inline">→</span>
                <div className="flex items-center gap-2">
                  <span className="w-10 h-10 rounded-full bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)] font-medium">4</span>
                  <span className="text-neutral-700">Reporting</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem */}
        <section id="problem" className="py-20 px-6 bg-white border-y border-neutral-100">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-900 mb-6">
              When Admin Overload Reduces Impact
            </h2>
            <ul className="text-left max-w-xl mx-auto space-y-3 text-neutral-600">
              <li className="flex items-start gap-3">
                <span className="text-neutral-400 mt-1">•</span>
                Manual data entry consuming staff time
              </li>
              <li className="flex items-start gap-3">
                <span className="text-neutral-400 mt-1">•</span>
                Missed follow-ups with donors and beneficiaries
              </li>
              <li className="flex items-start gap-3">
                <span className="text-neutral-400 mt-1">•</span>
                Fragmented systems that don&apos;t talk to each other
              </li>
              <li className="flex items-start gap-3">
                <span className="text-neutral-400 mt-1">•</span>
                Long intake response times
              </li>
              <li className="flex items-start gap-3">
                <span className="text-neutral-400 mt-1">•</span>
                Staff burnout from repetitive admin tasks
              </li>
            </ul>
          </div>
        </section>

        {/* Solution */}
        <section id="solutions" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-900 text-center mb-16">
              What We Automate
            </h2>
            <div className="grid sm:grid-cols-2 gap-8">
              {/* 1. AI Intake */}
              <div className="solution-card">
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                  AI Intake & Inquiry Chatbots
                </h3>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li>• Website or WhatsApp integration</li>
                  <li>• Beneficiary / donor qualification</li>
                  <li>• Multilingual support</li>
                  <li>• Smart routing to correct staff member</li>
                </ul>
              </div>
              {/* 2. CRM */}
              <div className="solution-card">
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                  CRM Automation
                </h3>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li>• Automated contact creation</li>
                  <li>• Lead/donor tagging & segmentation</li>
                  <li>• Pipeline updates & task assignment</li>
                  <li>• Deduplication</li>
                </ul>
              </div>
              {/* 3. Follow-Up */}
              <div className="solution-card">
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                  Follow-Up Systems
                </h3>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li>• Automated email/SMS sequences</li>
                  <li>• Smart reminders</li>
                  <li>• Re-engagement campaigns</li>
                  <li>• Escalation triggers</li>
                </ul>
              </div>
              {/* 4. Workflow */}
              <div className="solution-card">
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                  Workflow Automation
                </h3>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li>• Cross-tool integrations</li>
                  <li>• Reporting dashboards</li>
                  <li>• Intake-to-service tracking</li>
                  <li>• Admin task reduction</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 px-6 bg-white border-y border-neutral-100 overflow-hidden">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-900 text-center mb-4">
              Our 4-Step Implementation Process
            </h2>
            <p className="text-center text-neutral-600 mb-16 max-w-xl mx-auto">
              We emphasize sustainability, not one-off builds.
            </p>
            {/* Visual timeline */}
            <div className="relative">
              <div className="hidden lg:block absolute top-20 left-[15%] right-[15%] h-0.5 bg-[var(--accent)]/20 -translate-y-1/2" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
                <div className="relative flex flex-col items-center text-center workflow-step">
                  <div className="relative w-20 h-20 rounded-2xl bg-[var(--accent-light)] border-2 border-[var(--accent)]/30 flex items-center justify-center mb-4">
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[var(--accent)] text-white text-xs font-bold flex items-center justify-center shadow">1</span>
                    <svg className="w-9 h-9 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">Audit</h3>
                  <p className="text-sm text-neutral-600">Review current workflows, systems & pain points</p>
                  <div className="mt-2 flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)]/40" />
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)]/30" />
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)]/20" />
                  </div>
                </div>
                <div className="relative flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-2xl bg-[var(--accent-light)] border-2 border-[var(--accent)]/30 flex items-center justify-center mb-4">
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[var(--accent)] text-white text-xs font-bold flex items-center justify-center shadow">2</span>
                    <svg className="w-9 h-9 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">Design</h3>
                  <p className="text-sm text-neutral-600">Map optimized automation architecture</p>
                  <div className="mt-2 flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)]/40" />
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)]/30" />
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)]/20" />
                  </div>
                </div>
                <div className="relative flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-2xl bg-[var(--accent-light)] border-2 border-[var(--accent)]/30 flex items-center justify-center mb-4">
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[var(--accent)] text-white text-xs font-bold flex items-center justify-center shadow">3</span>
                    <svg className="w-9 h-9 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">Implement</h3>
                  <p className="text-sm text-neutral-600">Deploy chatbot, CRM & integrations</p>
                  <div className="mt-2 flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)]/40" />
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)]/30" />
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)]/20" />
                  </div>
                </div>
                <div className="relative flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-2xl bg-[var(--accent-light)] border-2 border-[var(--accent)]/30 flex items-center justify-center mb-4">
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[var(--accent)] text-white text-xs font-bold flex items-center justify-center shadow">4</span>
                    <svg className="w-9 h-9 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">Optimize</h3>
                  <p className="text-sm text-neutral-600">Monitor, improve & maintain</p>
                  <div className="mt-2 flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)]/40" />
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)]/30" />
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)]/20" />
                  </div>
                </div>
              </div>
            </div>
            {/* Process flow diagram */}
            <div className="mt-16 p-6 rounded-2xl border-2 border-neutral-100 bg-neutral-50/50">
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider text-center mb-4">Typical workflow</p>
              <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-neutral-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[var(--accent)]/30">
                  <span className="text-lg">📥</span>
                  <span className="text-sm font-medium">Inquiry</span>
                </div>
                <span className="text-neutral-300 text-xl">→</span>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-neutral-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[var(--accent)]/30">
                  <span className="text-lg">🤖</span>
                  <span className="text-sm font-medium">AI Chatbot</span>
                </div>
                <span className="text-neutral-300 text-xl">→</span>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-neutral-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[var(--accent)]/30">
                  <span className="text-lg">📋</span>
                  <span className="text-sm font-medium">CRM</span>
                </div>
                <span className="text-neutral-300 text-xl">→</span>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-neutral-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[var(--accent)]/30">
                  <span className="text-lg">✉️</span>
                  <span className="text-sm font-medium">Follow-Up</span>
                </div>
                <span className="text-neutral-300 text-xl">→</span>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent-light)] border border-[var(--accent)]/30 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105">
                  <span className="text-lg">📊</span>
                  <span className="text-sm font-medium">Reporting</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quantity-based Results */}
        <section id="results" className="py-20 px-6 bg-gradient-to-b from-[var(--accent-light)]/30 to-transparent">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-900 text-center mb-4">
              Quantified Results
            </h2>
            <p className="text-center text-neutral-600 mb-16 max-w-xl mx-auto">
              Typical outcomes from our implementations
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="stat-card">
                <p className="text-3xl sm:text-4xl font-bold text-[var(--accent)]">~70%</p>
                <p className="text-sm text-neutral-600 mt-2 font-medium">faster response time</p>
                <p className="text-xs text-neutral-500 mt-1">Inquiries answered in minutes</p>
              </div>
              <div className="stat-card">
                <p className="text-3xl sm:text-4xl font-bold text-[var(--accent)]">~40%</p>
                <p className="text-sm text-neutral-600 mt-2 font-medium">fewer admin hours</p>
                <p className="text-xs text-neutral-500 mt-1">Per week on intake & follow-up</p>
              </div>
              <div className="stat-card">
                <p className="text-3xl sm:text-4xl font-bold text-[var(--accent)]">95%+</p>
                <p className="text-sm text-neutral-600 mt-2 font-medium">follow-up completion</p>
                <p className="text-xs text-neutral-500 mt-1">Donor & beneficiary touchpoints</p>
              </div>
              <div className="stat-card">
                <p className="text-3xl sm:text-4xl font-bold text-[var(--accent)]">24/7</p>
                <p className="text-sm text-neutral-600 mt-2 font-medium">inquiry availability</p>
                <p className="text-xs text-neutral-500 mt-1">No missed after-hours leads</p>
              </div>
            </div>
          </div>
        </section>

        {/* Impact */}
        <section id="impact" className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-900 mb-6">
              Designed for Impact-Driven Organizations
            </h2>
            <p className="text-lg text-neutral-600 mb-10">
              Technology should amplify mission, not complicate it.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <p className="text-2xl font-semibold text-[var(--accent)]">Faster</p>
                <p className="text-sm text-neutral-500 mt-1">response times</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-[var(--accent)]">Fewer</p>
                <p className="text-sm text-neutral-500 mt-1">admin hours</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-[var(--accent)]">Better</p>
                <p className="text-sm text-neutral-500 mt-1">data accuracy</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-[var(--accent)]">Higher</p>
                <p className="text-sm text-neutral-500 mt-1">follow-up completion</p>
              </div>
            </div>
          </div>
        </section>

        {/* Past Clients */}
        <section id="clients" className="py-20 px-6 bg-white border-y border-neutral-100">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-900 mb-10">
              Past Clients
            </h2>
            <p className="text-neutral-600 mb-12 max-w-xl mx-auto">
              Organizations we&apos;ve helped automate intake and engagement.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center flex-wrap">
              <a
                href="https://quantumprot.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="client-card"
              >
                <img
                  src="https://quantumprot.com/logo.png"
                  alt="QuantumPro"
                  className="h-14 w-auto object-contain opacity-90 group-hover:opacity-100"
                />
                <span className="text-xl font-semibold text-neutral-800 group-hover:text-[var(--accent)]">
                  QuantumPro
                </span>
                <span className="text-sm text-neutral-500">AI Chatbots</span>
              </a>
              <a
                href="https://tetr.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="client-card"
              >
                <div className="h-14 flex items-center justify-center">
                  <span className="text-2xl font-bold tracking-tight text-neutral-800 group-hover:text-[var(--accent)] transition-colors duration-300">
                    Tetr
                  </span>
                </div>
                <span className="text-lg font-semibold text-neutral-800 group-hover:text-[var(--accent)] transition-colors duration-300">
                  Tetr College of Business
                </span>
                <span className="text-sm text-neutral-500">Education & Intake</span>
              </a>
            </div>
          </div>
        </section>

        {/* Pilot Program */}
        <section id="pilot" className="py-20 px-6 bg-[var(--accent-light)]/50 border-y border-[var(--accent)]/20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-900 mb-6">
              Free Pilot Program
            </h2>
            <ul className="text-left max-w-md mx-auto space-y-2 text-neutral-700 mb-8">
              <li>• Limited spots available</li>
              <li>• No upfront cost</li>
              <li>• Includes audit + build + deployment</li>
              <li>• In exchange for feedback & case study</li>
            </ul>
            <a
              href="https://calendly.com/ingkar-shokan-scalekindai/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Apply for Pilot
            </a>
          </div>
        </section>

        {/* About */}
        <section id="about" className="py-20 px-6 bg-white border-y border-neutral-100">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-900 mb-6">
              An International Team Focused on Operational Impact
            </h2>
            <p className="text-neutral-600 mb-4">
              ScaleKind AI is a team of founders from the UK, Germany, Italy, Singapore, Kazakhstan,
              and Mexico.
            </p>
            <p className="text-neutral-600 text-sm">
              Cross-cultural perspective. Systems thinking. Focus on measurable outcomes.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section id="consultation" className="py-24 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-900 mb-4">
              Let&apos;s Increase Your Operational Capacity
            </h2>
            <p className="text-neutral-600 mb-8">
              Book a 30-minute consultation to discuss your workflow and explore automation options.
            </p>
            <a
              href="https://calendly.com/ingkar-shokan-scalekindai/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Book a 30-Minute Consultation
            </a>
            <div className="mt-12 max-w-md mx-auto text-left">
              <h3 className="text-sm font-semibold text-neutral-700 mb-4">Contact form</h3>
              <form action="#" method="post" className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm text-neutral-600 mb-1">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm text-neutral-600 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm text-neutral-600 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="input-field resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary w-full"
                >
                  Send message
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-neutral-200 py-8 px-6">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-sm text-neutral-500">© ScaleKind AI. scalekind.ai</span>
            <div className="flex gap-6">
              <a href="#problem" className="text-sm text-neutral-500 hover:text-neutral-700">
                Problem
              </a>
              <a href="#solutions" className="text-sm text-neutral-500 hover:text-neutral-700">
                Solutions
              </a>
              <a href="#results" className="text-sm text-neutral-500 hover:text-neutral-700">
                Results
              </a>
              <a href="#how-it-works" className="text-sm text-neutral-500 hover:text-neutral-700">
                How It Works
              </a>
              <a href="#consultation" className="text-sm text-neutral-500 hover:text-neutral-700">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
