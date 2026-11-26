import { describe, expect, it } from 'bun:test';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const sections = ['builtins', 'localization', 'syntax'];

const srcDir = join(import.meta.dirname, '..', 'src');
const registered = new Set<string>();
for (const f of readdirSync(srcDir).filter((f) => /^es\d{4}\.ts$/.test(f))) {
  const mod = await import(join(srcDir, f));
  const sectionKeys: string[] = [];
  for (const section of sections) {
    sectionKeys.push(...Object.keys(mod[section]?.() ?? {}));
  }
  for (const key of sectionKeys) registered.add(key);

  it(`${f} default export combines all its sections`, () => {
    const all = mod.default();
    expect(Object.keys(all).sort()).toEqual(sectionKeys.sort());
    for (const value of Object.values(all))
      expect(typeof value).toBe('boolean');
  });
}

for (const section of sections) {
  const dir = join(srcDir, section);
  const names = readdirSync(dir)
    .filter((f) => f.endsWith('.ts') && f !== 'index.ts')
    .map((f) => f.slice(0, -3));

  for (const name of names) {
    describe(`${section}/${name}`, async () => {
      const file = await import(`../src/${section}/${name}.ts`);

      it('exports a function that returns a boolean', () => {
        expect(typeof file.default()).toBe('boolean');
      });

      it('exports the test expression', () => {
        expect(file.expression.length).toBeGreaterThan(3);
      });

      // Syntax tests are named after the feature, not an identifier
      if (section !== 'syntax') {
        it('tests the feature given in the name', () => {
          const [owner, , method] = name.split('.');
          expect(file.expression).toContain(owner);
          if (name.includes('.prototype.')) {
            expect(file.expression).toContain(`.${method}`);
          }
        });
      }

      it('is registered in an esXXXX file', () => {
        expect(registered.has(name)).toBe(true);
      });
    });
  }
}
