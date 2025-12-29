import { StyleSheet } from '@react-pdf/renderer'
import { colors } from '../shared/styles'

export const designerStyles = StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  // Header - Asymmetric with large profile picture
  header: {
    backgroundColor: '#ffffff',
    padding: 35,
    paddingBottom: 25,
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 30,
    borderBottomWidth: 4,
    borderBottomColor: '#ec4899', // Pink accent
  },
  profilePictureContainer: {
    marginBottom: 0,
    flexShrink: 0,
  },
  profilePictureFrame: {
    width: 120,
    height: 120,
    borderRadius: 60, // Large circle
    borderWidth: 4,
    borderColor: '#ec4899', // Pink border
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    flexShrink: 0,
  },
  profilePicture: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  headerContent: {
    flex: 1,
    paddingTop: 10,
  },
  name: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1f2937', // Dark gray
    fontFamily: 'Helvetica-Bold',
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    fontSize: 9,
    color: '#6b7280',
    marginTop: 4,
  },
  linksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 6,
    fontSize: 9,
  },
  link: {
    color: '#ec4899', // Pink for links
    textDecoration: 'none',
  },
  // Summary section - Colored background
  summarySection: {
    padding: 30,
    paddingBottom: 25,
    backgroundColor: '#fdf2f8', // Light pink background
    borderBottomWidth: 1,
    borderBottomColor: '#fce7f3',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ec4899', // Pink
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontFamily: 'Helvetica-Bold',
  },
  sectionTitleWithAccent: {
    borderLeftWidth: 5,
    borderLeftColor: '#ec4899',
    paddingLeft: 12,
  },
  summary: {
    fontSize: 11,
    color: '#1f2937',
    lineHeight: 1.7,
    marginTop: 8,
  },
  // Main Content - Asymmetric grid layout
  mainContent: {
    padding: 30,
    flexDirection: 'row',
  },
  // Left Column - Main content (70%)
  leftColumn: {
    width: '70%',
    paddingRight: 25,
  },
  // Right Column - Sidebar (30%)
  rightColumn: {
    width: '30%',
    paddingLeft: 25,
    borderLeftWidth: 2,
    borderLeftColor: '#fce7f3',
  },
  // Experience - Creative cards
  experienceItem: {
    marginBottom: 18,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fce7f3',
    borderLeftWidth: 5,
    borderLeftColor: '#ec4899',
  },
  jobHeader: {
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  jobHeaderLeft: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
    fontFamily: 'Helvetica-Bold',
  },
  company: {
    fontSize: 11,
    color: '#ec4899', // Pink
    marginBottom: 4,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 9,
    color: '#9ca3af',
    fontStyle: 'italic',
    textAlign: 'right',
    minWidth: 100,
  },
  bullet: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.6,
    marginBottom: 4,
    marginLeft: 8,
  },
  // Education
  educationItem: {
    marginBottom: 14,
    padding: 12,
    backgroundColor: '#fdf2f8',
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#f472b6',
  },
  degree: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
    fontFamily: 'Helvetica-Bold',
  },
  institution: {
    fontSize: 10,
    color: '#ec4899',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  // Skills - Creative badges
  skillGroup: {
    marginBottom: 12,
  },
  skillCategory: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ec4899',
    marginBottom: 6,
    fontFamily: 'Helvetica-Bold',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skill: {
    fontSize: 9,
    backgroundColor: '#fdf2f8',
    color: '#ec4899',
    padding: '5 12',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#fce7f3',
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    marginBottom: 4,
    marginRight: 4,
  },
  // Projects - Portfolio showcase
  projectItem: {
    marginBottom: 16,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fce7f3',
    borderTopWidth: 4,
    borderTopColor: '#ec4899',
  },
  projectName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 6,
    fontFamily: 'Helvetica-Bold',
  },
  projectDesc: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.6,
    marginBottom: 6,
  },
  technologies: {
    fontSize: 9,
    color: '#ec4899',
    fontStyle: 'italic',
    marginTop: 4,
  },
  // Languages
  languageItem: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#fce7f3',
  },
  languageName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1f2937',
    fontFamily: 'Helvetica-Bold',
  },
  proficiency: {
    fontSize: 9,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  // Certifications
  certificationItem: {
    marginBottom: 14,
    padding: 12,
    backgroundColor: '#fdf2f8',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f472b6',
  },
  certificationName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
    fontFamily: 'Helvetica-Bold',
  },
  certificationOrg: {
    fontSize: 10,
    color: '#ec4899',
    marginBottom: 4,
    fontWeight: 'bold',
  },
})
