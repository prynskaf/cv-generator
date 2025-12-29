import { StyleSheet } from '@react-pdf/renderer'
import { colors } from '../shared/styles'

export const executiveStyles = StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: colors.executive.background,
    fontFamily: 'Helvetica', // Clean, professional sans-serif
  },
  // Header - Elegant navy with subtle accent
  header: {
    backgroundColor: '#1e3a8a', // Elegant navy blue
    color: '#ffffff',
    padding: 35,
    paddingBottom: 25,
    marginBottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6', // Subtle blue accent
  },
  headerContent: {
    flex: 1,
    paddingRight: 25,
  },
  profilePictureContainer: {
    marginLeft: 20,
    flexShrink: 0,
  },
  profilePicture: {
    width: 85,
    height: 85,
    borderRadius: 42.5, // Elegant circle
    borderWidth: 3,
    borderColor: '#ffffff',
    objectFit: 'cover',
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    fontSize: 10,
    color: '#e0e7ff', // Light blue tint
    marginTop: 5,
  },
  linksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 6,
    fontSize: 9,
    color: '#e0e7ff',
  },
  link: {
    color: '#e0e7ff',
    textDecoration: 'none',
  },
  // Main Content - Two Column Layout
  mainContent: {
    flexDirection: 'row',
    padding: 35,
  },
  // Left Column - Main content (65%)
  leftColumn: {
    width: '65%',
    paddingRight: 25,
  },
  // Right Column - Sidebar (35%)
  rightColumn: {
    width: '35%',
    paddingLeft: 25,
    borderLeftWidth: 1,
    borderLeftColor: '#e2e8f0',
  },
  section: {
    marginBottom: 24,
  },
  // Section Titles - Elegant and refined
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e3a8a', // Navy blue
    marginBottom: 14,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6', // Subtle blue accent
    paddingBottom: 6,
    marginTop: 20,
  },
  sectionTitleFirst: {
    marginTop: 0,
  },
  summary: {
    fontSize: 11,
    color: colors.executive.text,
    lineHeight: 1.7,
    marginTop: 8,
    textAlign: 'justify',
  },
  // Experience
  experienceItem: {
    marginBottom: 18,
  },
  jobHeader: {
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  jobHeaderLeft: {
    flex: 1,
    paddingRight: 15,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  company: {
    fontSize: 10,
    color: '#1e3a8a', // Navy blue
    marginTop: 2,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 0,
    fontStyle: 'italic',
    textAlign: 'right',
    minWidth: 110,
  },
  bullet: {
    fontSize: 10,
    color: colors.executive.text,
    lineHeight: 1.6,
    marginLeft: 15,
    marginBottom: 4,
  },
  // Education
  educationItem: {
    marginBottom: 14,
  },
  degree: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  institution: {
    fontSize: 10,
    color: '#1e3a8a', // Navy blue
    marginTop: 2,
    fontWeight: 'bold',
  },
  // Skills - Elegant tags
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  skill: {
    fontSize: 9,
    color: '#1e3a8a',
    padding: '4 10',
    borderWidth: 1,
    borderColor: '#3b82f6', // Blue border
    borderRadius: 4,
    backgroundColor: '#eff6ff', // Light blue background
  },
  skillCategory: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginTop: 10,
    marginBottom: 6,
  },
  // Projects
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
    fontSize: 10,
    color: colors.executive.text,
    lineHeight: 1.5,
    marginTop: 4,
  },
  // Languages
  languageItem: {
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  languageName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  proficiency: {
    fontSize: 9,
    color: '#64748b',
    fontStyle: 'italic',
  },
  // Certifications
  certificationItem: {
    marginBottom: 12,
  },
  certificationName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 3,
  },
  certificationOrg: {
    fontSize: 10,
    color: '#1e3a8a',
    marginTop: 2,
    fontWeight: 'bold',
  },
  // Links
  linkItem: {
    fontSize: 9,
    color: '#475569',
    marginBottom: 5,
  },
  linkLabel: {
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
})
