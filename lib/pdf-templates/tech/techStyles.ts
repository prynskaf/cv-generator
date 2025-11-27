import { StyleSheet } from '@react-pdf/renderer'
import { colors } from '../shared/styles'

export const techStyles = StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: colors.tech.background,
    fontFamily: 'Courier',
  },
  header: {
    backgroundColor: colors.tech.primary,
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
    width: 80,
    height: 80,
    borderRadius: 40, // Small circle
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  headerContent: {
    flex: 1,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#ffffff',
    fontFamily: 'Courier',
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    fontSize: 9,
    color: '#d1fae5',
    fontFamily: 'Courier',
  },
  linksRow: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 8,
  },
  link: {
    fontSize: 8,
    color: '#d1fae5',
    textDecoration: 'underline',
    fontFamily: 'Courier',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.tech.primary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 2,
    borderBottomColor: colors.tech.primary,
    paddingBottom: 4,
    fontFamily: 'Courier',
  },
  summary: {
    fontSize: 10,
    color: colors.tech.text,
    lineHeight: 1.6,
    marginTop: 8,
    fontFamily: 'Courier',
  },
  mainContent: {
    flexDirection: 'row',
    padding: 30,
  },
  leftColumn: {
    width: '60%',
    paddingRight: 20,
  },
  rightColumn: {
    width: '40%',
    paddingLeft: 20,
    borderLeftWidth: 2,
    borderLeftColor: colors.tech.accent,
  },
  experienceItem: {
    marginBottom: 18,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.tech.secondary,
    marginBottom: 4,
    fontFamily: 'Courier',
  },
  company: {
    fontSize: 10,
    color: colors.tech.primary,
    marginBottom: 4,
    fontFamily: 'Courier',
  },
  date: {
    fontSize: 9,
    color: colors.tech.light,
    marginBottom: 6,
    fontFamily: 'Courier',
  },
  bullet: {
    fontSize: 9,
    color: colors.tech.text,
    lineHeight: 1.5,
    marginBottom: 4,
    marginLeft: 8,
    fontFamily: 'Courier',
  },
  educationItem: {
    marginBottom: 12,
  },
  degree: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.tech.secondary,
    marginBottom: 4,
    fontFamily: 'Courier',
  },
  institution: {
    fontSize: 10,
    color: colors.tech.primary,
    marginBottom: 4,
    fontFamily: 'Courier',
  },
  skillGroup: {
    marginBottom: 12,
  },
  skillCategory: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.tech.primary,
    marginBottom: 6,
    fontFamily: 'Courier',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skill: {
    fontSize: 8,
    backgroundColor: colors.tech.accent,
    color: colors.tech.primary,
    padding: '3 6',
    borderRadius: 8,
    fontFamily: 'Courier',
  },
  projectItem: {
    marginBottom: 12,
  },
  projectName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.tech.secondary,
    marginBottom: 4,
    fontFamily: 'Courier',
  },
  projectDesc: {
    fontSize: 8,
    color: colors.tech.text,
    lineHeight: 1.4,
    marginBottom: 4,
    fontFamily: 'Courier',
  },
  technologies: {
    fontSize: 7,
    color: colors.tech.primary,
    fontStyle: 'italic',
    fontFamily: 'Courier',
  },
  languageItem: {
    marginBottom: 8,
  },
  languageName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.tech.secondary,
    fontFamily: 'Courier',
  },
  proficiency: {
    fontSize: 8,
    color: colors.tech.light,
    fontFamily: 'Courier',
  },
})

