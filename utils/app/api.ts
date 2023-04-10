import { Plugin, PluginID } from '@/types/plugin';

export const getEndpoint = (plugin: Plugin | null) => {
  if (!plugin) {
    return 'api/chat';
  }

  if (plugin.id === PluginID.GOOGLE_SEARCH) {
    return 'api/google';
  }

  if(plugin.id === PluginID.DALL_E_GENERATION) {
    return 'api/dalle';
  }

  return 'api/chat';
};
