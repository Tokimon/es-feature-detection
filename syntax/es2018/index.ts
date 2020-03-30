import objectSpreadProperties, { entryName as objectSpreadPropertiesName } from './objectSpreadProperties';
import regExpLookbehindAssertions, { entryName as regExpLookbehindAssertionsName } from './regExpLookbehindAssertions';
import regExpNamedCaptureGroups, { entryName as regExpNamedCaptureGroupsName } from './regExpNamedCaptureGroups';
import TemplateLiteralRevision, { entryName as TemplateLiteralRevisionName } from './TemplateLiteralRevision';

export default () => ({
  [objectSpreadPropertiesName]: objectSpreadProperties(),
  [regExpLookbehindAssertionsName]: regExpLookbehindAssertions(),
  [regExpNamedCaptureGroupsName]: regExpNamedCaptureGroups(),
  [TemplateLiteralRevisionName]: TemplateLiteralRevision()
});
