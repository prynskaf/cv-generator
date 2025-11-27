import { StyleSheet } from '@react-pdf/renderer'
import { colors } from '../shared/styles'

export const professionalStyles = StyleSheet.create({
  page: {
    padding: 50,
    backgroundColor: colors.professional.background,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 25,
    paddingBottom: 20,
    borderBottomWidth: 3,
    borderBottomColor: colors.professional.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
    textAlign: 'left',
  },
  profilePictureContainer: {
    marginLeft: 20,
  },
  profilePicture: {
    width: 90,
    height: 90,
    borderRadius: 8, // Rounded rectangle
    borderWidth: 2,
    borderColor: colors.professional.primary,
  },
  name: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.professional.primary,
    marginBottom: 8,
    letterSpacing: 1,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 10,
    fontSize: 10,
    color: colors.professional.light,
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 15,
    marginTop: 8,
    fontSize: 9,
  },
  linkItem: {
    color: colors.professional.primary,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.professional.primary,
    marginTop: 20,
    marginBottom: 12,
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: colors.professional.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionTitleFirst: {
    marginTop: 10,
  },
  summary: {
    fontSize: 10,
    color: colors.professional.text,
    lineHeight: 1.7,
    textAlign: 'justify',
    marginBottom: 5,
  },
  jobHeader: {
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.professional.secondary,
  },
  company: {
    fontSize: 10,
    color: colors.professional.text,
    marginTop: 3,
  },
  date: {
    fontSize: 9,
    color: colors.professional.light,
    fontStyle: 'italic',
    marginTop: 2,
  },
  bullet: {
    fontSize: 10,
    color: colors.professional.text,
    lineHeight: 1.6,
    marginLeft: 15,
    marginBottom: 5,
  },
  description: {
    fontSize: 10,
    color: colors.professional.text,
    lineHeight: 1.6,
    marginTop: 6,
    marginBottom: 12,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  skill: {
    fontSize: 9,
    color: colors.professional.primary,
    padding: '6 12',
    borderWidth: 1,
    borderColor: colors.professional.accent,
    borderRadius: 4,
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginTop: 8,
  },
  languageItem: {
    fontSize: 10,
    color: colors.professional.text,
  },
  languageName: {
    fontWeight: 'bold',
    color: colors.professional.secondary,
  },
  categoryTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.professional.secondary,
    marginTop: 10,
    marginBottom: 6,
  },
})
