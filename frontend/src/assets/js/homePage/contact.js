export function addCopyListeners() {
  const emailBtn = document.getElementById('copyEmail')
  if (emailBtn) {
    emailBtn.addEventListener('click', async () => {
      const email = 'alex@alexdevuwu.com'
      try {
        await navigator.clipboard.writeText(email)
        alert('¡Email copiado al portapapeles!')
      } catch (err) {
        console.error('Error copying email:', err)
        alert('Error al copiar el email')
      }
    })
  }

  const discordBtn = document.getElementById('copyDiscord')
  if (discordBtn) {
    discordBtn.addEventListener('click', async () => {
      const discord = 'alexdevuwu'
      try {
        await navigator.clipboard.writeText(discord)
        alert('¡Usuario de Discord copiado!')
      } catch (err) {
        console.error('Error copying Discord:', err)
        alert('Error al copiar el usuario')
      }
    })
  }
}

export function addContactFormListener() {
  const form = document.getElementById('contactForm')
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      const formData = new FormData(e.target)
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
      }
      console.log('Form data:', data)
      alert('¡Mensaje enviado correctamente!')
      e.target.reset()
    })
  }
}
