export interface ExpressionObject {
  [key: string]: boolean;
}

export default (obj: ExpressionObject): true | string[] => {
  const errors = [];

  for (const key in obj) {
    !obj[key] && errors.push(key);
  }

  return !errors.length || errors;
};
