import { StyleSheet } from '@react-pdf/renderer'
import { colors } from '../shared/styles'

export const creativeStyles = StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    backgroundColor: '#6366f1',
    padding: 30,
    color: '#ffffff',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 20,
  },
  profilePictureContainer: {
    marginBottom: 10,
  },
  profilePictureFrame: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#ffffff',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  profilePicture: {
    width: '100%',
    height: '100%',
  },
  headerContent: {
    flex: 1,
  },
  name: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#ffffff',
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    fontSize: 10,
    color: '#e0e7ff',
    marginBottom: 8,
  },
  contactItem: {
    color: '#e0e7ff',
  },
  linksRow: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 8,
  },
  link: {
    fontSize: 9,
    color: '#e0e7ff',
    textDecoration: 'underline',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 2,
    borderBottomColor: '#6366f1',
    paddingBottom: 4,
  },
  summary: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 1.6,
    marginTop: 8,
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
    borderLeftColor: '#e0e7ff',
  },
  experienceItem: {
    marginBottom: 18,
  },
  jobTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  company: {
    fontSize: 11,
    color: '#6366f1',
    marginBottom: 4,
  },
  date: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 6,
  },
  bullets: {
    marginTop: 6,
  },
  bullet: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 1.5,
    marginBottom: 4,
    marginLeft: 8,
  },
  educationItem: {
    marginBottom: 12,
  },
  degree: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  institution: {
    fontSize: 10,
    color: '#6366f1',
    marginBottom: 4,
  },
  skillGroup: {
    marginBottom: 12,
  },
  skillCategory: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 6,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skill: {
    fontSize: 9,
    backgroundColor: '#e0e7ff',
    color: '#6366f1',
    padding: '4 8',
    borderRadius: 12,
  },
  projectItem: {
    marginBottom: 12,
  },
  projectName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  projectDesc: {
    fontSize: 9,
    color: '#475569',
    lineHeight: 1.4,
    marginBottom: 4,
  },
  technologies: {
    fontSize: 8,
    color: '#6366f1',
    fontStyle: 'italic',
  },
  languageItem: {
    marginBottom: 8,
  },
  languageName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  proficiency: {
    fontSize: 9,
    color: '#64748b',
  },
})

