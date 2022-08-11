export type OutFoxLanguages = 'pt-BR' | 'Español' | 'Japanese' | 'German' | 'Polish' | 'French' | 'Italian' | 'Hebrew' | 'Slovak' | 'Czech' | 'Simplified Chinese'

export interface LeaderboardElementObject {
  description: string;
  emoji?: import('discord.js').EmojiIdentifierResolvable
}

export interface LeaderboardPagesObject {
  pageList: string[];
  individualElements: Array<string[] | LeaderboardElementObject[]>;
}

export interface HashBuildNote {
  type: 'hotfix' | 'hotfix_notice' | 'release_candidate' | 'notice';
  final_hash?: string;
  description?: string;
  hotfix_hash?: string
}

export interface HashBuild {
  date: string;
  name: string;
  buildtype: 'public' | 'testbuild' | 'private';
  exclusive: string | null;
  notes: HashBuildNote[]
}
