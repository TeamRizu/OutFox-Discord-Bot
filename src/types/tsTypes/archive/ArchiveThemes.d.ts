export interface ArchiveThemes {
  'SM3.9': Sm39;
  'SM3.9_Plus': Sm39Plus;
  'SM3.95': Sm395;
  SM4: Sm4;
  OITG: Oitg;
  NITG: Nitg;
  'SM-SSC': SmSsc;
  'StepMania 5': StepMania5;
  OutFox: OutFox;
}

export interface ThemeLinkObject {
  Name: string;
  Link?: string;
  Date?: string;
}

export interface ThemeObject {
  Name: string;
  Link?: string | ThemeLinkObject;
  Date?: string;
  Author?: string;
  Version?: string;
  HasImages?: boolean;
}

interface Sm39 {
  Name: string;
  AceComb: AceComb;
  BlazMix: BlazMix;
  BLEACH: Bleach;
  CS1: Cs1;
  CS2: Cs2;
  'CS2.5': Cs25;
  'CS2.6': Cs26;
  CS3: Cs3;
  'CS3.1': Cs31;
  'CS3.5': Cs35;
  CS4: Cs4;
  CS5: Cs5;
  CS6: Cs6;
  CitySc: CitySc;
  D3M: D3M;
  D3Mix: D3Mix;
  D3Mix2: D3Mix2;
  D3Mix3: D3Mix3;
  DDRX: Ddrx;
  DDRRED: Ddrred;
  DDR3rd: Ddr3rd;
  DDR4th: Ddr4th;
  DDR5th: Ddr5th;
  DDRltf: Ddrltf;
  DDRUSA: Ddrusa;
  DDRPha: Ddrpha;
  DDRXxM: DdrxxM;
  DDRExt: Ddrext;
  DDRMAX: Ddrmax;
  DDRMAX2: Ddrmax2;
  DDRPCol: Ddrpcol;
  DDRSNBT2: Ddrsnbt2;
  DJR: Djr;
  D1SMS: D1Sms;
  FFR: Ffr;
  FM2: Fm2;
  FMP: Fmp;
  FM: Fm;
  FB2: Fb2;
  IIDX12: Iidx12;
  IIDX14: Iidx14;
  IIDX15: Iidx15;
  ITG1: Itg1;
  ITG2: Itg2;
  InvSM: InvSm;
  KzUM: KzUm;
  MM: Mm;
  NPREX3: Nprex3;
  PIUPREX3IKK: Piuprex3Ikk;
  NCRx11: Ncrx11;
  NocN: NocN;
  NAKeT: NakeT;
  oni4: Oni4;
  paint: Paint;
  panzer2nd: Panzer2nd;
  panzer3rd: Panzer3rd;
  panzer4th: Panzer4th;
  panzer5th: Panzer5th;
  Parn4th: Parn4th;
  PDNG: Pdng;
  pcd1: Pcd1;
  pcd2: Pcd2;
  PIUP: Piup;
  PIUMIL: Piumil;
  RLoung: Rloung;
  RN: Rn;
  SDOM: Sdom;
  SMNXARC3: Smnxarc3;
  SMU: Smu;
  SMLB: Smlb;
  SOMS: Soms;
  SSR: Ssr;
  SMSD: Smsd;
  SBS: Sbs;
  SSB: Ssb;
  SMlp: Smlp;
  SZero: Szero;
  'TF2.9': Tf29;
  'TF3.1': Tf31;
  Simpsons: Simpsons;
  TDRMix: Tdrmix;
  TM3: Tm3;
  TM5: Tm5;
  XXM2: Xxm2;
  YS: Ys;
  ZSM: Zsm;
  DDel: Ddel;
}

interface AceComb {
  Name: string;
  Link: string;
}

interface BlazMix {
  Name: string;
  Link: string;
}

interface Bleach {
  Name: string;
  Link: string;
}

interface Cs1 {
  Name: string;
  Date: string;
  Link: string;
}

interface Cs2 {
  Name: string;
  Date: string;
  Link: string;
}

interface Cs25 {
  Name: string;
  Date: string;
  Link: string;
}

interface Cs26 {
  Name: string;
  Date: string;
  Link: string;
}

interface Cs3 {
  Name: string;
  Date: string;
  Link: string;
}

interface Cs31 {
  Name: string;
  Date: string;
  Link: string;
}

interface Cs35 {
  Name: string;
  Link: string;
}

interface Cs4 {
  Name: string;
  Link: string;
}

interface Cs5 {
  Name: string;
  Date: string;
  Link: string;
}

interface Cs6 {
  Name: string;
  Date: string;
  Link: string;
}

interface CitySc {
  Name: string;
  Link: string;
}

interface D3M {
  Name: string;
  Link: string;
}

interface D3Mix {
  Name: string;
  Link: string;
}

interface D3Mix2 {
  Name: string;
  Link: string;
}

interface D3Mix3 {
  Name: string;
  Link: string;
}

interface Ddrx {
  Name: string;
  Date: string;
  Link: string;
}

interface Ddrred {
  Name: string;
  Link: string;
}

interface Ddr3rd {
  Name: string;
  Link: string;
}

interface Ddr4th {
  Name: string;
  Link: string;
}

interface Ddr5th {
  Name: string;
  Link: string;
}

interface Ddrltf {
  Name: string;
  Link: string;
}

interface Ddrusa {
  Name: string;
  Link: string;
}

interface Ddrpha {
  Name: string;
  Link: string;
}

interface DdrxxM {
  Name: string;
  Link: string;
}

interface Ddrext {
  Name: string;
  Date: string;
  Link: string;
}

interface Ddrmax {
  Name: string;
  Link: string;
}

interface Ddrmax2 {
  Name: string;
  Link: string;
}

interface Ddrpcol {
  Name: string;
  Link: string;
}

interface Ddrsnbt2 {
  Name: string;
  Link: string;
}

interface Djr {
  Name: string;
  Link: string;
}

interface D1Sms {
  Name: string;
  Link: string;
}

interface Ffr {
  Name: string;
  Link: string;
}

interface Fm2 {
  Name: string;
  Link: string;
}

interface Fmp {
  Name: string;
  Link: string;
}

interface Fm {
  Name: string;
  Link: string;
}

interface Fb2 {
  Name: string;
  Link: string;
}

interface Iidx12 {
  Name: string;
  Link: string;
}

interface Iidx14 {
  Name: string;
  Link: string;
}

interface Iidx15 {
  Name: string;
  Link: string;
}

interface Itg1 {
  Name: string;
  Link: string;
}

interface Itg2 {
  Name: string;
  Link: string;
}

interface InvSm {
  Name: string;
  Link: string;
}

interface KzUm {
  Name: string;
  Link: string;
}

interface Mm {
  Name: string;
  Link: string;
}

interface Nprex3 {
  Name: string;
  Link: Link[];
}

interface Link {
  Name: string;
  Date: string;
  Link: string;
}

interface Piuprex3Ikk {
  Name: string;
  Author: string;
  Date: string;
  Link: string;
}

interface Ncrx11 {
  Name: string;
  Link: string;
}

interface NocN {
  Name: string;
  Link: string;
}

interface NakeT {
  Name: string;
  Link: string;
}

interface Oni4 {
  Name: string;
  Link: string;
}

interface Paint {
  Name: string;
  Link: string;
}

interface Panzer2nd {
  Name: string;
  Link: string;
}

interface Panzer3rd {
  Name: string;
  Link: string;
}

interface Panzer4th {
  Name: string;
  Link: string;
}

interface Panzer5th {
  Name: string;
  Link: string;
}

interface Parn4th {
  Name: string;
  Date: string;
  Link: string;
}

interface Pdng {
  Name: string;
  Link: string;
}

interface Pcd1 {
  Name: string;
  Link: string;
}

interface Pcd2 {
  Name: string;
  Date: string;
  Link: string;
}

interface Piup {
  Name: string;
  Link: string;
}

interface Piumil {
  Name: string;
  Link: string;
}

interface Rloung {
  Name: string;
  Link: string;
}

interface Rn {
  Name: string;
  Link: string;
}

interface Sdom {
  Name: string;
  Author: string;
  Link: string;
}

interface Smnxarc3 {
  Name: string;
  Link: string;
}

interface Smu {
  Name: string;
  Link: string;
}

interface Smlb {
  Name: string;
  Link: string;
}

interface Soms {
  Name: string;
  Date: string;
  Link: string;
}

interface Ssr {
  Name: string;
  Link: string;
}

interface Smsd {
  Name: string;
  Link: string;
}

interface Sbs {
  Name: string;
  Date: string;
  Link: string;
}

interface Ssb {
  Name: string;
  Link: string;
}

interface Smlp {
  Name: string;
  Author: string;
  Date: string;
  Link: string;
}

interface Szero {
  Name: string;
  Link: string;
}

interface Tf29 {
  Name: string;
  Link: string;
}

interface Tf31 {
  Name: string;
  Link: string;
}

interface Simpsons {
  Name: string;
  Link: string;
}

interface Tdrmix {
  Name: string;
  Date: string;
  Link: string;
}

interface Tm3 {
  Name: string;
  Link: string;
}

interface Tm5 {
  Name: string;
  Link: string;
}

interface Xxm2 {
  Name: string;
  Date: string;
  Link: string;
}

interface Ys {
  Name: string;
  Link: string;
}

interface Zsm {
  Name: string;
  Author: string;
  Link: string;
}

interface Ddel {
  Name: string;
  Date: string;
  Link: string;
}

interface Sm39Plus {
  Name: string;
  DDRA: Ddra;
  IIDX14: Iidx142;
  IIDX15: Iidx152;
  PXIV: Pxiv;
  PXVI: Pxvi;
  PXVII: Pxvii;
  PXVIII: Pxviii;
  PArS: ParS;
  PXIII: Pxiii;
}

interface Ddra {
  Name: string;
  Author: string;
  Link: Link2[];
}

interface Link2 {
  Name: string;
  Date?: string;
  Link: string;
}

interface Iidx142 {
  Name: string;
  Link: string;
}

interface Iidx152 {
  Name: string;
  Link: string;
}

interface Pxiv {
  Name: string;
  Link: string;
}

interface Pxvi {
  Name: string;
  Link: string;
}

interface Pxvii {
  Name: string;
  Link: string;
}

interface Pxviii {
  Name: string;
  Link: string;
}

interface ParS {
  Name: string;
  Link: string;
}

interface Pxiii {
  Name: string;
  Link: string;
}

interface Sm395 {
  Name: string;
  CUEv5: Cuev5;
  Staiainv2: Staiainv2;
  Xoon3: Xoon3;
  Xoon4: Xoon4;
  ITGPRO: Itgpro;
  ITG2UE: Itg2Ue;
  HG2: Hg2;
  ITG3: Itg3;
  'G3.0': G30;
  G2: G2;
  ITG3GOLD: Itg3Gold;
  ITG2Pink: Itg2Pink;
  ITG2GOLD: Itg2Gold;
  ITG500Z: Itg500Z;
}

interface Cuev5 {
  Name: string;
  Link: string;
}

interface Staiainv2 {
  Name: string;
  Link: string;
}

interface Xoon3 {
  Name: string;
  Link: string;
}

interface Xoon4 {
  Name: string;
  Link: string;
}

interface Itgpro {
  Name: string;
  Link: string;
}

interface Itg2Ue {
  Name: string;
  Link: string;
}

interface Hg2 {
  Name: string;
  Link: string;
}

interface Itg3 {
  Name: string;
  Link: string;
}

interface G30 {
  Name: string;
  Link: string;
}

interface G2 {
  Name: string;
  Link: Link3[];
}

interface Link3 {
  Name: string;
  Link: string;
}

interface Itg3Gold {
  Name: string;
  Link: string;
}

interface Itg2Pink {
  Name: string;
  Link: string;
}

interface Itg2Gold {
  Name: string;
  Link: string;
}

interface Itg500Z {
  Name: string;
  Link: string;
}

interface Sm4 {
  Name: string;
  CeruleanSkies: CeruleanSkies;
  d11DX: D11Dx;
  DWI: Dwi;
  EZDC2: Ezdc2;
  EyeBlue: EyeBlue;
  Moonlight: Moonlight;
  NAKET: Naket;
  NCR: Ncr;
  Strike: Strike;
}

interface CeruleanSkies {
  Name: string;
  Author: string;
  Version: string;
  Link: string;
}

interface D11Dx {
  Name: string;
  Author: string;
  Link: string;
}

interface Dwi {
  Name: string;
  Author: string;
  Link: string;
}

interface Ezdc2 {
  Name: string;
  Link: string;
}

interface EyeBlue {
  Name: string;
  Link: string;
}

interface Moonlight {
  Name: string;
  Author: string;
  Link: Link4[];
}

interface Link4 {
  Name: string;
  Date: string;
  Link: string;
}

interface Naket {
  Name: string;
  Author: string;
  Link: string;
}

interface Ncr {
  Name: string;
  Author: string;
  Link: string;
}

interface Strike {
  Name: string;
  Author: string;
  Link: string;
}

interface Oitg {
  Name: string;
  Industrial: Industrial;
  GrooveNightsiss19: GrooveNightsiss19;
  GrooveNightswuo: GrooveNightswuo;
  ITG3Encore: Itg3Encore;
  ITGParty: Itgparty;
  Deco: Deco;
  Empress: Empress;
  Retro: Retro;
  Meat: Meat;
  Mlp: Mlp;
  Obscurity: Obscurity;
  NewNovaE: NewNovaE;
  DWI: Dwi2;
  PrismRhythm15: PrismRhythm15;
  PrismRhythm16: PrismRhythm16;
  SLGJUVM: Slgjuvm;
  Tactics: Tactics;
  WolfNightmare: WolfNightmare;
  SITG: Sitg;
}

interface Industrial {
  Name: string;
  Link: string;
}

interface GrooveNightsiss19 {
  Name: string;
  Link: string;
}

interface GrooveNightswuo {
  Name: string;
  Link: string;
}

interface Itg3Encore {
  Name: string;
  Link: string;
}

interface Itgparty {
  Name: string;
  Link: string;
}

interface Deco {
  Name: string;
  HasImages: boolean;
  Link: string;
}

interface Empress {
  Name: string;
  HasImages: boolean;
  Link: string;
}

interface Retro {
  Name: string;
  Link: string;
}

interface Meat {
  Name: string;
  HasImages: boolean;
  Link: string;
}

interface Mlp {
  Name: string;
  HasImages: boolean;
  Link: string;
}

interface Obscurity {
  Name: string;
  HasImages: boolean;
  Link: string;
}

interface NewNovaE {
  Name: string;
  Author: string;
  Date: string;
  Link: Link5[];
}

interface Link5 {
  Name: string;
  Date: string;
  Link: string;
}

interface Dwi2 {
  Name: string;
  Author: string;
  Date: string;
  Link: Link6[];
}

interface Link6 {
  Name: string;
  Date: string;
  Link: string;
}

interface PrismRhythm15 {
  Name: string;
  Date: string;
  Version: string;
  Link: Link7[];
}

interface Link7 {
  Name: string;
  Link: string;
}

interface PrismRhythm16 {
  Name: string;
  Date: string;
  Link: string;
}

interface Slgjuvm {
  Name: string;
  HasImages: boolean;
  Link: string;
}

interface Tactics {
  Name: string;
  HasImages: boolean;
  Link: string;
}

interface WolfNightmare {
  Name: string;
  Link: string;
}

interface Sitg {
  Name: string;
  Author: string;
  Link: Link8[];
}

interface Link8 {
  Name: string;
  Link: string;
  Date?: string;
}

interface Nitg {
  Name: string;
  SLOat: Sloat;
}

interface Sloat {
  Name: string;
  HasImages: boolean;
  Date: string;
  Author: string;
  Link: string;
}

interface SmSsc {
  Name: string;
  Delta: Delta;
  Moonlight: Moonlight2;
  Optical: Optical;
  Zenith: Zenith;
}

interface Delta {
  Name: string;
  Date: string;
  Author: string;
  Link: string;
}

interface Moonlight2 {
  Name: string;
  Date: string;
  Author: string;
  Link: string;
}

interface Optical {
  Name: string;
  Author: string;
  Link: string;
}

interface Zenith {
  Name: string;
  Date: string;
  Author: string;
  Link: string;
}

interface StepMania5 {
  Name: string;
  Barebone: Barebone;
  CS7MS: Cs7Ms;
  CS8S: Cs8S;
  CS8LA: Cs8La;
  D3NEX: D3Nex;
  D3NEXM: D3Nexm;
  DDR2013: Ddr2013;
  DDRAKENp: Ddrakenp;
  DDRA20: Ddra20;
  DDRACurilang: Ddracurilang;
  DDRA20Curilang: Ddra20Curilang;
  DDRA20M: Ddra20M;
  DDR5th: Ddr5th2;
  DDRNG: Ddrng;
  DDRNMini: Ddrnmini;
  DDR7th: Ddr7th;
  Kuro: Kuro;
  Lazarus: Lazarus;
  '02ManiaEX': N02ManiaEx;
  SIGMA: Sigma;
  SMXG: Smxg;
  SimplyLove: SimplyLove;
  SMSuperNova: SmsuperNova;
  SMPREX3: Smprex3;
  StRev: StRev;
  TKMix: Tkmix;
  SMTvE: SmtvE;
  Moonlight: Moonlight3;
  TimeRift: TimeRift;
  Optical: Optical2;
  XV: Xv;
  sw2: Sw2;
  starlight: Starlight;
  Waterfall: Waterfall;
  WFExpanded: Wfexpanded;
  ultralight: Ultralight;
  UPSRT: Upsrt;
  'XIX.SUPER': XixSuper;
}

interface Barebone {
  Name: string;
  HasImages: boolean;
  Author: string;
  Version: string;
  Link: string;
}

interface Cs7Ms {
  Name: string;
  Author: string;
  Version: string;
  Link: Link9[];
}

interface Link9 {
  Name: string;
  Date?: string;
  Link: string;
  NeedsImageUpdate?: boolean;
}

interface Cs8S {
  Name: string;
  Author: string;
  Version: string;
  HasImages: boolean;
  Link: Link10[];
}

interface Link10 {
  Name: string;
  Date: string;
  Link: string;
}

interface Cs8La {
  Name: string;
  Author: string;
  Version: string;
  HasImages: boolean;
  Link: Link11[];
}

interface Link11 {
  Name: string;
  Date: string;
  Link: string;
}

interface D3Nex {
  Name: string;
  Version: string;
  Link: string;
}

interface D3Nexm {
  Name: string;
  Version: string;
  Link: string;
}

interface Ddr2013 {
  Name: string;
  Version: string;
  Link: string;
}

interface Ddrakenp {
  Name: string;
  Date: string;
  Version: string;
  Link: string;
}

interface Ddra20 {
  Name: string;
  Date: string;
  Version: string;
  Link: string;
}

interface Ddracurilang {
  Name: string;
  Author: string;
  Date: string;
  Link: string;
}

interface Ddra20Curilang {
  Name: string;
  Author: string;
  Date: string;
  Link: string;
}

interface Ddra20M {
  Name: string;
  Author: string;
  Date: string;
  Link: string;
}

interface Ddr5th2 {
  Name: string;
  HasImages: boolean;
  Date: string;
  Author: string;
  Version: string;
  Link: string;
}

interface Ddrng {
  Name: string;
  Date: string;
  Version: string;
  Link: string;
}

interface Ddrnmini {
  Name: string;
  Author: string;
  Date: string;
  Link: string;
}

interface Ddr7th {
  Name: string;
  Date: string;
  Version: string;
  Link: Link12[];
}

interface Link12 {
  Name: string;
  Link: string;
}

interface Kuro {
  Name: string;
  Date: string;
  Version: string;
  Link: string;
}

interface Lazarus {
  Name: string;
  HasImages: boolean;
  Date: string;
  Author: string;
  Version: string;
  Link: string;
}

interface N02ManiaEx {
  Name: string;
  Date: string;
  Version: string;
  Link: string;
}

interface Sigma {
  Name: string;
  Author: string;
  Date: string;
  Version: string;
  HasImages: boolean;
  Link: string;
}

interface Smxg {
  Name: string;
  Author: string;
  Date: string;
  Link: string;
}

interface SimplyLove {
  Name: string;
  Link: Link13[];
}

interface Link13 {
  Name: string;
  Date: string;
  Link: string;
}

interface SmsuperNova {
  Name: string;
  Link: string;
}

interface Smprex3 {
  Name: string;
  Link: string;
}

interface StRev {
  Name: string;
  HasImages: boolean;
  Author: string;
  Link: Link14[];
}

interface Link14 {
  Name: string;
  Date: string;
  Link: string;
}

interface Tkmix {
  Name: string;
  Link: string;
}

interface SmtvE {
  Name: string;
  Link: string;
}

interface Moonlight3 {
  Name: string;
  Date: string;
  Author: string;
  Link: string;
}

interface TimeRift {
  Name: string;
  Link: string;
}

interface Optical2 {
  Name: string;
  Link: string;
}

interface Xv {
  Name: string;
  Author: string;
  Link: Link15[];
}

interface Link15 {
  Name: string;
  Date: string;
  Link: string;
}

interface Sw2 {
  Name: string;
  HasImages: boolean;
  Link: string;
}

interface Starlight {
  Name: string;
  HasImages: boolean;
  Author: string;
  Link: Link16[];
}

interface Link16 {
  Name: string;
  Date?: string;
  Link: string;
}

interface Waterfall {
  Name: string;
  Author: string;
  Link: string;
}

interface Wfexpanded {
  Name: string;
  Author: string;
  Date: string;
  Link: string;
}

interface Ultralight {
  Name: string;
  HasImages: boolean;
  Link: string;
}

interface Upsrt {
  Name: string;
  HasImages: boolean;
  Link: string;
}

interface XixSuper {
  Name: string;
  HasImages: boolean;
  Date: string;
  Link: string;
}

interface OutFox {
  Name: string;
  GN: Gn;
  Infinitesimal: Infinitesimal;
  SoundWaves: SoundWaves;
  starlight: Starlight2;
  Superuser: Superuser;
}

interface Gn {
  Name: string;
  Date: string;
  Author: string;
  Link: string;
}

interface Infinitesimal {
  Name: string;
  Date: string;
  Author: string;
  Link: string;
}

interface SoundWaves {
  Name: string;
  Author: string;
  Link: Link17[];
}

interface Link17 {
  Name: string;
  Date: string;
  Link: string;
}

interface Starlight2 {
  Name: string;
  Author: string;
  Link: Link18[];
}

interface Link18 {
  Name: string;
  Date: string;
  Link: string;
}

interface Superuser {
  Name: string;
  Author: string;
  Link: Link19[];
}

interface Link19 {
  Name: string;
  Date: string;
  Link: string;
}
