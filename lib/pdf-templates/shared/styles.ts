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
