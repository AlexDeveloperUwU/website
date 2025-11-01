export async function fetchDiscordStatus() {
  try {
    const response = await fetch('https://api.lanyard.rest/v1/users/419176939497193472')
    const data = await response.json()
    if (data.success) {
      return data.data.discord_status
    } else {
      throw new Error('Failed to fetch Discord status')
    }
  } catch (error) {
    console.error('Error fetching Discord status:', error)
    throw error
  }
}

export function getBorderColor(status) {
  switch (status) {
    case 'online':
      return '#22c55e'
    case 'idle':
      return '#eab308'
    case 'dnd':
      return '#ef4444'
    case 'offline':
      return '#64748b'
    default:
      return '#2563eb'
  }
}

export function getStatus(status) {
  switch (status) {
    case 'online':
      return 'pages.common.discord.online'
    case 'idle':
      return 'pages.common.discord.idle'
    case 'dnd':
      return 'pages.common.discord.dnd'
    case 'offline':
      return 'pages.common.discord.offline'
    default:
      return 'pages.common.discord.unknown'
  }
}

export function updateDiscordUI(status, translate) {
  const borderColor = getBorderColor(status)
  const profileImage = document.getElementById('profileImage')
  if (profileImage) {
    profileImage.style.boxShadow = `0 0 0 4px ${borderColor}80`
    profileImage.style.borderColor = borderColor
    profileImage.style.outline = `2px solid ${borderColor}`
  }
  const statusElement = document.getElementById('myDiscordStatus')
  if (statusElement) {
    const key = getStatus(status)
    statusElement.textContent = translate ? translate(key) : key
    statusElement.className =
      'font-medium ' +
      (status === 'online'
        ? 'text-green-400'
        : status === 'idle'
          ? 'text-yellow-400'
          : status === 'dnd'
            ? 'text-red-400'
            : status === 'offline'
              ? 'text-slate-400'
              : 'text-blue-400')
  }
}

export function updateDiscordStatus(translate) {
  fetchDiscordStatus()
    .then((status) => updateDiscordUI(status, translate))
    .catch((error) => console.error('Error updating Discord status:', error))
}
