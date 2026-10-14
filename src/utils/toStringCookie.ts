import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

type cookies = {
  name: string;
  value: string;
};

export const toCookieStore = (cookies: ReadonlyRequestCookies) => {
  let strCookie = ``;

  const allCookies: cookies[] = cookies.getAll();

  allCookies.forEach((item) => {
    strCookie += `${item.name}=${item.value};`;
  });

  return strCookie;
};
