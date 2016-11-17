
export const HOST = 'http://www.mydomain.com';
export const PORT = 8056;
export const ROOT = `${HOST}:${PORT}`;

export function parseFormData(str) {
  const fields = {};
  const rows = str.split(/(\r\n)+/);
  rows.forEach((row, i) => {
    const name = (/name="(.+?)"/.exec(row) || [])[1];
    if (name) {
      fields[name] = rows[i + 2];
    }
  });
  return fields;
}
