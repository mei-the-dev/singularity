import { useQuery } from '@tanstack/react-query';
import type { MCPTool, ServiceStatus } from '../types';

// Mock MCP client - replace with actual implementation that calls MCP server
const mcpClient = {
  checkStorybookStatus: async () => ({
    running: true,
    healthy: true,
    components: 12,
    url: 'http://localhost:6006',
  }),

  checkServices: async (ports: number[]) => {
    const status: Record<number, boolean> = {};
    ports.forEach((port) => (status[port] = true));
    return status;
  },

  listTools: async (): Promise<MCPTool[]> => [
    { name: 'scaffold_component', description: 'Generate component', status: 'ready', category: 'Components' },
    { name: 'run_visual_tests', description: 'Visual tests', status: 'ready', category: 'Testing' },
  ],
};

export function useMCPStatus() {
  const tools = useQuery({
    queryKey: ['mcp', 'tools'],
    queryFn: mcpClient.listTools,
    refetchInterval: 10000,
  });

  const services = useQuery({
    queryKey: ['mcp', 'services'],
    queryFn: async (): Promise<ServiceStatus[]> => {
      const ports = await mcpClient.checkServices([6006, 3000, 8080]);
      return [
        { name: 'Storybook', port: 6006, status: ports[6006] ? 'running' : 'stopped', health: 'healthy' },
        { name: 'Next.js', port: 3000, status: ports[3000] ? 'running' : 'stopped', health: 'healthy' },
        { name: 'MCP Server', port: 8080, status: ports[8080] ? 'running' : 'stopped', health: 'healthy' },
      ];
    },
    refetchInterval: 5000,
  });

  return {
    tools: tools.data ?? [],
    services: services.data ?? [],
    isLoading: tools.isLoading || services.isLoading,
    error: tools.error || services.error,
  };
}

export default useMCPStatus;
