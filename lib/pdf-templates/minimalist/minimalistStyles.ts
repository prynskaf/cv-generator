import { StyleSheet } from '@react-pdf/renderer'
import { colors } from '../shared/styles'

export const minimalistStyles = StyleSheet.create({
  page: {
    padding: 45,
    backgroundColor: colors.minimalist.background,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 15,
  },
  profilePictureContainer: {
    marginTop: 5,
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30, // Small circle
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.minimalist.primary,
    marginBottom: 6,
    flex: 1,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 6,
    fontSize: 9,
    color: colors.minimalist.light,
  },
  separator: {
    color: colors.minimalist.light,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.minimalist.primary,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitleFirst: {
    marginTop: 0,
  },
  summary: {
    fontSize: 9,
    color: colors.minimalist.text,
    lineHeight: 1.5,
    marginBottom: 5,
  },
  jobHeader: {
    marginBottom: 6,
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.minimalist.secondary,
  },
  company: {
    fontSize: 9,
    color: colors.minimalist.text,
    marginTop: 2,
  },
  date: {
    fontSize: 8,
    color: colors.minimalist.light,
    marginTop: 2,
  },
  bullet: {
    fontSize: 9,
    color: colors.minimalist.text,
    lineHeight: 1.5,
    marginLeft: 10,
    marginBottom: 3,
  },
  description: {
    fontSize: 9,
    color: colors.minimalist.text,
    lineHeight: 1.5,
    marginTop: 5,
    marginBottom: 10,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 6,
  },
  skill: {
    fontSize: 8,
    color: colors.minimalist.secondary,
    padding: '4 0',
    marginRight: 8,
  },
  skillDot: {
    fontSize: 6,
    color: colors.minimalist.light,
  },
  languageItem: {
    fontSize: 9,
    color: colors.minimalist.text,
    marginBottom: 4,
  },
  languageName: {
    fontWeight: 'bold',
    color: colors.minimalist.secondary,
  },
  link: {
    fontSize: 8,
    color: colors.minimalist.text,
    marginBottom: 4,
  },
  categoryTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.minimalist.secondary,
    marginTop: 8,
    marginBottom: 4,
  },
})
