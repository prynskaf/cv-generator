import { StyleSheet } from '@react-pdf/renderer'
import { colors } from '../shared/styles'

export const creativeStyles = StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  // Header with gradient background
  header: {
    backgroundColor: '#6366f1', // Indigo-500
    padding: 35,
    color: '#ffffff',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 25,
    marginBottom: 0,
  },
  profilePictureContainer: {
    marginBottom: 0,
    flexShrink: 0,
  },
  profilePictureFrame: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#ffffff',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    flexShrink: 0,
  },
  profilePicture: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  headerContent: {
    flex: 1,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    fontSize: 10,
    color: '#e0e7ff',
    marginBottom: 6,
  },
  contactItem: {
    color: '#e0e7ff',
  },
  linksRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  link: {
    fontSize: 9,
    color: '#e0e7ff',
    textDecoration: 'underline',
  },
  // About section with colored bar
  aboutSection: {
    backgroundColor: '#f3f4f6',
    padding: 25,
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
    borderBottomWidth: 3,
    borderBottomColor: '#6366f1',
    paddingBottom: 6,
  },
  summary: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 1.7,
    marginTop: 8,
  },
  // Main content - two column
  mainContent: {
    flexDirection: 'row',
    padding: 30,
  },
  leftColumn: {
    width: '60%',
    paddingRight: 25,
  },
  rightColumn: {
    width: '40%',
    paddingLeft: 25,
    borderLeftWidth: 3,
    borderLeftColor: '#e0e7ff',
  },
  section: {
    marginBottom: 22,
  },
  // Experience with timeline
  experienceItem: {
    marginBottom: 20,
    position: 'relative',
    paddingLeft: 20,
  },
  timelineDot: {
    position: 'absolute',
    left: 0,
    top: 4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6366f1',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  timelineLine: {
    position: 'absolute',
    left: 5,
    top: 16,
    width: 2,
    height: '100%',
    backgroundColor: '#e0e7ff',
  },
  jobTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  company: {
    fontSize: 11,
    color: '#6366f1',
    fontWeight: 'bold',
    marginBottom: 3,
  },
  date: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  bullets: {
    marginTop: 6,
  },
  bullet: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 1.6,
    marginBottom: 4,
    marginLeft: 8,
  },
  // Education
  educationItem: {
    marginBottom: 16,
    paddingLeft: 20,
    position: 'relative',
  },
  degree: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  institution: {
    fontSize: 10,
    color: '#6366f1',
    fontWeight: 'bold',
    marginBottom: 3,
  },
  // Skills - Colorful badges
  skillGroup: {
    marginBottom: 14,
  },
  skillCategory: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skill: {
    fontSize: 9,
    backgroundColor: '#6366f1',
    color: '#ffffff',
    padding: '5 10',
    borderRadius: 15,
    fontWeight: 'bold',
  },
  // Projects - Cards with colored backgrounds
  projectItem: {
    marginBottom: 14,
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  projectName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  projectDesc: {
    fontSize: 9,
    color: '#475569',
    lineHeight: 1.5,
    marginBottom: 6,
  },
  technologies: {
    fontSize: 8,
    color: '#6366f1',
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  // Languages
  languageItem: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e7ff',
  },
  languageName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  proficiency: {
    fontSize: 9,
    color: '#6366f1',
    fontWeight: 'bold',
  },
  // Certifications
  certificationItem: {
    marginBottom: 14,
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  certificationName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  certificationOrg: {
    fontSize: 10,
    color: '#6366f1',
    fontWeight: 'bold',
    marginBottom: 3,
  },
})
