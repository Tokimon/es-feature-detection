import _Intl_Segmenter from '@/localization/Intl.Segmenter';

export const localization = () => ({
  'Intl.Segmenter': _Intl_Segmenter(),
});

// All features
export default () => ({
  ...localization(),
});
