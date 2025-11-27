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
    paddingTop: 35,
    paddingBottom: 25,
    paddingHorizontal: 45,
    borderTopWidth: 4,
    borderTopColor: '#1a202c', // Gray-800 - thick top border
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  headerLeft: {
    flex: 1,
    paddingRight: 20,
  },
  profilePictureContainer: {
    marginLeft: 20,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40, // Circle
    borderWidth: 2,
    borderColor: '#1a202c',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    fontSize: 10,
    color: colors.professional.light,
    marginTop: 8,
  },
  linksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
    fontSize: 9,
    color: colors.professional.primary,
  },
  linkItem: {
    color: colors.professional.primary,
  },
  // Main Content - Sidebar Layout (65/35)
  mainContent: {
    flexDirection: 'row',
    paddingHorizontal: 45,
  },
  // Main Content Area (left, 65%)
  content: {
    width: '65%',
    paddingRight: 30,
  },
  // Right Sidebar (35%)
  sidebar: {
    width: '35%',
    paddingLeft: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#1a202c',
  },
  // Section Titles - Uppercase, professional, thick underline to match header
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a202c',
    marginTop: 20,
    marginBottom: 12,
    paddingBottom: 5,
    borderBottomWidth: 4,
    borderBottomColor: '#1a202c',
    textTransform: 'uppercase',
    letterSpacing: 2.5,
  },
  sectionTitleFirst: {
    marginTop: 0,
  },
  summary: {
    fontSize: 11,
    color: colors.professional.text,
    lineHeight: 1.8,
    textAlign: 'justify',
    marginBottom: 0,
    fontStyle: 'italic',
  },
  jobHeader: {
    marginBottom: 10,
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
    color: colors.professional.secondary,
    marginBottom: 4,
  },
  company: {
    fontSize: 10,
    color: colors.professional.text,
    marginTop: 2,
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
    fontSize: 10,
    color: colors.professional.text,
    lineHeight: 1.8,
    marginLeft: 18,
    marginBottom: 6,
  },
  description: {
    fontSize: 10,
    color: colors.professional.text,
    lineHeight: 1.8,
    marginTop: 6,
    marginBottom: 12,
  },
  // Skills - Bullet points in two columns
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  skillColumn: {
    width: '48%',
    paddingRight: 10,
  },
  skill: {
    fontSize: 10,
    color: colors.professional.text,
    lineHeight: 1.6,
    marginLeft: 0,
    marginBottom: 4,
  },
  categoryTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.professional.secondary,
    marginTop: 14,
    marginBottom: 8,
  },
  // Languages
  languagesContainer: {
    flexDirection: 'column',
    gap: 10,
    marginTop: 10,
  },
  languageItem: {
    fontSize: 10,
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
    marginBottom: 10,
    textDecoration: 'none',
  },
  linkLabel: {
    fontWeight: 'bold',
  },
  // Education
  educationItem: {
    marginBottom: 16,
  },
  // Projects
  projectItem: {
    marginBottom: 14,
  },
  // Certifications
  certificationItem: {
    marginBottom: 14,
  },
})
