export const processFiles = async (files) => {
  try {
    const followersData = await readFile(files.followers)
    const followingData = await readFile(files.following)

    const followers = extractUsernames(followersData)
    const following = extractUsernames(followingData)

    return following.filter(user => !followers.includes(user))
  } catch (error) {
    console.error('Errore durante l\'elaborazione dei file:', error)
    throw error
  }
}

const readFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = (e) => reject(e)
    reader.readAsText(file)
  })
}

const extractUsernames = (html) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  
  // Cerca tutti i link che contengono username di Instagram
  const usernameElements = Array.from(doc.querySelectorAll('a[href*="instagram.com/"]'))
  
  // Estrai gli username dai link
  return usernameElements
    .map(element => {
      const href = element.href
      // Rimuovi parametri URL e altri caratteri non necessari
      const cleanHref = href.split('?')[0].split('#')[0].replace(/\/$/, '')
      const match = cleanHref.match(/instagram\.com\/([^\/]+)/)
      return match ? match[1] : null
    })
    .filter(username => {
      // Filtra username non validi o speciali
      return username && 
             username !== 'instagram' && 
             username !== 'explore' && 
             username !== 'p' &&
             !username.includes('.')
    })
    // Rimuovi duplicati
    .filter((username, index, self) => self.indexOf(username) === index)
}
