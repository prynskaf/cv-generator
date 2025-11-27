import { StyleSheet } from '@react-pdf/renderer'
import { colors } from '../shared/styles'

export const executiveStyles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: colors.executive.background,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 25,
    paddingBottom: 20,
    borderBottomWidth: 3,
    borderBottomColor: colors.executive.primary,
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
    width: 70,
    height: 70,
    borderRadius: 35, // Small circle, grayscale optional
    borderWidth: 2,
    borderColor: colors.executive.primary,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.executive.primary,
    marginBottom: 8,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    fontSize: 9,
    color: colors.executive.text,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.executive.primary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.executive.accent,
    paddingBottom: 4,
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

