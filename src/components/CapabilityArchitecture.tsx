import { useEffect, useRef, useState } from 'react'
import {
  AppWindow, ArrowLeftRight, Bot, Boxes, Code2, Eye,
  FileSpreadsheet, FileText, Mail, MessageSquare, MonitorCog, PanelsTopLeft,
  PenLine, Plus, Presentation, Server, UsersRound, Webhook,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import './capability-architecture.css'

type ArchitectureNodeData = {
  name: string
  detail?: string
  icon: LucideIcon
  color?: string
}

const integrations: ArchitectureNodeData[] = [
  { name: 'OA · ERP · CRM', icon: AppWindow },
  { name: 'Email', icon: Mail },
  { name: 'Team chat', icon: MessageSquare },
  { name: 'AI & agents', icon: Bot },
  { name: 'Custom apps', icon: Plus },
]

const editors: ArchitectureNodeData[] = [
  { name: 'Document', detail: 'Markdown · Notes', icon: FileText, color: '#70d4dc' },
  { name: 'Writer', detail: 'Word · DOCX', icon: PenLine, color: '#91b9ff' },
  { name: 'Sheet', detail: 'Excel · XLSX', icon: FileSpreadsheet, color: '#8bd3ae' },
  { name: 'Presentation', detail: 'PowerPoint · PPTX', icon: Presentation, color: '#eeb398' },
]

const capabilities: ArchitectureNodeData[] = [
  { name: 'Online preview', icon: Eye },
  { name: 'Collaborative editing', icon: UsersRound },
  { name: 'Import & export', icon: ArrowLeftRight },
]

const interfaces: ArchitectureNodeData[] = [
  { name: 'JavaScript SDK', detail: 'Embed · Customize UI', icon: Code2 },
  { name: 'Server APIs', detail: 'Read · Write · Convert', icon: Server },
  { name: 'Callbacks & events', detail: 'Files · Users · Permissions · Watermarks', icon: Webhook },
]

const deployment: ArchitectureNodeData[] = [
  { name: 'Kubernetes', icon: Boxes },
  { name: 'Visual installer', icon: PanelsTopLeft },
  { name: 'Operations console', icon: MonitorCog },
]

function ArchitectureNode({ name, detail, icon: Icon, color }: ArchitectureNodeData) {
  return (
    <li className="architecture-node">
      <Icon size={22} strokeWidth={1.6} style={color ? { color } : undefined} aria-hidden="true" />
      <div><strong>{name}</strong>{detail && <span>{detail}</span>}</div>
    </li>
  )
}

function LayerConnector() {
  return (
    <div className="architecture-layer-connector" aria-hidden="true">
      <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
        <path d="M10 28V3M6 7l4-4 4 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

const diagramWidth = 1264
const diagramHeight = 656

function ArchitectureDiagram({ animated = false }: { animated?: boolean }) {
  return (
    <svg className={`architecture-diagram${animated ? ' architecture-is-animating' : ''}`} width={diagramWidth} height={diagramHeight}
      viewBox={`0 0 ${diagramWidth} ${diagramHeight}`} preserveAspectRatio="xMidYMid meet"
      role="group" aria-label="Office SDK architecture: deployment supports integration interfaces, document capabilities, and your applications">
      <foreignObject x="12" y="12" width="1240" height="632">
        <div className="architecture-map">
          <div className="architecture-layer architecture-applications">
            <h3><a href="/solutions">Your applications</a></h3>
            <ul className="architecture-nodes architecture-apps">
              {integrations.map(node => <ArchitectureNode key={node.name} {...node} />)}
            </ul>
          </div>

          <LayerConnector />

          <div className="architecture-layer architecture-core">
            <h3><a href="/product/core-editors">Office SDK editors</a></h3>
            <ul className="architecture-nodes architecture-editors">
              {editors.map(node => <ArchitectureNode key={node.name} {...node} />)}
            </ul>
            <ul className="architecture-nodes architecture-capability-list">
              {capabilities.map(node => <ArchitectureNode key={node.name} {...node} />)}
            </ul>
          </div>

          <LayerConnector />

          <div className="architecture-layer architecture-interfaces">
            <h3><a href="/product">Integration APIs</a></h3>
            <ul className="architecture-nodes architecture-services">
              {interfaces.map(node => <ArchitectureNode key={node.name} {...node} />)}
            </ul>
          </div>

          <LayerConnector />

          <div className="architecture-layer architecture-deployment">
            <h3><a href="/deployment">Self-hosted deployment</a></h3>
            <ul className="architecture-nodes architecture-services">
              {deployment.map(node => <ArchitectureNode key={node.name} {...node} />)}
            </ul>
          </div>
        </div>
      </foreignObject>
    </svg>
  )
}

export default function CapabilityArchitecture() {
  const overviewRef = useRef<HTMLDivElement>(null)
  const [overviewVisible, setOverviewVisible] = useState(false)

  useEffect(() => {
    const overview = overviewRef.current
    if (!overview) return
    const observer = new IntersectionObserver(([entry]) => setOverviewVisible(entry.isIntersecting), { threshold: .1 })
    observer.observe(overview)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="capability-architecture" id="capabilities" aria-labelledby="architecture-title">
      <div className="architecture-container">
        <div className="architecture-heading">
          <h2 id="architecture-title">One platform. <em>Every document workflow.</em></h2>
          <div className="architecture-summary">
            <p className="architecture-value-copy">Collaborative editors. Open APIs. Self-hosted.</p>
          </div>
        </div>
        <div className="architecture-overview" ref={overviewRef}>
          <ArchitectureDiagram animated={overviewVisible} />
        </div>
      </div>
    </section>
  )
}
