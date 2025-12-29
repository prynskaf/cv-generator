import { StyleSheet } from '@react-pdf/renderer'

export const colors = {
  modern: {
    primary: '#2563eb',
    secondary: '#1e293b',
    accent: '#dbeafe',
    text: '#475569',
    light: '#64748b',
    background: '#ffffff',
  },
  professional: {
    primary: '#0f172a',
    secondary: '#1e293b',
    accent: '#cbd5e1',
    text: '#334155',
    light: '#64748b',
    background: '#ffffff',
  },
  minimalist: {
    primary: '#000000',
    secondary: '#171717',
    accent: '#f5f5f5',
    text: '#404040',
    light: '#737373',
    background: '#ffffff',
  },
  creative: {
    primary: '#6366f1',
    secondary: '#4f46e5',
    accent: '#e0e7ff',
    text: '#475569',
    light: '#64748b',
    background: '#ffffff',
  },
  executive: {
    primary: '#1e293b',
    secondary: '#0f172a',
    accent: '#cbd5e1',
    text: '#334155',
    light: '#64748b',
    background: '#ffffff',
  },
  tech: {
    primary: '#10b981',
    secondary: '#059669',
    accent: '#d1fae5',
    text: '#374151',
    light: '#6b7280',
    background: '#ffffff',
  },
  designer: {
    primary: '#ec4899',
    secondary: '#db2777',
    accent: '#fce7f3',
    text: '#4b5563',
    light: '#9ca3af',
    background: '#ffffff',
  },
}

export const baseStyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
})
