import { KeyValuePair } from './data';

export interface Plugin {
  id: PluginID;
  name: PluginName;
  requiredKeys: KeyValuePair[];
}

export interface PluginKey {
  pluginId: PluginID;
  requiredKeys: KeyValuePair[];
}

export enum PluginID {
  GOOGLE_SEARCH = 'google-search',
  DALL_E_GENERATION = 'dall-e',
}

export enum PluginName {
  GOOGLE_SEARCH = 'Google Search',
  DALL_E_GENERATION = 'Dall-E Image Generation',
}

export const Plugins: Record<PluginID, Plugin> = {
  [PluginID.GOOGLE_SEARCH]: {
    id: PluginID.GOOGLE_SEARCH,
    name: PluginName.GOOGLE_SEARCH,
    requiredKeys: [
      {
        key: 'GOOGLE_API_KEY',
        value: '',
      },
      {
        key: 'GOOGLE_CSE_ID',
        value: '',
      },
    ],
  },
  [PluginID.DALL_E_GENERATION]: {
    id: PluginID.DALL_E_GENERATION,
    name: PluginName.DALL_E_GENERATION,
    requiredKeys: [],
  },
};

export const PluginList = Object.values(Plugins);
