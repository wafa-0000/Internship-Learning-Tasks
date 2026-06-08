// constants/theme.ts
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export const SIZES = {
  padding: width * 0.05, // Screen width ka 5%
  borderRadius: 15,
  fontBase: width > 350 ? 16 : 14,
};