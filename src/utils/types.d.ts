export type Mode = "dance" | "pump" | "be-mu" | "bongo" | "boxing" | "ds3ddx" | "ez2" | "gddm" | "gdgf" | "gh" | "karaoke" | "kb1" | "kb2" | "kb3" | "kb4" | "kb4" | "kb5" | "kb6" | "kb7" | "kb8" | "kb9" | "kb10" | "kb11" | "kb12" | "kb13" | "kb14" | "kb15" | "kb16" | "kb17" | "kb18" | "kb19" | "kickbox" | "para" | "po-mu" | "rockband" | "drums" | "smx" | "stepstage" | "taiko" | "techno" | "maniax";

export type DanceStyle = "single" | "solo" | "double" | "solodouble" | "threedouble" | "threepanel" | "routine" | "couple"
export type PumpStyle = "single" | "couple" | "double" | "halfdouble" | "routine"
export type BemuStyle = "single5" | "single6" |  "single7" | "double5" | "double6" | "double7"
export type BongoStyle = 'single'
export type BoxingStyle = 'single'
export type Ds3ddxStyle = "single" | "double" | "double5" | "routine5" | "single5"
export type Ez2Style = "single" | "real"
export type GddmStyle = "new" | "old" | "real"
export type GdgfStyle = "bass-five" | "bass-six" | "bass-three" | "five" | "six" | "three"
export type GhStyle = "bass" | "rhythm" | "solo"
export type KaraokeStyle = 'single'
export type KbxStyle = "single"
export type KickboxStyle = "arachnid" | "human" | "insect" | "quadarm"
export type ParaStyle = "single" | "eight" | "double"
export type PomuStyle = "five" | "four" | "nine" | "nine-double" | "seven" | "three"
export type RockbandStyle = "easy" | "normal" | "normal5" | "pro"
export type DrumsStyle = "normal" | "pro"
export type SmxStyle = "single" | "double6" | "double10"
export type StepstageStyle = "single" | "twin"
export type TaikoStyle = 'single'
export type TechnoStyle = "single4" | "single5" | "single8" | "single9" | "double4" | "double5" | "double8" | "double9"
export type ManiaxStyle = "single" | "double"

export type StylesMap = {
    'dance': DanceStyle,
    'pump': PumpStyle,
    'be-mu': BemuStyle,
    'bongo': BongoStyle,
    'ds3ddx': Ds3ddxStyle,
    'ez2': Ez2Style,
    'gddm': GddmStyle,
    'gdgf': GdgfStyle,
    'gh': GhStyle,
    'kb1': KbxStyle,
    'kb2': KbxStyle,
    'kb3': KbxStyle,
    'kb4': KbxStyle,
    'kb5': KbxStyle,
    'kb6': KbxStyle,
    'kb7': KbxStyle,
    'kb8': KbxStyle,
    'kb9': KbxStyle,
    'kb10': KbxStyle,
    'kb11': KbxStyle,
    'kb12': KbxStyle,
    'kb13': KbxStyle,
    'kb14': KbxStyle,
    'kb15': KbxStyle,
    'kb16': KbxStyle,
    'kb17': KbxStyle,
    'kb18': KbxStyle,
    'kb19': KbxStyle,
    'kickbox': KickboxStyle,
    'para': ParaStyle,
    'rockband': RockbandStyle,
    'drums': DrumsStyle,
    'smx': SmxStyle,
    'stepstage': StepstageStyle,
    'taiko': TaikoStyle,
    'techno': TechnoStyle,
    'boxing': BoxingStyle,
    'karaoke': KaraokeStyle,
    'po-mu': PomuStyle,
    'maniax': ManiaxStyle
}

export type ModeStyles<M extends Mode> = M extends keyof StylesMap ? StylesMap[M] : 'single' 

export type Difficulty = 'novice' | 'easy' | 'medium' | 'hard' | 'expert' | 'edit'

export type RadarValues = {
    jumps: number,
    rolls: number,
    lifts: number,
    fakes: number,
    mines: number,
    hands: number,
    holds: number
}

export interface AllScores_TapNoteData {
    TapNoteScore_Held: number;
    TapNoteScore_HitMine: number;
    TapNoteScore_Miss: number;
    TapNoteScore_MissedHold: number;
    TapNoteScore_W1: number;
    TapNoteScore_W2: number;
    TapNoteScore_W3: number;
}

export interface AllScores_Score {
    artist: string;
    date: string;
    dp_actual: number;
    dp_max: number;
    id: number;
    meter: number;
    modifiers: string;
    radar_values: RadarValues;
    rate: number;
    score: number;
    tapnote_data: AllScores_TapNoteData;
    title: string;
    username: string;
    credit: string | string[];
}

export type SongScores = {
    [M in Modes]?: {
        [S in StylesMap<M>]?: {
            [D in Difficulty]?: AllScores_Score[]
        }
    }
}