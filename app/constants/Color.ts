const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';


const textSecondaryLight = '#666';
const textSecondaryDark = '#666565';
const neutralDark = '#726C6C'
const grey500 = '#6D6D6D';


const Colors = {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    textSecondary: textSecondaryLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    button: '#007AFF',
    buttonText: '#fff',
    inputBackground: '#f5f5f5',
    inputBorder: '#ccc',
    label: '#333',
    neutralDark,
    grey500
  },
  dark: {
    text: '#fff',
    textDrak: '#000',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    textSecondary: textSecondaryDark,
    neutralDark,
    grey500,
    tabIconSelected: tintColorDark,
    button: '#007AFF',
    buttonText: '#fff',
    inputBackground: '#333',
    inputBorder: '#555',
    label: '#fff',
  },
} as const; 

export default Colors;


export type Theme = typeof Colors.light;