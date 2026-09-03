import { allCountries } from "country-telephone-data";

export interface Country {
  iso2: string;
  name: string;
  dialCode: string;
  flag: string;
}

function flagFromIso2(iso2: string): string {
  return iso2
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

export const COUNTRIES: Country[] = allCountries
  .map((c) => ({
    iso2: c.iso2,
    name: c.name.replace(/\s*\(.+\)\s*$/, ""),
    dialCode: c.dialCode,
    flag: flagFromIso2(c.iso2),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const DEFAULT_COUNTRY: Country =
  COUNTRIES.find((c) => c.iso2 === "np") ?? COUNTRIES[0];
