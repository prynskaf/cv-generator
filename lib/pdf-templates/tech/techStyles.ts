import { StyleSheet } from '@react-pdf/renderer'
import { colors } from '../shared/styles'

export const techStyles = StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: '#ffffff', // White background
    fontFamily: 'Helvetica',
  },
  // Header - Terminal-inspired with rounded profile
  header: {
    backgroundColor: '#6b7280', // Gray background
    color: '#ffffff', // White text on gray
    padding: 30,
    paddingBottom: 20,
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#00d9ff', // Cyan accent
  },
  profilePictureContainer: {
    marginBottom: 0,
    flexShrink: 0,
  },
  profilePicture: {
    width: 90,
    height: 90,
    borderRadius: 45, // Fully rounded
    borderWidth: 3,
    borderColor: '#00d9ff', // Cyan border
    objectFit: 'cover',
  },
  headerContent: {
    flex: 1,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#ffffff', // White text on gray header
    fontFamily: 'Helvetica-Bold',
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    fontSize: 9,
    color: '#f3f4f6', // Light gray text on gray header
    marginTop: 4,
  },
  linksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 6,
    fontSize: 8,
    color: '#f3f4f6',
  },
  link: {
    color: '#00d9ff', // Cyan for links
    textDecoration: 'none',
  },
  // Summary section - Terminal window style
  summarySection: {
    padding: 25,
    paddingBottom: 20,
    backgroundColor: '#f8fafc', // Light gray background
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#00d9ff', // Cyan
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontFamily: 'Helvetica-Bold',
  },
  sectionTitleWithLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#30363d',
    paddingBottom: 5,
  },
  summary: {
    fontSize: 10,
    color: '#000000', // Black text
    lineHeight: 1.6,
    marginTop: 6,
  },
  // Main Content - Single column for tech-friendly layout
  mainContent: {
    padding: 30,
  },
  // Experience - Terminal command style
  experienceItem: {
    marginBottom: 18,
    padding: 12,
    backgroundColor: '#f8fafc', // Light gray background
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#00d9ff', // Cyan accent
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  jobHeader: {
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  jobHeaderLeft: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000', // Black text
    marginBottom: 3,
    fontFamily: 'Helvetica-Bold',
  },
  company: {
    fontSize: 10,
    color: '#000000', // Black text
    marginBottom: 3,
  },
  date: {
    fontSize: 9,
    color: '#000000', // Black text
    fontStyle: 'italic',
    textAlign: 'right',
    minWidth: 100,
  },
  bullet: {
    fontSize: 9,
    color: '#000000', // Black text
    lineHeight: 1.5,
    marginBottom: 3,
    marginLeft: 8,
  },
  // Education
  educationItem: {
    marginBottom: 14,
    padding: 12,
    backgroundColor: '#f8fafc', // Light gray background
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#58a6ff', // Blue accent
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  degree: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000', // Black text
    marginBottom: 3,
    fontFamily: 'Helvetica-Bold',
  },
  institution: {
    fontSize: 10,
    color: '#000000', // Black text
    marginBottom: 3,
  },
  // Skills - Terminal tags
  skillGroup: {
    marginBottom: 12,
  },
  skillCategory: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#000000', // Black text
    marginBottom: 6,
    fontFamily: 'Helvetica-Bold',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skill: {
    fontSize: 8,
    backgroundColor: '#ecfeff', // Light cyan background
    color: '#00d9ff',
    padding: '3 8',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#00d9ff',
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    marginBottom: 4,
    marginRight: 4,
  },
  // Projects - Code block style
  projectItem: {
    marginBottom: 14,
    padding: 12,
    backgroundColor: '#f8fafc', // Light gray background
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  projectName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000', // Black text
    marginBottom: 4,
    fontFamily: 'Helvetica-Bold',
  },
  projectDesc: {
    fontSize: 9,
    color: '#000000', // Black text
    lineHeight: 1.5,
    marginBottom: 4,
  },
  technologies: {
    fontSize: 8,
    color: '#000000', // Black text
    fontStyle: 'italic',
    marginTop: 4,
  },
  // Languages
  languageItem: {
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  languageName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000', // Black text
    fontFamily: 'Helvetica-Bold',
  },
  proficiency: {
    fontSize: 9,
    color: '#000000', // Black text
    fontStyle: 'italic',
  },
  // Certifications
  certificationItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f8fafc', // Light gray background
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  certificationName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000', // Black text
    marginBottom: 3,
    fontFamily: 'Helvetica-Bold',
  },
  certificationOrg: {
    fontSize: 10,
    color: '#000000', // Black text
    marginBottom: 3,
  },
})
