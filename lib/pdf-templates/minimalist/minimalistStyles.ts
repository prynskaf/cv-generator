import { StyleSheet } from '@react-pdf/renderer'
import { colors } from '../shared/styles'

export const minimalistStyles = StyleSheet.create({
  page: {
    padding: 50, // Maximum whitespace
    backgroundColor: colors.minimalist.background,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb', // Very light gray
    alignItems: 'center', // Centered
    textAlign: 'center',
  },
  profilePictureContainer: {
    marginTop: 5,
  },
  profilePicture: {
    width: 70,
    height: 70,
    borderRadius: 35, // Small circle
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignSelf: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'normal', // Light weight
    color: '#111827', // Gray-900
    marginBottom: 8,
    textAlign: 'center',
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
    fontSize: 9,
    color: '#6b7280', // Gray-500
    justifyContent: 'center',
  },
  separator: {
    color: colors.minimalist.light,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'normal', // Thin
    color: '#9ca3af', // Gray-400
    marginTop: 25,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 3,
    textAlign: 'center',
  },
  sectionTitleFirst: {
    marginTop: 0,
  },
  summary: {
    fontSize: 11,
    color: '#4b5563', // Gray-600
    lineHeight: 1.8,
    marginBottom: 5,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  jobHeader: {
    marginBottom: 6,
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.minimalist.secondary,
  },
  company: {
    fontSize: 9,
    color: colors.minimalist.text,
    marginTop: 2,
  },
  date: {
    fontSize: 8,
    color: colors.minimalist.light,
    marginTop: 2,
  },
  bullet: {
    fontSize: 9,
    color: colors.minimalist.text,
    lineHeight: 1.5,
    marginLeft: 10,
    marginBottom: 3,
  },
  description: {
    fontSize: 9,
    color: colors.minimalist.text,
    lineHeight: 1.5,
    marginTop: 5,
    marginBottom: 10,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 6,
  },
  skill: {
    fontSize: 8,
    color: colors.minimalist.secondary,
    padding: '4 0',
    marginRight: 8,
  },
  skillDot: {
    fontSize: 6,
    color: colors.minimalist.light,
  },
  languageItem: {
    fontSize: 9,
    color: colors.minimalist.text,
    marginBottom: 4,
  },
  languageName: {
    fontWeight: 'bold',
    color: colors.minimalist.secondary,
  },
  link: {
    fontSize: 8,
    color: colors.minimalist.text,
    marginBottom: 4,
  },
  categoryTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.minimalist.secondary,
    marginTop: 8,
    marginBottom: 4,
  },
})
