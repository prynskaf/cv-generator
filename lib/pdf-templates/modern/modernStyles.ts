import { StyleSheet } from '@react-pdf/renderer'
import { colors } from '../shared/styles'

export const modernStyles = StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: colors.modern.background,
    fontFamily: 'Helvetica',
  },
  // Header - Clean, modern header
  header: {
    backgroundColor: '#2563eb', // Blue-600
    padding: 30,
    color: '#ffffff',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    position: 'relative',
  },
  headerContent: {
    flex: 1,
    paddingRight: 20,
  },
  profilePictureContainer: {
    position: 'absolute',
    right: 30,
    top: 30,
    flexShrink: 0,
  },
  profilePicture: {
    width: 90,
    height: 90,
    borderRadius: 45, // Circle
    borderWidth: 4,
    borderColor: '#ffffff',
    objectFit: 'cover',
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ffffff',
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    fontSize: 10,
    color: '#dbeafe',
    marginTop: 4,
  },
  // Main Content - Asymmetric Grid (30/70)
  mainContent: {
    flexDirection: 'row',
  },
  // Left Sidebar - 30% width, colored background
  sidebar: {
    width: '30%',
    backgroundColor: '#f1f5f9', // Slate-100
    padding: 25,
    borderRightWidth: 4,
    borderRightColor: colors.modern.primary,
  },
  // Right Content - 70% width
  content: {
    width: '70%',
    padding: 25,
  },
  // Section Titles - Modern, clean
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.modern.primary,
    marginBottom: 12,
    marginTop: 20,
    borderBottomWidth: 2,
    borderBottomColor: colors.modern.primary,
    paddingBottom: 4,
  },
  sectionTitleFirst: {
    marginTop: 0,
  },
  // Experience Items - Clean, no timeline
  experienceItem: {
    marginBottom: 20,
    paddingLeft: 0, // Aligned with Summary
  },
  jobHeader: {
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.modern.secondary,
    marginBottom: 4,
  },
  company: {
    fontSize: 10,
    color: colors.modern.primary,
    fontWeight: '600',
    marginBottom: 3,
  },
  date: {
    fontSize: 9,
    color: colors.modern.light,
    marginTop: 2,
    fontStyle: 'italic',
  },
  bullet: {
    fontSize: 10,
    color: colors.modern.text,
    lineHeight: 1.6,
    marginLeft: 0,
    marginBottom: 5,
    marginTop: 0,
    paddingLeft: 0,
  },
  description: {
    fontSize: 10,
    color: colors.modern.text,
    lineHeight: 1.7,
    marginTop: 4,
    marginBottom: 0,
  },
  // Skills - Vertical badges in sidebar
  skillCategory: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.modern.secondary,
    marginTop: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  skillsContainer: {
    flexDirection: 'column', // Vertical stack
    gap: 6,
    marginBottom: 12,
  },
  skill: {
    fontSize: 9,
    backgroundColor: colors.modern.primary,
    color: '#ffffff',
    padding: '6 12',
    borderRadius: 15,
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: '600',
  },
  // Languages
  languageItem: {
    fontSize: 10,
    color: colors.modern.text,
    marginBottom: 8,
    paddingLeft: 0,
  },
  languageName: {
    fontWeight: 'bold',
    color: colors.modern.secondary,
  },
  // Links
  link: {
    fontSize: 9,
    color: colors.modern.primary,
    marginBottom: 8,
    textDecoration: 'none',
  },
  linkLabel: {
    fontWeight: 'bold',
  },
  // Project Cards - 2-column grid
  projectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  projectCard: {
    width: '48%',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.modern.accent,
    marginBottom: 12,
  },
  projectName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.modern.secondary,
    marginBottom: 4,
  },
  projectDesc: {
    fontSize: 9,
    color: colors.modern.text,
    lineHeight: 1.4,
    marginBottom: 6,
  },
  projectTech: {
    fontSize: 8,
    color: colors.modern.primary,
    fontStyle: 'italic',
  },
  // Education
  educationItem: {
    marginBottom: 16,
  },
  // Certifications
  certificationItem: {
    marginBottom: 14,
  },
})
