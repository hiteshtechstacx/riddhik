'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Bell,
  Bot,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  Clock3,
  ContactRound,
  Database,
  Eye,
  FileText,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  Send,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X,
  Zap,
} from 'lucide-react'

type View = 'Dashboard' | 'Contacts' | 'Leads' | 'Tasks' | 'Orders' | 'Products' | 'Customers' | 'Analytics' | 'Reports'

type Lead = { name: string; company: string; email: string; value: string; status: string; score: number }

const navItems: { label: View; icon: typeof LayoutDashboard }[] = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Contacts', icon: ContactRound },
  { label: 'Leads', icon: Target },
  { label: 'Tasks', icon: ClipboardList },
  { label: 'Orders', icon: BriefcaseBusiness },
  { label: 'Products', icon: Package },
  { label: 'Customers', icon: Users },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Reports', icon: FileText },
]

const leads: Lead[] = [
  { name: 'Sarah Mitchell', company: 'Northstar Labs', email: 'sarah@northstarlabs.com', value: '₹4,80,000', status: 'Qualified', score: 92 },
  { name: 'Arjun Mehta', company: 'Apex Retail', email: 'arjun@apexretail.co', value: '₹2,35,000', status: 'Contacted', score: 76 },
  { name: 'Priya Shah', company: 'Vertex Health', email: 'priya@vertexhealth.in', value: '₹1,80,000', status: 'New', score: 68 },
  { name: 'Daniel Cooper', company: 'Brightside Media', email: 'daniel@brightside.io', value: '₹92,000', status: 'Proposal', score: 84 },
]

const activity = [
  { icon: Send, title: 'AI Agent sent a personalized follow-up', detail: 'Sarah Mitchell · Northstar Labs', time: '2 min ago', tone: 'blue' },
  { icon: Check, title: 'Lead qualified automatically', detail: 'Daniel Cooper · Brightside Media', time: '18 min ago', tone: 'green' },
  { icon: Clock3, title: 'Discovery call scheduled', detail: 'Arjun Mehta · tomorrow at 11:30 AM', time: '1 hr ago', tone: 'amber' },
  { icon: Users, title: 'New contact enriched from email', detail: 'Priya Shah · Vertex Health', time: '3 hrs ago', tone: 'purple' },
]

function StatusPill({ children }: { children: string }) {
  const tone = children === 'Qualified' || children === 'Completed' ? 'green' : children === 'New' ? 'blue' : children === 'Proposal' ? 'purple' : 'amber'
  return <span className={`status-pill ${tone}`}>{children}</span>
}

function StatCard({ icon: Icon, label, value, change, tone }: { icon: typeof Users; label: string; value: string; change: string; tone: string }) {
  return <div className={`stat-card ${tone}`}><div className="stat-icon"><Icon size={20} /></div><div><p>{label}</p><strong>{value}</strong><span><TrendingUp size={13} /> {change}</span></div></div>
}

function App() {
  const [view, setView] = useState<View>('Dashboard')
  const [query, setQuery] = useState('')
  const [agentPrompt, setAgentPrompt] = useState('Find high-value leads that need a follow-up')
  const [agentState, setAgentState] = useState<'idle' | 'running' | 'done'>('idle')
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [mobileNav, setMobileNav] = useState(false)

  const filteredLeads = useMemo(() => leads.filter((lead) => Object.values(lead).join(' ').toLowerCase().includes(query.toLowerCase())), [query])

  const runAgent = () => {
    setAgentState('running')
    window.setTimeout(() => setAgentState('done'), 1900)
  }

  return <div className="crm-shell">
    <aside className={`sidebar ${mobileNav ? 'open' : ''}`}>
      <div className="brand"><div className="brand-mark"><Sparkles size={18} /></div><span>agentic<span>CRM</span></span></div>
      <div className="workspace"><div className="avatar">A</div><div><strong>Acme Workspace</strong><small>Growth team</small></div><ChevronDown size={15} /></div>
      <nav aria-label="Main navigation">
        <p className="nav-label">Workspace</p>
        {navItems.map(({ label, icon: Icon }) => <button key={label} className={`nav-item ${view === label ? 'active' : ''}`} onClick={() => { setView(label); setMobileNav(false) }}><Icon size={18} /><span>{label}</span>{label === 'Tasks' && <b>4</b>}</button>)}
      </nav>
      <div className="sidebar-bottom"><button className="nav-item"><Settings size={18} /><span>Settings</span></button><div className="agent-status"><span className="pulse" /> AI agent is online</div></div>
    </aside>
    <main className="main-area">
      <header className="topbar"><button className="mobile-menu" aria-label="Open navigation" onClick={() => setMobileNav(true)}><Menu size={21} /></button><div><p className="eyebrow">Tuesday, October 29, 2025</p><h1>{view}</h1></div><div className="top-actions"><label className="global-search"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search your workspace..." /></label><button className="icon-button" aria-label="Notifications"><Bell size={19} /><i>3</i></button><div className="user-chip"><div className="avatar">A</div><span>Admin User</span><ChevronDown size={15} /></div></div></header>
      <div className="content">
        {view === 'Dashboard' ? <Dashboard agentPrompt={agentPrompt} setAgentPrompt={setAgentPrompt} agentState={agentState} runAgent={runAgent} setShowLeadModal={setShowLeadModal} setView={setView} filteredLeads={filteredLeads} setSelectedLead={setSelectedLead} /> : <GenericView view={view} query={query} setQuery={setQuery} filteredLeads={filteredLeads} setSelectedLead={setSelectedLead} setShowLeadModal={setShowLeadModal} />}
      </div>
    </main>
    {showLeadModal && <LeadModal close={() => setShowLeadModal(false)} />}
    {selectedLead && <DetailDrawer lead={selectedLead} close={() => setSelectedLead(null)} />}
  </div>
}

function Dashboard({ agentPrompt, setAgentPrompt, agentState, runAgent, setShowLeadModal, setView, filteredLeads, setSelectedLead }: { agentPrompt: string; setAgentPrompt: (v: string) => void; agentState: string; runAgent: () => void; setShowLeadModal: (v: boolean) => void; setView: (v: View) => void; filteredLeads: Lead[]; setSelectedLead: (v: Lead) => void }) {
  return <>
    <section className="welcome-row"><div><span className="section-kicker"><span className="pulse" /> Live workspace</span><h2>Good morning, Admin.</h2><p>Your AI team has been working while you focus on the work that matters.</p></div><button className="primary-button" onClick={() => setShowLeadModal(true)}><Plus size={17} /> Add lead</button></section>
    <section className="stat-grid"><StatCard icon={CircleDollarSign} label="Pipeline value" value="₹24.8L" change="18.4% this month" tone="blue" /><StatCard icon={Users} label="Active contacts" value="5,000" change="5.2% this month" tone="green" /><StatCard icon={Target} label="Qualified leads" value="248" change="12.6% this month" tone="amber" /><StatCard icon={TrendingUp} label="Win rate" value="32.8%" change="8.1% this month" tone="purple" /></section>
    <section className="dashboard-grid"><div className="panel agent-panel"><div className="panel-heading"><div className="heading-icon agent"><Bot size={19} /></div><div><h3>AI Revenue Agent</h3><p>Turn a goal into coordinated actions</p></div><span className="live-badge"><span className="pulse" /> Live</span></div><div className="agent-input"><Sparkles size={18} /><input value={agentPrompt} onChange={(e) => setAgentPrompt(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) runAgent() }} /><button onClick={runAgent} disabled={agentState === 'running'} aria-label="Run agent"><Send size={17} /></button></div><div className="suggestions"><span>Try a workflow</span><button onClick={() => setAgentPrompt('Summarize my pipeline risk')}>Summarize pipeline risk</button><button onClick={() => setAgentPrompt('Draft follow-ups for hot leads')}>Draft follow-ups</button><button onClick={() => setAgentPrompt('Show stalled opportunities')}>Find stalled deals</button></div>{agentState !== 'idle' && <div className={`agent-result ${agentState}`}><div className="workflow-line"><div className="workflow-node done"><Check size={13} /></div><span>Scanning CRM records</span><em>Done</em></div><div className="workflow-line"><div className={`workflow-node ${agentState === 'done' ? 'done' : 'working'}`}>{agentState === 'done' ? <Check size={13} /> : <Activity size={13} />}</div><span>Identifying high-intent leads</span><em>{agentState === 'done' ? 'Done' : 'Working'}</em></div><div className="workflow-line"><div className={`workflow-node ${agentState === 'done' ? 'done' : ''}`}>{agentState === 'done' ? <Check size={13} /> : <Clock3 size={13} />}</div><span>Preparing personalized actions</span><em>{agentState === 'done' ? 'Done' : 'Queued'}</em></div>{agentState === 'done' && <div className="result-summary"><strong>Workflow complete</strong><span>12 leads prioritized · 7 follow-ups drafted · ₹8.4L opportunity value identified</span><button onClick={() => setView('Tasks')}>Review actions <ArrowUpRight size={14} /></button></div>}</div>}</div><div className="panel pipeline-panel"><div className="panel-heading"><div><h3>Pipeline snapshot</h3><p>Opportunity flow across your team</p></div><button className="text-button" onClick={() => setView('Analytics')}>View analytics <ArrowUpRight size={14} /></button></div><div className="pipeline"><div><span>New</span><strong>84</strong><div className="bar"><i style={{ width: '72%' }} /></div><small>₹6.2L</small></div><div><span>Contacted</span><strong>56</strong><div className="bar"><i style={{ width: '53%' }} /></div><small>₹4.8L</small></div><div><span>Qualified</span><strong>38</strong><div className="bar"><i style={{ width: '39%' }} /></div><small>₹7.4L</small></div><div><span>Proposal</span><strong>21</strong><div className="bar"><i style={{ width: '26%' }} /></div><small>₹6.4L</small></div></div></div></section>
    <section className="lower-grid"><div className="panel"><div className="panel-heading"><div><h3>Recent leads</h3><p>Prioritized by AI intent score</p></div><button className="text-button" onClick={() => setView('Leads')}>View all <ArrowUpRight size={14} /></button></div><div className="table-wrap"><table><thead><tr><th>Lead</th><th>Company</th><th>Intent</th><th>Stage</th><th /></tr></thead><tbody>{filteredLeads.slice(0, 4).map((lead) => <tr key={lead.email}><td><button className="lead-name" onClick={() => setSelectedLead(lead)}><span className="mini-avatar">{lead.name.charAt(0)}</span>{lead.name}</button></td><td>{lead.company}</td><td><span className="intent"><span className="intent-dot" />{lead.score}%</span></td><td><StatusPill>{lead.status}</StatusPill></td><td><button className="row-action" onClick={() => setSelectedLead(lead)} aria-label={`View ${lead.name}`}><Eye size={16} /></button></td></tr>)}</tbody></table></div></div><div className="panel activity-panel"><div className="panel-heading"><div><h3>Agent activity</h3><p>What your AI team did today</p></div><button className="icon-button"><MoreHorizontal size={18} /></button></div><div className="activity-list">{activity.map(({ icon: Icon, title, detail, time, tone }) => <div className="activity-item" key={title}><div className={`activity-icon ${tone}`}><Icon size={15} /></div><div><strong>{title}</strong><span>{detail}</span><small>{time}</small></div></div>)}</div></div></section>
  </>
}

function GenericView({ view, query, setQuery, filteredLeads, setSelectedLead, setShowLeadModal }: { view: View; query: string; setQuery: (v: string) => void; filteredLeads: Lead[]; setSelectedLead: (v: Lead) => void; setShowLeadModal: (v: boolean) => void }) {
  const rows = filteredLeads.length ? filteredLeads : leads
  return <><section className="welcome-row"><div><span className="section-kicker"><Database size={13} /> Demo data view</span><h2>{view} workspace</h2><p>Explore hard-coded CRM records and agent-ready insights for your live demo.</p></div><button className="primary-button" onClick={() => setShowLeadModal(true)}><Plus size={17} /> Add record</button></section><section className="stat-grid"><StatCard icon={Users} label={`Total ${view.toLowerCase()}`} value={view === 'Products' ? '5,000' : view === 'Orders' ? '1,435' : '1,248'} change="12.4% this month" tone="blue" /><StatCard icon={CircleDollarSign} label="Total value" value="₹14.05L" change="8.3% this month" tone="green" /><StatCard icon={Zap} label="AI actions" value="364" change="24.8% this month" tone="purple" /></section><div className="panel full-panel"><div className="panel-heading"><div><h3>All {view}</h3><p>Search, inspect, and act on your CRM data</p></div><label className="table-search"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${view.toLowerCase()}...`} /></label></div><div className="table-wrap"><table><thead><tr><th>Name</th><th>Company</th><th>Email</th><th>Value</th><th>Status</th><th /></tr></thead><tbody>{rows.concat(rows).slice(0, 7).map((lead, index) => <tr key={`${lead.email}-${index}`}><td><button className="lead-name" onClick={() => setSelectedLead(lead)}><span className="mini-avatar">{lead.name.charAt(0)}</span>{lead.name}</button></td><td>{lead.company}</td><td>{lead.email}</td><td>{lead.value}</td><td><StatusPill>{lead.status}</StatusPill></td><td><button className="row-action" onClick={() => setSelectedLead(lead)}><Eye size={16} /></button></td></tr>)}</tbody></table></div></div></>
}

function LeadModal({ close }: { close: () => void }) { return <div className="overlay" onMouseDown={close}><div className="modal" onMouseDown={(e) => e.stopPropagation()}><div className="modal-heading"><div><h3>Add a new lead</h3><p>Create a record for your AI agent to work with.</p></div><button className="icon-button" onClick={close} aria-label="Close"><X size={18} /></button></div><div className="form-grid"><label>Full name<input placeholder="e.g. Maya Patel" /></label><label>Company<input placeholder="e.g. Acme Inc." /></label><label>Email<input placeholder="maya@company.com" /></label><label>Opportunity value<input placeholder="₹0" /></label></div><div className="modal-actions"><button className="secondary-button" onClick={close}>Cancel</button><button className="primary-button" onClick={close}><Plus size={16} /> Create lead</button></div></div></div> }
function DetailDrawer({ lead, close }: { lead: Lead; close: () => void }) { return <div className="overlay" onMouseDown={close}><aside className="drawer" onMouseDown={(e) => e.stopPropagation()}><div className="drawer-top"><button className="icon-button" onClick={close} aria-label="Close"><X size={18} /></button><button className="secondary-button">Edit record</button></div><div className="detail-identity"><div className="large-avatar">{lead.name.charAt(0)}</div><h2>{lead.name}</h2><p>{lead.company}</p><StatusPill>{lead.status}</StatusPill></div><div className="detail-score"><span>AI intent score</span><strong>{lead.score}<small>/100</small></strong><div className="score-bar"><i style={{ width: `${lead.score}%` }} /></div><p>High-intent lead. Recommend a personalized follow-up within 24 hours.</p></div><dl className="detail-list"><div><dt>Email</dt><dd>{lead.email}</dd></div><div><dt>Opportunity</dt><dd>{lead.value}</dd></div><div><dt>Owner</dt><dd>Admin User</dd></div></dl><button className="primary-button full-button" onClick={close}><Sparkles size={16} /> Ask AI to follow up</button></aside></div> }

export default App
