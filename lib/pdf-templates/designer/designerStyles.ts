import { StyleSheet } from '@react-pdf/renderer'
import { colors } from '../shared/styles'

export const designerStyles = StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: colors.designer.background,
    fontFamily: 'Helvetica',
  },
  header: {
    backgroundColor: colors.designer.primary,
    padding: 40,
    color: '#ffffff',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 25,
  },
  profilePictureContainer: {
    marginBottom: 10,
  },
  profilePictureFrame: {
    width: 140,
    height: 140,
    borderRadius: 70, // Large circle
    borderWidth: 5,
    borderColor: '#ffffff',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  profilePicture: {
    width: '100%',
    height: '100%',
  },
  headerContent: {
    flex: 1,
  },
  name: {
    fontSize: 38,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ffffff',
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    fontSize: 10,
    color: '#fce7f3',
    marginBottom: 8,
  },
  linksRow: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 8,
  },
  link: {
    fontSize: 9,
    color: '#fce7f3',
    textDecoration: 'underline',
  },
  section: {
    marginBottom: 25,
    padding: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.designer.primary,
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 2,
    borderBottomWidth: 3,
    borderBottomColor: colors.designer.primary,
    paddingBottom: 6,
  },
  summary: {
    fontSize: 11,
    color: colors.designer.text,
    lineHeight: 1.7,
    marginTop: 10,
  },
  mainContent: {
    padding: 30,
  },
  experienceItem: {
    marginBottom: 20,
  },
  jobHeader: {
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.designer.secondary,
    marginBottom: 4,
  },
  company: {
    fontSize: 11,
    color: colors.designer.primary,
    marginBottom: 4,
  },
  date: {
    fontSize: 9,
    color: colors.designer.light,
    marginBottom: 8,
  },
  bullet: {
    fontSize: 10,
    color: colors.designer.text,
    lineHeight: 1.6,
    marginBottom: 5,
    marginLeft: 10,
  },
  educationItem: {
    marginBottom: 15,
  },
  degree: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.designer.secondary,
    marginBottom: 4,
  },
  institution: {
    fontSize: 10,
    color: colors.designer.primary,
    marginBottom: 4,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skill: {
    fontSize: 9,
    backgroundColor: colors.designer.accent,
    color: colors.designer.primary,
    padding: '5 12',
    borderRadius: 15,
  },
  projectItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
  },
  projectName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.designer.secondary,
    marginBottom: 6,
  },
  projectDesc: {
    fontSize: 10,
    color: colors.designer.text,
    lineHeight: 1.5,
    marginBottom: 6,
  },
  technologies: {
    fontSize: 8,
    color: colors.designer.primary,
    fontStyle: 'italic',
  },
  languageItem: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  languageName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.designer.secondary,
  },
  proficiency: {
    fontSize: 9,
    color: colors.designer.light,
  },
})

