import globby from 'globby';
import { basename, resolve } from 'path';

import { ExpressionObject } from '../../utils/allOk';


export interface FileObj {
  expression: string;
  entryName?: string;
  defaultExport: Function;
  section: string;
  name: string;
}

export interface SectionMap {
  [key: string]: Array<FileObj>;
}

export default async (group: string, sections: string[] = []): Promise<(string | FileObj[] | ExpressionObject)[][]> => {
  for (let year = 2015; year <= 2018; year++) {
    sections.push('es' + year);
  }

  const tsPaths = sections.map(
    (section) => resolve(group, section, '**/*.ts').replace(/\\+/g, '/')
  );

  const paths = await globby(tsPaths);

  const files = await Promise.all(
    paths
      .map(async (path: string) => {
        const { default: defaultExport, ...rest } = await import(path);

        return {
          ...rest,
          defaultExport,
          section: path.match(new RegExp(group + '\/([^\/]+)'))[1],
          name: basename(path, '.ts')
        };
      })
  );

  const sectionsMap = files
    .reduce((obj: SectionMap, file: FileObj) => {
      if (file.expression) {
        if (!obj[file.section]) {
          obj[file.section] = [];
        }

        obj[file.section].push(file);
      }

      return obj;
    }, {});

  const sectionsMapArray: (string | FileObj[] | ExpressionObject)[][] = await Promise.all(Object.entries(sectionsMap)
    .map(async ([section, files]) => {
      const { default: sectionFn } = await import(resolve(group, section));
      return [section, files as FileObj[], sectionFn() as ExpressionObject];
    }));

  return sectionsMapArray;
};
