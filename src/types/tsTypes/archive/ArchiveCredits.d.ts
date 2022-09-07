export interface ArchiveCredits {
  Stepmania: Stepmanum[];
  Pulsen: Pulsen[];
  Mung1: Mung1[];
  Mung3: Mung3[];
  Keys6: Keys6[];
  OpenITG: OpenItg[];
}

interface Stepmanum {
  title: string;
  members: string[];
}

interface Pulsen {
  title: string;
  members: string[];
}

interface Mung1 {
  title: string;
  members: string[];
}

interface Mung3 {
  title: string;
  members: any[];
}

interface Keys6 {
  title: string;
  members: string[];
}

interface OpenItg {
  title: string;
  members: string[];
}
