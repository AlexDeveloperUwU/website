export async function fetchProjects(lang = 'es') {
  const url = `/api/projects`
  const res = await fetch(url)

  if (!res.ok) throw new Error('Error fetching projects')

  const json = await res.json()

  if (json.success && Array.isArray(json.data)) {
    return json.data.map((project) => ({
      ...project,
      description: lang === 'en' ? project.descriptionEn : project.descriptionEs,
    }))
  }

  return []
}
