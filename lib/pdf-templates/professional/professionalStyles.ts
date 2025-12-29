import { StyleSheet } from '@react-pdf/renderer'
import { colors } from '../shared/styles'

export const professionalStyles = StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: colors.professional.background,
    fontFamily: 'Helvetica', // Professional sans-serif
  },
  // Header with thick top border - Classic resume style
  header: {
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 40,
    borderTopWidth: 4,
    borderTopColor: '#1a202c', // Gray-800 - thick top border
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  headerLeft: {
    flex: 1,
    paddingRight: 20,
  },
  profilePictureContainer: {
    marginLeft: 20,
    flexShrink: 0,
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30, // Circle
    borderWidth: 2,
    borderColor: '#1a202c',
    objectFit: 'cover',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 6,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    fontSize: 9,
    color: colors.professional.light,
    marginTop: 4,
  },
  linksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
    fontSize: 9,
    color: colors.professional.primary,
  },
  linkItem: {
    color: colors.professional.primary,
  },
  // Main Content - Sidebar Layout (65/35)
  mainContent: {
    flexDirection: 'row',
    paddingHorizontal: 40,
  },
  // Main Content Area (left, 65%)
  content: {
    width: '65%',
    paddingRight: 20,
  },
  // Right Sidebar (35%)
  sidebar: {
    width: '35%',
    paddingLeft: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#1a202c',
  },
  // Section Titles - Uppercase, professional, thick underline to match header
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a202c',
    marginTop: 12,
    marginBottom: 8,
    paddingBottom: 3,
    borderBottomWidth: 3,
    borderBottomColor: '#1a202c',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  sectionTitleFirst: {
    marginTop: 0,
  },
  summary: {
    fontSize: 10,
    color: colors.professional.text,
    lineHeight: 1.5,
    textAlign: 'justify',
    marginBottom: 0,
    fontStyle: 'italic',
  },
  jobHeader: {
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  jobHeaderLeft: {
    flex: 1,
    paddingRight: 12,
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.professional.secondary,
    marginBottom: 2,
  },
  company: {
    fontSize: 9,
    color: colors.professional.text,
    marginTop: 1,
  },
  date: {
    fontSize: 9,
    color: colors.professional.light,
    fontStyle: 'italic',
    textAlign: 'right',
    minWidth: 110,
    marginTop: 0,
  },
  bullet: {
    fontSize: 9,
    color: colors.professional.text,
    lineHeight: 1.4,
    marginLeft: 15,
    marginBottom: 3,
  },
  description: {
    fontSize: 9,
    color: colors.professional.text,
    lineHeight: 1.4,
    marginTop: 4,
    marginBottom: 8,
  },
  // Skills - Bullet points in two columns
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  skillColumn: {
    width: '48%',
    paddingRight: 8,
  },
  skill: {
    fontSize: 9,
    color: colors.professional.text,
    lineHeight: 1.4,
    marginLeft: 0,
    marginBottom: 2,
  },
  categoryTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.professional.secondary,
    marginTop: 8,
    marginBottom: 4,
  },
  // Languages
  languagesContainer: {
    flexDirection: 'column',
    gap: 6,
    marginTop: 6,
  },
  languageItem: {
    fontSize: 9,
    color: colors.professional.text,
  },
  languageName: {
    fontWeight: 'bold',
    color: colors.professional.secondary,
  },
  // Links
  link: {
    fontSize: 9,
    color: colors.professional.primary,
    marginBottom: 6,
    textDecoration: 'none',
  },
  linkLabel: {
    fontWeight: 'bold',
  },
  // Education
  educationItem: {
    marginBottom: 10,
  },
  // Projects
  projectItem: {
    marginBottom: 10,
  },
  // Certifications
  certificationItem: {
    marginBottom: 10,
  },
})
