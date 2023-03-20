/* eslint indent: ["error", 2, { "SwitchCase": 1 }] */
exports.main = (engine, name) => {
  switch (engine) {
    case 'DDRPC':
    case 'SM095':
    case 'SM164':
    case 'NOTITG':
    case 'OUTFOX':
    case 'ITGM':
      return engine
    case 'SM30': {
      const unique = [
        'PLUGIN - EZ2 Support',
        'PLUGIN - Para Support',
        'PLUGIN - Pump Support'
      ]

      if (unique.includes(name)) return 'SM5'

      return engine
    }
    case 'SM39': {
      const unique = [
        'Mungyodance',
        'Mungyodance 2',
        'Mungyodance 3',
        'StepMania AMX - Beta 2.9',
        'StepMania AMX - Beta 5.9.2',
        'CMSMA R001 (cesarmades\' StepMania AMX)',
        'Beware\'s DDR Extreme R2',
        'Beware\'s DDR Extreme R3',
        'Beat Up Mania',
        'NeonFM: Dance Radio'
      ]

      if (!unique.includes(name)) return engine

      if (name.includes('AMX')) return 'SMAMX'

      if (name.includes('DDR')) return 'DDRE'

      if (name.includes('Mungyodance')) {
        return name === 'Mungyodance' ? 'MUN1' : 'MUN3'
      }

      return name === 'Beat Up Mania' ? 'BEATUP' : 'NEONFM'
    }
    case 'SM395': {
      const unique = [
        'StepMania 3.95 CVS',
        'BBOY\'s 3.95 Mod',
        'Xsoft ITG2 ver1.01',
        'Xsoft ITG2 ver1.27',
        'In The Groove 2 R3',
        'In The Groove 2 R9',
        'StepMania 3.95 [Staiain\'s]'
      ]

      if (unique.includes(name)) return engine

      return 'OITG'
    }
    case 'OITG': {
      const unique = [
        'NotITG Version 1',
        'NotITG Version 2',
        'do not',
        'NotITG Version 3',
        'NotITG Version 3.1',
        'NotITG Version 4',
        'NotITG Version 4.0.1',
        'NotITG Version 4.2.0',
        'NotITG Version 4/1 (April Fools Day)',
        'SplatMania 0.3.3.0'
      ]

      if (!unique.includes(name)) return engine

      if (name.includes('NotITG')) {
        const majorVersion = Math.floor(Number(name.split(' ')[2]))

        if (majorVersion <= 2) return 'NITG'

        if (isNaN(majorVersion)) return 'NITG4OR1'

        return majorVersion === 3 ? 'NITG3' : 'NITG4'
      }

      return name === 'do not' ? 'DNOT' : 'SPLAT'
    }
    case 'SM4': {
      return name === 'StepMania 4.0 Beta 10' ? 'SM4B10' : engine
    }
    case 'SMSSC': {
      return name.includes('StepMania 5') ? 'SM5' : engine
    }
    case 'SMSSCCUSTOM': {
      // I'm not doing a switch case inside switch case.

      if (name.includes('Tournament')) return 'SM5TE'

      if (name.includes('PARASTAR')) return 'PARASTAR'

      if (name.includes('Keys')) return 'KEY6IX'

      if (name.includes('Pulsen')) return 'PULSEN'

      if (name.includes('Zettmania')) return 'ZETMANIA'

      if (name.includes('Sushi')) return 'SUSHI'

      if (name.includes('StepF2')) return 'STEPF2'

      return engine
    }
    case 'SM5': {
      const unique = [
        'StepMania 5.1.-3',
        'StepMania 5.1 Beta 1',
        'StepMania 5.1 Beta 2'
      ]

      if (unique.includes(name)) return 'SM5NEW'

      return engine
    }
    case 'ETT': {
      const unique = [
        'Xwidget_0.00000001',
        'Xwidget_0.00000002',
        'Xwidget_0.00000003',
        'Etterna 0.5',
        'Etterna 0.51',
        'Etterna 0.52',
        'Etterna 0.53',
        'Etterna 0.53 (Hotfix)',
        'Etterna 0.54',
        'Etterna 0.54 (Hotfix)',
        'Etterna 0.54r (Release)',
        'Etterna 0.54.1'
      ]

      if (unique.includes(name)) return 'SM5'

      return engine
    }
    default:
      return 'SM5'
  }
}
