import { resolveAgentWorkspaceDir } from '../agents/agent-scope.js';
import { DEFAULT_AGENT_ID } from '../routing/session-key.js';
import { configureZaiMcpTools } from './zai-mcp-tools-config.js';

export function applyZaiProvider(apiKey: string): void {
  try {
    // 使用正确的 workspace 目录路径
    const workspaceDir = resolveAgentWorkspaceDir(DEFAULT_AGENT_ID);
    
    // 配置 Z.AI MCP tools
    configureZaiMcpTools(apiKey);
    
    console.log('✅ Z.AI MCP tools configured successfully');
  } catch (error) {
    console.warn('⚠️ Failed to configure Z.AI MCP tools:', error.message);
  }
}