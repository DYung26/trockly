const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';


const textBlue = '#3247D5';
const textSecondaryDark = '#777A84';
const neutralDark = '#726C6C'
const grey500 = '#6D6D6D';
const lightGreen = '#729B27';
const textBody = '#555965';
const textHeadings = '#383A40';
const textInformation = '#39417C';
const lightSurface = '#D9D9D9';
const textAction = '#EFEEF0';
const textFilter = '#454751';
const textError = '#A33132';


const Colors = {
  light: {
    text: '#383A40',
    background: '#fff',
    tint: tintColorLight,
    textBlue,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    button: '#007AFF',
    buttonText: '#555965',
    inputBackground: '#f5f5f5',
    textFilter,
    textError,
    inputBorder: '#ccc',
    lightSurface,
    label: '#383A40',
    textSecondaryDark,
    textInformation,
    textAction,
    lightGreen,
    textHeadings,
    neutralDark,
    grey500,
    textBody
  },
  dark: {
    text: '#383A40',
    textDrak: '#000',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    textSecondaryDark,
    neutralDark,
    grey500,
    textBlue,
    tabIconSelected: tintColorDark,
    textFilter,
    textError,
    button: '#007AFF',
    buttonText: '#fff',
    textInformation,
    lightSurface,
    textAction,
    inputBackground: '#333',
    label: '#fff',
    lightGreen,
    textHeadings,
    textBody
  },
} as const; 

export default Colors;


export type Theme = typeof Colors.light;