import { StyleSheet } from '@react-pdf/renderer'
import { colors } from '../shared/styles'

export const executiveStyles = StyleSheet.create({
  page: {
    padding: 50, // Premium spacing
    backgroundColor: colors.executive.background,
    fontFamily: 'Times-Roman', // Serif for sophistication
  },
  header: {
    backgroundColor: '#0f172a', // Dark slate-900
    color: '#ffffff',
    padding: 30,
    marginBottom: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerContent: {
    flex: 1,
  },
  profilePictureContainer: {
    marginLeft: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 4, // Square with subtle border
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff', // White on dark header
    marginBottom: 8,
    letterSpacing: 1,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    fontSize: 9,
    color: '#e2e8f0', // Light text on dark header
  },
  section: {
    marginBottom: 25, // Premium spacing
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155', // Slate-700
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderTopWidth: 2,
    borderTopColor: '#334155',
    paddingTop: 8,
    marginTop: 20,
  },
  summary: {
    fontSize: 10,
    color: colors.executive.text,
    lineHeight: 1.6,
    marginTop: 8,
  },
  experienceItem: {
    marginBottom: 16,
  },
  jobHeader: {
    marginBottom: 6,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.executive.secondary,
  },
  company: {
    fontSize: 10,
    color: colors.executive.text,
    marginTop: 2,
  },
  date: {
    fontSize: 9,
    color: colors.executive.light,
    marginTop: 2,
  },
  bullet: {
    fontSize: 10,
    color: colors.executive.text,
    lineHeight: 1.5,
    marginLeft: 12,
    marginBottom: 4,
  },
  educationItem: {
    marginBottom: 12,
  },
  degree: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.executive.secondary,
    marginBottom: 4,
  },
  institution: {
    fontSize: 10,
    color: colors.executive.text,
    marginBottom: 2,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skill: {
    fontSize: 9,
    color: colors.executive.text,
    padding: '4 8',
    borderWidth: 1,
    borderColor: colors.executive.accent,
  },
  projectItem: {
    marginBottom: 10,
  },
  projectName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.executive.secondary,
    marginBottom: 4,
  },
  projectDesc: {
    fontSize: 9,
    color: colors.executive.text,
    lineHeight: 1.4,
  },
  languageItem: {
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  languageName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.executive.secondary,
  },
  proficiency: {
    fontSize: 9,
    color: colors.executive.light,
  },
})

