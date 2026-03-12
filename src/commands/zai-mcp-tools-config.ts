import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEFAULT_AGENT_ID } from '../routing/session-key.js';
import { resolveAgentWorkspaceDir } from '../agents/agent-scope.js';

interface ZaiMcpConfig {
  servers: {
    zread: {
      type: 'stdio' | 'http';
      server: string;
      apiKey: string;
    };
    'zai-vision': {
      type: 'stdio' | 'http';
      server: string;
      apiKey: string;
    };
    'zai-web-search': {
      type: 'stdio' | 'http';
      server: string;
      apiKey: string;
    };
  };
}

export function configureZaiMcpTools(apiKey: string): void {
  const workspaceDir = resolveAgentWorkspaceDir(DEFAULT_AGENT_ID);
  const configPath = resolve(workspaceDir, 'config', 'mcporter.json');
  
  // 确保目录存在
  const configDir = resolve(configPath, '..');
  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
  }

  // 规范化 API key，移除重复的 "Bearer " 前缀
  const normalizedApiKey = apiKey.replace(/^Bearer\s+/i, '').trim();
  
  const config: ZaiMcpConfig = {
    servers: {
      zread: {
        type: 'http',
        server: 'https://api.z.ai/api/mcp/zread/mcp',
        apiKey: normalizedApiKey
      },
      'zai-vision': {
        type: 'stdio',
        server: 'https://api.z.ai/api/mcp/zai-vision/mcp',
        apiKey: normalizedApiKey
      },
      'zai-web-search': {
        type: 'http',
        server: 'https://api.z.ai/api/mcp/zai-web-search/mcp',
        apiKey: normalizedApiKey
      }
    }
  };

  // 只在配置不存在时写入，避免静默覆盖
  if (!existsSync(configPath)) {
    writeFileSync(configPath, JSON.stringify(config, null, 2));
  } else {
    // 读取现有配置并合并，保留用户自定义设置
    const existingConfig = JSON.parse(readFileSync(configPath, 'utf-8'));
    const mergedConfig = {
      ...existingConfig,
      servers: {
        ...existingConfig.servers,
        ...config.servers
      }
    };
    writeFileSync(configPath, JSON.stringify(mergedConfig, null, 2));
  }
}