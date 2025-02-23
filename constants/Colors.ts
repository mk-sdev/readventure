const tintColorLight = '#06d0ba'
const tintColorDark = '#01af9d'

const primaryLight = '#01af9d'
const secondaryLight = '#d8e9e8'
const surfaceLight = '#e4f0ef'

const primaryDark = '#007367'
const secondaryDark = '#122628'
const surfaceDark = '#122628'

const Colors = {
  light: {
    text: '#142423',
    background: '#fdfefe',
    button: primaryLight,
    buttonSecondary: secondaryLight,
    tint: tintColorLight,
    tabIconDefault: '#a5bab8',
    tabIconSelected: tintColorLight,
    inputBg: surfaceLight,
    inputBorder: tintColorLight,
    placeholder: 'RGBA(20, 36, 35, .35)',
    tileBg: surfaceLight,
    tileBorder: secondaryLight,
    tileGradient: secondaryLight,
    headerBorder: '#eee',
    bottomSheetHandle: secondaryLight,
    sliderThumb: primaryLight,
    sliderLeft: tintColorLight,
    sliderRight: secondaryLight,
  },
  dark: {
    text: '#edfffe',
    background: '#0e1318',
    button: primaryDark,
    buttonSecondary: secondaryDark,
    tint: tintColorDark,
    tabIconDefault: '#a5bab8',
    tabIconSelected: tintColorDark,
    inputBg: surfaceDark,
    inputBorder: tintColorDark,
    tileBg: surfaceDark,
    tileBorder: secondaryDark,
    placeholder: 'RGBA(237, 255, 254, .3)',
    tileGradient: secondaryDark,
    headerBorder: '#222',
    bottomSheetHandle: secondaryDark,
    sliderThumb: tintColorDark,
    sliderLeft: primaryDark,
    sliderRight: secondaryDark,
  },
}

export default Colors
