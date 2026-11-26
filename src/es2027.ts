import _AsyncDisposableStack from '@/builtins/AsyncDisposableStack';
import _Atomics_pause from '@/builtins/Atomics.pause';
import _DisposableStack from '@/builtins/DisposableStack';
import _Iterator_prototype_chunks from '@/builtins/Iterator.prototype.chunks';
import _Iterator_prototype_includes from '@/builtins/Iterator.prototype.includes';
import _Iterator_prototype_join from '@/builtins/Iterator.prototype.join';
import _Iterator_prototype_windows from '@/builtins/Iterator.prototype.windows';
import _Iterator_zip from '@/builtins/Iterator.zip';
import _Iterator_zipKeyed from '@/builtins/Iterator.zipKeyed';
import _SuppressedError from '@/builtins/SuppressedError';
import _Symbol_asyncDispose from '@/builtins/Symbol.asyncDispose';
import _Symbol_dispose from '@/builtins/Symbol.dispose';
import _Temporal from '@/builtins/Temporal';
import _Intl_Locale_prototype_getCalendars from '@/localization/Intl.Locale.prototype.getCalendars';
import _Intl_Locale_prototype_getCollations from '@/localization/Intl.Locale.prototype.getCollations';
import _Intl_Locale_prototype_getHourCycles from '@/localization/Intl.Locale.prototype.getHourCycles';
import _Intl_Locale_prototype_getNumberingSystems from '@/localization/Intl.Locale.prototype.getNumberingSystems';
import _Intl_Locale_prototype_getTextInfo from '@/localization/Intl.Locale.prototype.getTextInfo';
import _Intl_Locale_prototype_getTimeZones from '@/localization/Intl.Locale.prototype.getTimeZones';
import _Intl_Locale_prototype_getWeekInfo from '@/localization/Intl.Locale.prototype.getWeekInfo';
import _awaitUsingDeclaration from '@/syntax/awaitUsingDeclaration';
import _usingDeclaration from '@/syntax/usingDeclaration';

export const builtins = () => ({
  AsyncDisposableStack: _AsyncDisposableStack(),
  'Atomics.pause': _Atomics_pause(),
  DisposableStack: _DisposableStack(),
  'Iterator.prototype.chunks': _Iterator_prototype_chunks(),
  'Iterator.prototype.includes': _Iterator_prototype_includes(),
  'Iterator.prototype.join': _Iterator_prototype_join(),
  'Iterator.prototype.windows': _Iterator_prototype_windows(),
  'Iterator.zip': _Iterator_zip(),
  'Iterator.zipKeyed': _Iterator_zipKeyed(),
  SuppressedError: _SuppressedError(),
  'Symbol.asyncDispose': _Symbol_asyncDispose(),
  'Symbol.dispose': _Symbol_dispose(),
  Temporal: _Temporal(),
});

export const syntax = () => ({
  awaitUsingDeclaration: _awaitUsingDeclaration(),
  usingDeclaration: _usingDeclaration(),
});

export const localization = () => ({
  'Intl.Locale.prototype.getCalendars': _Intl_Locale_prototype_getCalendars(),
  'Intl.Locale.prototype.getCollations': _Intl_Locale_prototype_getCollations(),
  'Intl.Locale.prototype.getHourCycles': _Intl_Locale_prototype_getHourCycles(),
  'Intl.Locale.prototype.getNumberingSystems':
    _Intl_Locale_prototype_getNumberingSystems(),
  'Intl.Locale.prototype.getTextInfo': _Intl_Locale_prototype_getTextInfo(),
  'Intl.Locale.prototype.getTimeZones': _Intl_Locale_prototype_getTimeZones(),
  'Intl.Locale.prototype.getWeekInfo': _Intl_Locale_prototype_getWeekInfo(),
});

// All features
export default () => ({
  ...builtins(),
  ...syntax(),
  ...localization(),
});
