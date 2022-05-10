exports.ChartStepFile = class ChartStep {
  constructor() {
    this.notedata = ''
    this.chartName = ''
    this.stepsType = ''
    this.description = ''
    this.chartstyle = ''
    this.difficulty = ''
    this.radarValues = []
    this.credit = ''
    this.notes = []
    this.labels = []
    this.fakes = []
    this.credit = []
    this.combos = []
    this.meter = ''
    this.bpms = []
    this.stops = []
    this.delays = []
    this.warps = []
    this.tickcounts = []
    this.speeds = []
    this.scrolls = []
    this.offset = ''
    this.timesignatures = []
  }

  parse(chartString) {
    console.log(chartString)
    // todo: everything.
  }
}
