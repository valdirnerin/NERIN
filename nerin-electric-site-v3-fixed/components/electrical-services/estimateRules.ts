export interface InstallationSelection {
  pointType: string
  quantity: number
  installationType: string
  distance: string
  propertyType: string
  urgency: string
}

const baseByPoint: Record<string, number> = {
  'toma común 10A': 38000,
  'toma 20A': 45000,
  'toma para aire acondicionado': 78000,
  'punto de iluminación': 52000,
  'llave de luz': 42000,
  'circuito dedicado': 95000,
  'tablero / protección': 110000,
}

export function requiresTechnicalVisit(selection: InstallationSelection) {
  return (
    selection.installationType.includes('embutida completa') ||
    selection.distance === 'más de 10 m' ||
    selection.propertyType === 'consorcio' ||
    selection.propertyType === 'country / barrio privado' ||
    selection.pointType === 'tablero / protección'
  )
}

export function estimateMaterials(selection: InstallationSelection) {
  const common = ['cable normalizado según sección', 'conectores', 'tornillería menor']
  if (selection.installationType.includes('exterior'))
    return [...common, 'caño o cablecanal', 'curvas y accesorios', 'cajas exteriores']
  if (selection.pointType.includes('toma'))
    return [...common, 'módulo toma', 'bastidor', 'tapa', 'caja si corresponde']
  if (selection.pointType.includes('tablero'))
    return [...common, 'protección compatible', 'riel DIN o accesorios', 'terminales']
  return [...common, 'módulo o portalámparas según alcance', 'caja o tapa si corresponde']
}

export function calculateServiceEstimate(selection: InstallationSelection) {
  const quantity = Math.max(1, Number(selection.quantity) || 1)
  const base = baseByPoint[selection.pointType] || 45000
  const installFactor = selection.installationType.includes('existente')
    ? 1
    : selection.installationType.includes('exterior')
      ? 1.45
      : selection.installationType.includes('embutida completa')
        ? 2.2
        : 1.25
  const distanceFactor =
    selection.distance === 'hasta 3 m'
      ? 1
      : selection.distance === '3 a 6 m'
        ? 1.18
        : selection.distance === '6 a 10 m'
          ? 1.35
          : 1.7
  const urgencyFactor =
    selection.urgency === 'normal' ? 1 : selection.urgency === 'prioritaria' ? 1.25 : 1.55
  const labor =
    Math.round((base * quantity * installFactor * distanceFactor * urgencyFactor) / 1000) * 1000
  return {
    labor,
    duration: `${Math.max(1, quantity)} a ${Math.max(2, quantity * 2)} horas estimadas`,
    requiresVisit: requiresTechnicalVisit(selection),
    photoRequired: true,
    materials: estimateMaterials(selection),
  }
}

export function calculateDiagnosticEstimate(selection: { advanced?: boolean }) {
  return {
    initialPrice: selection.advanced ? 85000 : 65000,
    includedMinutes: 90,
    status: 'pendiente de validación técnica',
  }
}

export function generateTechnicalSummary(selection: InstallationSelection) {
  const estimate = calculateServiceEstimate(selection)
  return {
    ...estimate,
    quantity: selection.quantity,
    workType: `${selection.pointType} · ${selection.installationType} · ${selection.distance}`,
    scopeNotes: [
      'Estimación preparada para alcances estándar.',
      'Sujeto a aprobación por zona, agenda, fotos, acceso y estado real de la instalación.',
      'No incluye materiales salvo pacto expreso.',
    ],
    status: 'pendiente de validación técnica',
  }
}
