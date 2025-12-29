import { StyleSheet } from '@react-pdf/renderer'
import { colors } from '../shared/styles'

export const minimalistStyles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: colors.minimalist.background,
    fontFamily: 'Helvetica',
  },
  // Header - Clean, left-aligned
  header: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  profilePictureContainer: {
    marginLeft: 15,
  },
  profilePicture: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  name: {
    fontSize: 26,
    fontWeight: 'normal',
    color: '#111827',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    fontSize: 9,
    color: '#6b7280',
    marginTop: 4,
  },
  separator: {
    color: '#9ca3af',
  },
  // Section Titles - Minimal, subtle
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'normal',
    color: '#9ca3af',
    marginTop: 18,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingBottom: 4,
  },
  sectionTitleFirst: {
    marginTop: 0,
  },
  summary: {
    fontSize: 10,
    color: '#4b5563',
    lineHeight: 1.6,
    marginBottom: 0,
    textAlign: 'left',
  },
  // Experience & Education
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
    fontSize: 11,
    fontWeight: 'normal',
    color: '#111827',
    marginBottom: 2,
  },
  company: {
    fontSize: 9,
    color: '#6b7280',
    marginTop: 1,
  },
  date: {
    fontSize: 8,
    color: '#9ca3af',
    marginTop: 0,
    fontStyle: 'italic',
  },
  bullet: {
    fontSize: 9,
    color: '#4b5563',
    lineHeight: 1.5,
    marginLeft: 12,
    marginBottom: 3,
  },
  description: {
    fontSize: 9,
    color: '#4b5563',
    lineHeight: 1.5,
    marginTop: 4,
    marginBottom: 8,
  },
  // Skills - Simple comma-separated
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 6,
  },
  skill: {
    fontSize: 9,
    color: '#4b5563',
  },
  skillSeparator: {
    fontSize: 8,
    color: '#d1d5db',
  },
  // Languages
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 6,
  },
  languageItem: {
    fontSize: 9,
    color: '#4b5563',
  },
  languageName: {
    fontWeight: 'normal',
    color: '#111827',
  },
  // Projects & Certifications
  projectItem: {
    marginBottom: 10,
  },
  certificationItem: {
    marginBottom: 10,
  },
  // Links
  link: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 4,
  },
  categoryTitle: {
    fontSize: 9,
    fontWeight: 'normal',
    color: '#6b7280',
    marginTop: 8,
    marginBottom: 4,
  },
})
