import React, { useState } from 'react';
import { BRAND } from '../config/brand';
import { AGENT_RECIPES, CI_RECIPES, MCP_TOOLS } from '../data/integrations';
import { Link } from '../lib/router';
import { PageMasthead } from '../components/layout/PageMasthead';
import { CodeBlock } from '../components/ui/CodeBlock';
import {
  AntigravityIcon,
  AzureDevOpsIcon,
  ChevronRightIcon,
  ClaudeIcon,
  CursorIcon,
  FileTextIcon,
  GitHubActionsIcon,
  GitLabIcon,
  VSCodeIcon,
} from '../components/ui/Icons';

type BrandIcon = React.FC<{ className?: string }>;

const AGENT_ICONS: Record<string, BrandIcon> = {
  'claude-code': ClaudeIcon,
  cursor: CursorIcon,
  vscode: VSCodeIcon,
  antigravity: AntigravityIcon,
  'static-agent-file': FileTextIcon,
};

const CI_ICONS: Record<string, BrandIcon> = {
  'github-actions': GitHubActionsIcon,
  'azure-devops': AzureDevOpsIcon,
  'gitlab-ci': GitLabIcon,
};

export const IntegrationsPage: React.FC = () => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(AGENT_RECIPES[0].id);
  const [selectedToolName, setSelectedToolName] = useState<string>(MCP_TOOLS[0].name);
  const [selectedCiId, setSelectedCiId] = useState<string>(CI_RECIPES[0].id);

  const activeAgent =
    AGENT_RECIPES.find((a) => a.id === selectedAgentId) ?? AGENT_RECIPES[0];
  const activeTool =
    MCP_TOOLS.find((t) => t.name === selectedToolName) ?? MCP_TOOLS[0];
  const activeCi = CI_RECIPES.find((c) => c.id === selectedCiId) ?? CI_RECIPES[0];

  const ActiveAgentIcon = AGENT_ICONS[activeAgent.id] ?? FileTextIcon;
  const ActiveCiIcon = CI_ICONS[activeCi.id] ?? FileTextIcon;

  const handleAgentTabKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    idx: number
  ) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const nextIdx =
      e.key === 'ArrowRight'
        ? (idx + 1) % AGENT_RECIPES.length
        : (idx - 1 + AGENT_RECIPES.length) % AGENT_RECIPES.length;
    setSelectedAgentId(AGENT_RECIPES[nextIdx].id);
    document.getElementById(`agent-tab-${AGENT_RECIPES[nextIdx].id}`)?.focus();
  };

  const handleCiTabKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    idx: number
  ) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const nextIdx =
      e.key === 'ArrowRight'
        ? (idx + 1) % CI_RECIPES.length
        : (idx - 1 + CI_RECIPES.length) % CI_RECIPES.length;
    setSelectedCiId(CI_RECIPES[nextIdx].id);
    document.getElementById(`ci-tab-${CI_RECIPES[nextIdx].id}`)?.focus();
  };

  return (
    <>
      <PageMasthead
        pixelLines={['INTEGRATIONS']}
        srTitle={`MCP Coding Agents & CI/CD Integrations — ${BRAND.name}`}
        summary="Connect live static architecture DNA to Claude Code, Cursor, VS Code Copilot, and Antigravity over Model Context Protocol, or enforce compiler-free pull-request gates in GitHub Actions, Azure DevOps, and GitLab CI."
        aside={
          <Link to="/docs/exit-codes" className="link-quiet">
            <span>Exit Codes &amp; Baselines</span>
            <ChevronRightIcon className="size-3.5" />
          </Link>
        }
      />

      {/* Section 1: AI Coding Agent Setup Recipes */}
      <section
        id="mcp-editors"
        aria-labelledby="mcp-editors-heading"
        className="border-b border-[var(--color-border-subtle)] py-14 sm:py-18 md:py-22"
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
          <div className="max-w-[38rem]">
            <h2
              id="mcp-editors-heading"
              className="m-0 text-[clamp(1.65rem,2.9vw,2.35rem)] font-medium tracking-[-0.025em] leading-[1.16] text-balance text-[var(--color-text-primary)]"
            >
              Connect your AI coding agent in one configuration block.
            </h2>
            <p className="mt-3 mb-0 font-editorial-sans text-base leading-[1.6] text-pretty text-[var(--color-text-secondary)]">
              Running <code className="font-editorial-mono text-xs">{BRAND.cliBinary} . --mcp</code>{' '}
              starts a zero-network stdio server directly inside your local workspace.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="AI coding agent editors"
            className="tablist-scroll mt-8 border-b border-[var(--color-border-strong)] sm:mt-10"
          >
            {AGENT_RECIPES.map((agent, idx) => {
              const selected = agent.id === activeAgent.id;
              const AgentIcon = AGENT_ICONS[agent.id] ?? FileTextIcon;
              return (
                <button
                  key={agent.id}
                  id={`agent-tab-${agent.id}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls={`agent-panel-${agent.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setSelectedAgentId(agent.id)}
                  onKeyDown={(e) => handleAgentTabKeyDown(e, idx)}
                  className={`inline-flex min-h-[46px] shrink-0 cursor-pointer items-center gap-2 border-b-2 px-3.5 font-editorial-mono text-xs whitespace-nowrap transition-colors duration-150 sm:px-5 ${
                    selected
                      ? 'border-[var(--color-text-primary)] font-medium text-[var(--color-text-primary)]'
                      : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  <AgentIcon className="size-[18px] shrink-0" />
                  {agent.name}
                </button>
              );
            })}
          </div>

          <div
            id={`agent-panel-${activeAgent.id}`}
            role="tabpanel"
            aria-labelledby={`agent-tab-${activeAgent.id}`}
            className="grid grid-cols-1 border-x border-b border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] lg:grid-cols-12"
          >
            <div className="min-w-0 border-b border-[var(--color-border-subtle)] p-4 sm:p-7 lg:col-span-5 lg:border-r lg:border-b-0">
              <code className="inline-block break-words [overflow-wrap:anywhere] rounded-[3px] bg-[var(--color-bg-sunken)] px-2 py-1 font-editorial-mono text-xs text-[var(--color-text-primary)]">
                {activeAgent.configPath}
              </code>
              <h3 className="mt-4 mb-0 flex items-center gap-2.5 font-editorial-sans text-lg font-medium text-[var(--color-text-primary)]">
                <ActiveAgentIcon className="size-5 shrink-0" />
                <span>{activeAgent.name} Setup</span>
              </h3>
              <p className="mt-2.5 mb-0 max-w-[30rem] font-editorial-sans text-sm leading-[1.6] text-[var(--color-text-secondary)]">
                {activeAgent.summary}
              </p>
            </div>

            <div className="min-w-0 lg:col-span-7">
              <CodeBlock
                label={`${activeAgent.name} · ${activeAgent.configPath}`}
                code={activeAgent.snippet}
                tone="inverse"
                className="border-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Interactive 4-Tool MCP Payload Inspector */}
      <section
        id="mcp-tools"
        aria-labelledby="mcp-tools-heading"
        className="border-b border-[var(--color-border-subtle)] py-14 sm:py-18 md:py-22"
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
          <div className="max-w-[38rem]">
            <h2
              id="mcp-tools-heading"
              className="m-0 text-[clamp(1.65rem,2.9vw,2.35rem)] font-medium tracking-[-0.025em] leading-[1.16] text-balance text-[var(--color-text-primary)]"
            >
              Four structural MCP tools exposed to your agent.
            </h2>
            <p className="mt-3 mb-0 font-editorial-sans text-base leading-[1.6] text-pretty text-[var(--color-text-secondary)]">
              Inspect the structured responses returned to LLM tool calls over local stdio.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] sm:mt-10 lg:grid-cols-12">
            <div className="grid min-w-0 grid-cols-1 divide-y divide-[var(--color-border-subtle)] border-b border-[var(--color-border-strong)] sm:grid-cols-2 sm:divide-y-0 lg:col-span-4 lg:grid-cols-1 lg:divide-y lg:border-r lg:border-b-0">
              {MCP_TOOLS.map((tool, tIdx) => {
                const selected = tool.name === activeTool.name;
                const tabletCellBorders =
                  (tIdx < 2 ? 'sm:border-b ' : '') +
                  (tIdx % 2 === 0 ? 'sm:border-r ' : '') +
                  'sm:border-[var(--color-border-subtle)] lg:border-r-0';
                return (
                  <button
                    key={tool.name}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setSelectedToolName(tool.name)}
                    className={`flex min-h-[48px] w-full min-w-0 cursor-pointer flex-col items-start gap-1.5 px-4 py-3.5 text-left transition-colors duration-150 sm:px-5 sm:py-4 ${tabletCellBorders} ${
                      selected
                        ? 'bg-[var(--color-bg-sunken)]'
                        : 'bg-transparent hover:bg-[var(--color-bg-subtle)]'
                    }`}
                  >
                    <span className="break-words [overflow-wrap:anywhere] font-editorial-mono text-xs font-medium text-[var(--color-text-primary)] sm:text-[0.8125rem]">
                      {tool.name}
                    </span>
                    <span className="font-editorial-sans text-xs leading-[1.45] text-[var(--color-text-secondary)]">
                      {tool.whenAgentCallsIt}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex min-w-0 flex-col justify-between lg:col-span-8">
              <div className="border-b border-[var(--color-border-subtle)] p-4 sm:p-7">
                <code className="block break-words [overflow-wrap:anywhere] font-editorial-mono text-xs font-medium text-[var(--color-text-primary)] sm:text-sm">
                  {activeTool.signature}
                </code>
                <p className="mt-2.5 mb-0 max-w-[38rem] font-editorial-sans text-sm leading-[1.6] text-[var(--color-text-secondary)]">
                  {activeTool.purpose}
                </p>
              </div>

              <CodeBlock
                label={`MCP Tool Response · ${activeTool.name}`}
                code={activeTool.sampleResponse}
                tone="inverse"
                className="border-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: CI/CD Pipeline Recipes */}
      <section
        id="ci-pipelines"
        aria-labelledby="ci-pipelines-heading"
        className="py-14 sm:py-18 md:py-24"
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
          <div className="max-w-[38rem]">
            <h2
              id="ci-pipelines-heading"
              className="m-0 text-[clamp(1.65rem,2.9vw,2.35rem)] font-medium tracking-[-0.025em] leading-[1.16] text-balance text-[var(--color-text-primary)]"
            >
              CI/CD pull-request guardrails &amp; SARIF code scanning.
            </h2>
            <p className="mt-3 mb-0 font-editorial-sans text-base leading-[1.6] text-pretty text-[var(--color-text-secondary)]">
              Run architecture verification as an independent fast-fail job before expensive test
              containers or NuGet restores even start.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="CI/CD platforms"
            className="tablist-scroll mt-8 border-b border-[var(--color-border-strong)] sm:mt-10"
          >
            {CI_RECIPES.map((ci, idx) => {
              const selected = ci.id === activeCi.id;
              const CiIcon = CI_ICONS[ci.id] ?? FileTextIcon;
              return (
                <button
                  key={ci.id}
                  id={`ci-tab-${ci.id}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls={`ci-panel-${ci.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setSelectedCiId(ci.id)}
                  onKeyDown={(e) => handleCiTabKeyDown(e, idx)}
                  className={`inline-flex min-h-[46px] shrink-0 cursor-pointer items-center gap-2 border-b-2 px-3.5 font-editorial-mono text-xs whitespace-nowrap transition-colors duration-150 sm:px-5 ${
                    selected
                      ? 'border-[var(--color-text-primary)] font-medium text-[var(--color-text-primary)]'
                      : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  <CiIcon className="size-[18px] shrink-0" />
                  {ci.name}
                </button>
              );
            })}
          </div>

          <div
            id={`ci-panel-${activeCi.id}`}
            role="tabpanel"
            aria-labelledby={`ci-tab-${activeCi.id}`}
            className="grid grid-cols-1 border-x border-b border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] lg:grid-cols-12"
          >
            <div className="min-w-0 border-b border-[var(--color-border-subtle)] p-4 sm:p-7 lg:col-span-5 lg:border-r lg:border-b-0">
              <code className="inline-block break-words [overflow-wrap:anywhere] rounded-[3px] bg-[var(--color-bg-sunken)] px-2 py-1 font-editorial-mono text-xs text-[var(--color-text-primary)]">
                {activeCi.configPath}
              </code>
              <h3 className="mt-4 mb-0 flex items-center gap-2.5 font-editorial-sans text-lg font-medium text-[var(--color-text-primary)]">
                <ActiveCiIcon className="size-5 shrink-0" />
                <span>{activeCi.name}</span>
              </h3>
              <ul className="mt-4 mb-0 list-none space-y-2.5 p-0">
                {activeCi.highlights.map((item) => (
                  <li
                    key={item}
                    className="border-l border-[var(--color-border-strong)] pl-3 font-editorial-sans text-sm leading-[1.55] text-[var(--color-text-secondary)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0 lg:col-span-7">
              <CodeBlock
                label={activeCi.configPath}
                code={activeCi.snippet}
                tone="inverse"
                className="border-0"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default IntegrationsPage;
