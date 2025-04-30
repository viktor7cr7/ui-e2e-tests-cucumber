export const getJsonFromFile = <T = Record<string, string>>(path: string): T => {
  if (path.includes(process.cwd())) {
    return require(path);
  } else {
    console.log("123");
    return require(`${process.cwd()}${path}`);
  }
};

export const env = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw Error(`Нет значения окружения для ключа ${key}`);
  }
  return value;
};

export const envNumber = (key: string): number => {
  return Number(env(key));
};
