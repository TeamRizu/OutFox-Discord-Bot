exports.main = (section = ['FALLBACK_SECTION']) => {
  let sectionMembers = ''

  for (let i = 0; i < section.members.length; i++) {
    let currentMember = section.members[i]

    if (currentMember.includes('strong>')) {
      currentMember = currentMember.replace('<strong>', '**')
      currentMember = currentMember.replace('</strong>', '**')
    }

    if (currentMember.includes('i>')) {
      currentMember = currentMember.replace('<i>', '_')
      currentMember = currentMember.replace('</i>', '_')
    }

    if (currentMember.includes('small>')) {
      currentMember = currentMember.replace('<small>', '')
      currentMember = currentMember.replace('</small>', '')
    }

    sectionMembers = sectionMembers + currentMember + '\n'
  }

  return sectionMembers
}
