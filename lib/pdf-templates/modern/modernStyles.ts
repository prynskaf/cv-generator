import { StyleSheet } from '@react-pdf/renderer'
import { colors } from '../shared/styles'

export const modernStyles = StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: colors.modern.background,
    fontFamily: 'Helvetica',
  },
  header: {
    backgroundColor: colors.modern.primary,
    padding: 30,
    color: '#ffffff',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 20,
  },
  profilePictureContainer: {
    marginBottom: 10,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50, // Circle
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#ffffff',
    flex: 1,
  },
  tagline: {
    fontSize: 14,
    marginBottom: 12,
    color: '#dbeafe',
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    fontSize: 10,
    color: '#dbeafe',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainContent: {
    flexDirection: 'row',
  },
  sidebar: {
    width: '35%',
    backgroundColor: '#f8fafc',
    padding: 25,
    borderRight: `3px solid ${colors.modern.primary}`,
  },
  content: {
    width: '65%',
    padding: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.modern.primary,
    marginBottom: 12,
    marginTop: 18,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionTitleFirst: {
    marginTop: 0,
  },
  jobHeader: {
    marginBottom: 6,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.modern.secondary,
  },
  company: {
    fontSize: 10,
    color: colors.modern.text,
    marginTop: 2,
  },
  date: {
    fontSize: 9,
    color: colors.modern.light,
    marginTop: 2,
  },
  bullet: {
    fontSize: 10,
    color: colors.modern.text,
    lineHeight: 1.5,
    marginLeft: 12,
    marginBottom: 4,
  },
  description: {
    fontSize: 10,
    color: colors.modern.text,
    lineHeight: 1.6,
    marginTop: 6,
    marginBottom: 12,
  },
  skillCategory: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.modern.secondary,
    marginTop: 10,
    marginBottom: 6,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  skill: {
    fontSize: 9,
    backgroundColor: colors.modern.accent,
    color: colors.modern.primary,
    padding: '5 10',
    borderRadius: 10,
  },
  languageItem: {
    fontSize: 10,
    color: colors.modern.text,
    marginBottom: 6,
  },
  languageName: {
    fontWeight: 'bold',
    color: colors.modern.secondary,
  },
  link: {
    fontSize: 9,
    color: colors.modern.primary,
    marginBottom: 6,
    textDecoration: 'none',
  },
  linkLabel: {
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: colors.modern.accent,
    marginVertical: 12,
  },
})
