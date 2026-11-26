import _DataView_prototype_getFloat16 from '@/builtins/DataView.prototype.getFloat16';
import _Float16Array from '@/builtins/Float16Array';
import _Iterator from '@/builtins/Iterator';
import _Iterator_from from '@/builtins/Iterator.from';
import _Iterator_prototype_drop from '@/builtins/Iterator.prototype.drop';
import _Iterator_prototype_every from '@/builtins/Iterator.prototype.every';
import _Iterator_prototype_filter from '@/builtins/Iterator.prototype.filter';
import _Iterator_prototype_find from '@/builtins/Iterator.prototype.find';
import _Iterator_prototype_flatMap from '@/builtins/Iterator.prototype.flatMap';
import _Iterator_prototype_forEach from '@/builtins/Iterator.prototype.forEach';
import _Iterator_prototype_map from '@/builtins/Iterator.prototype.map';
import _Iterator_prototype_reduce from '@/builtins/Iterator.prototype.reduce';
import _Iterator_prototype_some from '@/builtins/Iterator.prototype.some';
import _Iterator_prototype_take from '@/builtins/Iterator.prototype.take';
import _Iterator_prototype_toArray from '@/builtins/Iterator.prototype.toArray';
import _Math_f16round from '@/builtins/Math.f16round';
import _Promise_try from '@/builtins/Promise.try';
import _RegExp_escape from '@/builtins/RegExp.escape';
import _Set_prototype_difference from '@/builtins/Set.prototype.difference';
import _Set_prototype_intersection from '@/builtins/Set.prototype.intersection';
import _Set_prototype_isDisjointFrom from '@/builtins/Set.prototype.isDisjointFrom';
import _Set_prototype_isSubsetOf from '@/builtins/Set.prototype.isSubsetOf';
import _Set_prototype_isSupersetOf from '@/builtins/Set.prototype.isSupersetOf';
import _Set_prototype_symmetricDifference from '@/builtins/Set.prototype.symmetricDifference';
import _Set_prototype_union from '@/builtins/Set.prototype.union';
import _Intl_DurationFormat from '@/localization/Intl.DurationFormat';
import _Intl_DurationFormat_prototype_format from '@/localization/Intl.DurationFormat.prototype.format';
import _Intl_DurationFormat_prototype_formatToParts from '@/localization/Intl.DurationFormat.prototype.formatToParts';
import _Intl_DurationFormat_prototype_resolvedOptions from '@/localization/Intl.DurationFormat.prototype.resolvedOptions';
import _importAttributes from '@/syntax/importAttributes';
import _regExpDuplicateNamedGroups from '@/syntax/regExpDuplicateNamedGroups';
import _regExpModifiers from '@/syntax/regExpModifiers';

export const builtins = () => ({
  'DataView.prototype.getFloat16': _DataView_prototype_getFloat16(),
  Float16Array: _Float16Array(),
  Iterator: _Iterator(),
  'Iterator.from': _Iterator_from(),
  'Iterator.prototype.drop': _Iterator_prototype_drop(),
  'Iterator.prototype.every': _Iterator_prototype_every(),
  'Iterator.prototype.filter': _Iterator_prototype_filter(),
  'Iterator.prototype.find': _Iterator_prototype_find(),
  'Iterator.prototype.flatMap': _Iterator_prototype_flatMap(),
  'Iterator.prototype.forEach': _Iterator_prototype_forEach(),
  'Iterator.prototype.map': _Iterator_prototype_map(),
  'Iterator.prototype.reduce': _Iterator_prototype_reduce(),
  'Iterator.prototype.some': _Iterator_prototype_some(),
  'Iterator.prototype.take': _Iterator_prototype_take(),
  'Iterator.prototype.toArray': _Iterator_prototype_toArray(),
  'Math.f16round': _Math_f16round(),
  'Promise.try': _Promise_try(),
  'RegExp.escape': _RegExp_escape(),
  'Set.prototype.difference': _Set_prototype_difference(),
  'Set.prototype.intersection': _Set_prototype_intersection(),
  'Set.prototype.isDisjointFrom': _Set_prototype_isDisjointFrom(),
  'Set.prototype.isSubsetOf': _Set_prototype_isSubsetOf(),
  'Set.prototype.isSupersetOf': _Set_prototype_isSupersetOf(),
  'Set.prototype.symmetricDifference': _Set_prototype_symmetricDifference(),
  'Set.prototype.union': _Set_prototype_union(),
});

export const syntax = () => ({
  importAttributes: _importAttributes(),
  regExpDuplicateNamedGroups: _regExpDuplicateNamedGroups(),
  regExpModifiers: _regExpModifiers(),
});

export const localization = () => ({
  'Intl.DurationFormat': _Intl_DurationFormat(),
  'Intl.DurationFormat.prototype.format':
    _Intl_DurationFormat_prototype_format(),
  'Intl.DurationFormat.prototype.formatToParts':
    _Intl_DurationFormat_prototype_formatToParts(),
  'Intl.DurationFormat.prototype.resolvedOptions':
    _Intl_DurationFormat_prototype_resolvedOptions(),
});

// All features
export default () => ({
  ...builtins(),
  ...syntax(),
  ...localization(),
});
