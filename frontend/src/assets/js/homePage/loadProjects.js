export async function fetchProjects(lang = 'es') {
  const url = `/api/projects?lang=${encodeURIComponent(lang)}&homepage=true`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Error al cargar los proyectos')
  return await res.json()
}
