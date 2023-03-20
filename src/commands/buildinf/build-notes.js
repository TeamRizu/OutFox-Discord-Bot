exports.main = (build) => {
  const buildNoteDescription = {
    hotfix:
      'This is a hotfix build, meaning major features, that might or not be available on this version, came from a prior version.',
    hotfix_notice: 'This build has a hotfix version, it is recommended to use the hotfix version instead.',
    release_candidate:
      'This build is a release candidate, it has experimental features that might not yet have been finalized.'
  }
  let notes = ''

  for (let i = 0; i < build.notes.length; i++) {
    const currentNote = build.notes[i]

    if (currentNote.type === 'notice') {
      notes += '- ' + currentNote.description + '\n'
      continue
    }

    notes += '- ' + buildNoteDescription[currentNote.type] + '\n'
  }

  return notes || 'No notes for this build.'
}
