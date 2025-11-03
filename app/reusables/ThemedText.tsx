import React from 'react';
import { Text, TextProps, StyleProp, TextStyle } from 'react-native';
import { useTheme } from '../providers/ThemeProviders';
import Colors from '../constants/Color';
import { FONT_SIZES, FONT_WEIGHTS } from '../constants/typography';
import { BORDER_RADIUS, SPACING } from '../constants/layout';

type Variant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subheading'
  | 'body'
  | 'caption'
  | 'instructions'
  | 'description'
  | 'title'
  | 'subtitle'
  | 'subtitleSmall'
  | 'dropdownItemText'
  | 'profileTitle'
  | 'modalSubTitle'
  | 'preferenceTitle'
  | 'uploadText'
  | 'inputLabel'
  | 'current'
  | 'successTitle'
  | 'successSubtitle'
  | 'preview'
  | 'previewTitle'
  | 'tradeDescription'
  | 'returnOffer'
  | 'tradeText'
  | 'click'
  | 'clickDescription'
  | 'welcomeText'
  | 'welcomeWord'
  | 'userNames'
  | 'locationText'
  | 'filterLabel'
  | 'filterButtonText'
  | 'resetFilterText'
  | 'filterOptionText'
  | 'userName'
  | 'tradeTitle'
  | 'tradeQuality'
  | 'returnOfferText'
  | 'headerTitle'
  | 'bioText'
  | 'preferenceText'
  | 'itemTitle'
  | 'itemDate'
  | 'menuText'
  | 'reviewDate'
  | 'reviewItem'
  

interface ThemedTextProps extends TextProps {
  variant?: Variant;
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

const ThemedText: React.FC<ThemedTextProps> = ({
  variant = 'body',
  children,
  style,
  ...rest
}) => {
  const { theme: themeKey } = useTheme();
  const colors = Colors[themeKey];

  const textStyles: Record<Variant, TextStyle> = {
    h1: {
      fontSize: FONT_SIZES['2xl'],
      fontFamily: 'Poppins_700Bold',
      color: colors.text,
      lineHeight: 40,
      fontWeight: FONT_WEIGHTS.bold
    },
    h2: {
      fontSize: FONT_SIZES['3xl'],
      fontFamily: 'Poppins_600SemiBold',
      color: colors.text,
      lineHeight: 32,
    },
    h3: {
      fontSize: FONT_SIZES.xs,
      fontFamily: 'Poppins_500Medium',
      color: colors.label,
      lineHeight: 28,
      textAlign: 'left',
      alignItems: 'flex-start',
      fontWeight: FONT_WEIGHTS.medium
    },
    h4: {
      fontSize: FONT_SIZES.xs,
      color: colors.buttonText,
      fontWeight: FONT_WEIGHTS.medium,
      fontFamily: 'Poppins_500Medium',
      marginRight: 8,
    },
    h5: {
    color: colors.lightGreen,
    textDecorationLine: 'underline',
    fontWeight: FONT_WEIGHTS.normal,
    fontFamily: 'Poppins_500Medium',
    fontSize: FONT_SIZES.base,
    },
    h6: {
    color: colors.textSecondaryDark,
    fontWeight: FONT_WEIGHTS.normal,
    fontSize: FONT_SIZES.base,
    fontFamily: 'Poppins_500Medium'
    },
    subheading: {
      fontSize: FONT_SIZES.lg,
      fontFamily: 'Poppins_700Bold',
      color: colors.text,
      fontWeight: FONT_WEIGHTS.bold,
    },
    body: {
      fontSize: FONT_SIZES.lg,
      fontFamily: 'Poppins_400Regular',
      color: colors.text,
      lineHeight: 24,
    },
    caption: {
      color: colors.textBlue,
       fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.normal,
    fontFamily: 'Poppins_500Medium',
    textDecorationLine: 'underline'
    },
    instructions: {
     fontSize: FONT_SIZES.base,
     color: colors.textSecondaryDark,
     textAlign: 'center',
     marginBottom: SPACING['3xl'],
     lineHeight: 22,
    },
    description: {
     fontSize: FONT_SIZES.base,
     color: colors.buttonText,
     textAlign: 'center',
     lineHeight: 22,
     paddingHorizontal: SPACING.lg,
     marginTop: 5,
    },
    title: {
      fontSize: FONT_SIZES['3xl'],
      fontFamily: 'Poppins_700Bold',
      color: colors.buttonText,
      marginBottom: 20,
      textAlign: 'center'
    },
    preferenceTitle: {
      fontSize: FONT_SIZES['3xl'],
      fontFamily: 'Poppins_700Bold',
      fontWeight: FONT_WEIGHTS.bold,
      color: colors.buttonText,
      textAlign: 'center'
    },
    subtitle: {
      fontSize: FONT_SIZES.base,
      color: colors.buttonText,
      fontWeight: FONT_WEIGHTS.medium,
      textAlign: 'center',
      paddingHorizontal: 10,
      lineHeight: 22,
    },
    subtitleSmall: {
      fontSize: FONT_SIZES.base,
      color: colors.buttonText,
      marginBottom: 20,
      paddingHorizontal: 12,
      fontFamily: 'Poppins_500Medium'
    },
    dropdownItemText: {
      fontSize: FONT_SIZES.xs,
      color: colors.textBody,
      fontFamily: 'Poppins_500Medium',
      fontWeight: FONT_WEIGHTS.medium
    },
    profileTitle: {
      fontSize: FONT_SIZES['3xl'],
      fontWeight: FONT_WEIGHTS.bold,
      fontFamily: 'Poppins_700Bold',
      textAlign: 'center',
      lineHeight: 24,
      marginVertical: 20,
      color: colors.buttonText
    },
    modalSubTitle: {
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.medium,
      fontFamily: 'Poppins_500Medium',
      color: colors.textSecondaryDark,
      marginBottom: 30,
      lineHeight: 18,
      alignSelf: 'flex-start',
      width: '90%',
      textAlign: 'left',
    },
    uploadText: {
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.normal,
      fontFamily: 'Poppins_400Regular',
      color: colors.textHeadings
    },
    inputLabel: {
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.semibold,
      color: colors.textHeadings,
      fontFamily: 'Poppins_600SemiBold',
      marginTop: 15,
    },
    current: {
     fontSize: FONT_SIZES.sm,
     fontWeight: FONT_WEIGHTS.medium,
     color: colors.textInformation,
     fontFamily: 'Poppins_500Medium'
    },
    successTitle: {
    fontSize: FONT_SIZES['3xl'],
    fontWeight: FONT_WEIGHTS.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 28,
    },
    successSubtitle: {
      fontSize: FONT_SIZES.base,
      color: colors.buttonText,
      fontWeight: FONT_WEIGHTS.normal,
      fontFamily: 'Poppins_400Regular',
      textAlign: 'center',
      lineHeight: 20,
    },
    preview: {
      color: colors.text,
      fontSize: FONT_SIZES.lg,
      fontFamily: 'Poppins_700Bold',
      fontWeight: FONT_WEIGHTS.bold,
    },
    previewTitle: {
       color: colors.text,
      fontSize: FONT_SIZES.lg,
      fontFamily: 'Poppins_700Bold',
      fontWeight: FONT_WEIGHTS.bold,
      marginBottom: SPACING.xl,
    },
    tradeDescription: {
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.normal,
      color: colors.buttonText,
      fontFamily: 'Poppins_400Regular',
      marginBottom: SPACING.xl,
    },
    returnOffer: {
     lineHeight: 22,
      marginBottom: SPACING.xl,
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.medium,
      fontFamily: 'Poppins_500Medium',
      color: colors.buttonText, 
      backgroundColor: colors.lightSurface, 
      paddingHorizontal: 10, 
       paddingVertical: 6,
       borderRadius: BORDER_RADIUS.sm,
       alignSelf: 'flex-start',
    },
    tradeText: {
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.normal,
      fontFamily: 'Poppins_400Regular',
      color: colors.buttonText
    },
    click: {
     color: colors.textAction,
     fontSize: FONT_SIZES['4xl'],
     fontWeight: FONT_WEIGHTS.bold,
     fontFamily: 'Poppins_700Bold',
    lineHeight: 34,
    marginBottom: 5,
    paddingHorizontal: 5,
    },
    clickDescription: {
      color: colors.textAction,
      fontSize: FONT_SIZES.lg,
      fontWeight: FONT_WEIGHTS.normal,
      fontFamily: 'Poppins_400Regular',
      marginBottom: 20,
      paddingHorizontal: 5,
    },
    welcomeText: {
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.semibold,
      fontFamily: 'Poppins_500Medium'
    },
    welcomeWord: {
      color: colors.textBlue
    },
    userNames: {
      color: colors.text
    },
    locationText: {
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.medium,
      color: colors.textBody,
      fontFamily: 'Poppins_500Medium'
    },
    filterLabel: {
      color: colors.textFilter,
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.medium,
      fontFamily: 'Poppins_500Medium',
      marginRight: SPACING.xs
    },
    filterButtonText: {
      color: colors.textFilter,
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.medium,
      fontFamily: 'Poppins_500Medium'
    },
    resetFilterText: {
      color: colors.textError,
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.medium,
      fontFamily: 'Poppins_500Medium'
    },
    filterOptionText: {
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.medium,
      color: colors.textBody,
      fontFamily: 'Poppins_500Medium'
    },
    userName: {
      fontSize: FONT_SIZES.base,
      color: colors.background,
      fontWeight: FONT_WEIGHTS.medium,
      fontFamily: 'Poppins_500Medium'
    },
    tradeTitle: {
      color: colors.textAction,
      fontSize: FONT_SIZES.lg,
      fontWeight: FONT_WEIGHTS.bold,
      fontFamily: 'Poppins_700Bold',
      marginBottom: SPACING.xs,
      textDecorationLine: 'underline'
    },
    tradeQuality: {
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.medium,
      color: colors.textAction,
      marginBottom: SPACING.sm,
      fontFamily: 'Poppins_500Medium'
    },
    returnOfferText: {
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.medium,
      color: colors.textAction,
      fontFamily: "Poppins_500Medium"
    },
    headerTitle: {
      fontSize: FONT_SIZES.lg,
      fontFamily: 'Poppins_700Bold',
      color: colors.text,
      fontWeight: FONT_WEIGHTS.bold,
      flex: 1,
      marginHorizontal: SPACING.md
    },
    bioText: {
      fontSize: FONT_SIZES.lg,
      fontFamily: 'Poppins_600SemiBold',
      color: colors.text,
      fontWeight: FONT_WEIGHTS.semibold,
      marginBottom: SPACING.sm,
    },
    preferenceText:{
      color: colors.text,
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.medium,
      fontFamily: 'Poppins_500Medium'
    },
    itemTitle: {
      color: colors.text,
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.bold,
      fontFamily: 'Poppins_700Bold',
      marginBottom: SPACING.sm
    },
    itemDate: {
      fontSize: FONT_SIZES.xs,
      fontWeight: FONT_WEIGHTS.normal,
      fontFamily: 'Poppins_400Regular',
      color: colors.buttonText
    },
    menuText: {
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.medium,
      fontFamily: 'Poppins_500Medium',
      color: colors.textError
    },
    reviewDate: {
      fontSize: FONT_SIZES.xs,
      fontWeight: FONT_WEIGHTS.medium,
      fontFamily: 'Poppins_500Medium',
      color: colors.textSecondaryDark,
      marginTop: 2,
    },
    reviewItem: {
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.normal,
      fontFamily: 'Poppins_400Regular',
      color: colors.text,
      marginTop: 5,
      textDecorationLine: 'underline'
    }
  };

  return (
    <Text style={[textStyles[variant], style]} {...rest}>
      {children}
    </Text>
  );
};

export default ThemedText;
