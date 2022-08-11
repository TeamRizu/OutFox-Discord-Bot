export interface ArchiveBuilds {
  DDRPC: Ddrpc;
  SM095: Sm095;
  SM164: Sm164;
  SM30: Sm30;
  SM39: Sm39;
  SM395: Sm395;
  OITG: Oitg;
  NOTITG: Notitg;
  SM4: Sm4;
  SMSSC: Smssc;
  SMSSCCUSTOM: Smssccustom;
  SM5: Sm5;
  ETT: Ett;
  OUTFOX: Outfox;
  ITGM: Itgm;
}

export interface OSBuildOptions {
  Name: string;
  Link: string;
}

export interface BuildListed {
  Name: string;
  Date?: string;
  ID?: string;
  Windows?: string;
  Linux?: string;
  Mac?: string;
  Src?: string;
}

export interface BuildList {
  Name: string;
  DefaultIcon: string;
  Description?: string;
  Listing: BuildListed[]
}

interface Ddrpc {
  Name: string;
  DefaultIcon: string;
  Description: string;
  Listing: Listing[];
}

interface Listing {
  Name: string;
  Date: string;
}

interface Sm095 {
  Name: string;
  DefaultIcon: string;
  Description: string;
  Listing: Listing2[];
}

interface Listing2 {
  Name: string;
  Date: string;
  ID?: string;
  Windows?: string;
}

interface Sm164 {
  Name: string;
  DefaultIcon: string;
  Description: string;
  Listing: Listing3[];
}

interface Listing3 {
  ID?: string;
  Name: string;
  Date?: string;
  Windows?: string;
  Src?: string;
}

interface Sm30 {
  Name: string;
  Description: string;
  DefaultIcon: string;
  Listing: Listing4[];
}

interface Listing4 {
  Name: string;
  Src?: string;
  Date?: string;
  Windows?: string;
  ID?: string;
  Icon?: string;
}

interface Sm39 {
  Name: string;
  DefaultIcon: string;
  Listing: Listing5[];
}

interface Listing5 {
  Name: string;
  Date?: string;
  Windows: any;
  Mac: any;
  Linux: any;
  Src: any;
  ID?: string;
  Icon?: string;
}

interface Sm395 {
  Name: string;
  DefaultIcon: string;
  Listing: Listing6[];
}

interface Listing6 {
  Name: string;
  Date?: string;
  Windows: any;
  Mac?: string;
  Linux?: string;
  Icon?: string;
  ID?: string;
}

interface Oitg {
  Name: string;
  DefaultIcon: string;
  Listing: Listing7[];
}

interface Listing7 {
  Icon?: string;
  Name: string;
  Date: string;
  Windows: any;
  ID?: string;
}

interface Notitg {
  Name: string;
  Website: string;
  DefaultIcon: string;
  Listing: Listing8[];
}

interface Listing8 {
  Icon: string;
  Name: string;
  Date: string;
  Windows: string;
}

interface Sm4 {
  Name: string;
  DefaultIcon: string;
  Listing: Listing9[];
}

interface Listing9 {
  Name: string;
  Date: string;
  Windows: any;
  Src?: string;
  Mac?: string;
  Linux?: string;
  Icon?: string;
}

interface Smssc {
  Name: string;
  DefaultIcon: string;
  Description: string;
  Listing: Listing10[];
}

interface Listing10 {
  Name: string;
  Src: string;
  Date?: string;
  Windows?: string;
  Icon?: string;
}

interface Smssccustom {
  Name: string;
  DefaultIcon: string;
  Listing: Listing11[];
}

interface Listing11 {
  Icon?: string;
  Name: string;
  Date?: string;
  Windows: any;
  Src?: string;
  Linux?: Linux[];
  ID?: string;
}

interface Linux {
  Name: string;
  Link: string;
}

interface Sm5 {
  Name: string;
  DefaultIcon: string;
  Listing: Listing12[];
}

interface Listing12 {
  Name: string;
  Date: string;
  Windows?: string;
  Mac?: string;
  Linux: any;
  Src?: string;
  ID?: string;
  Icon?: string;
}

interface Ett {
  Description: string;
  Name: string;
  Website: string;
  DefaultIcon: string;
  Listing: Listing13[];
}

interface Listing13 {
  Icon?: string;
  Name: string;
  Date: string;
  Windows: any;
  Mac?: string;
  Linux?: string;
  Src?: string;
}

interface Outfox {
  Description: string;
  Name: string;
  Website: string;
  DefaultIcon: string;
  Listing: Listing14[];
}

interface Listing14 {
  ID: string;
  Name: string;
  Date: string;
  Windows: any;
  Mac: any;
  Linux?: Linux2[];
}

interface Linux2 {
  Name: string;
  Link: string;
}

interface Itgm {
  Description: string;
  Website: string;
  Name: string;
  DefaultIcon: string;
  Listing: Listing15[];
}

interface Listing15 {
  ID: string;
  Name: string;
  Date: string;
  Windows: string;
  Mac: Mac[];
  Linux: string;
  Source: string;
}

interface Mac {
  Name: string;
  Link: string;
}
