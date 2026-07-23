export const TEMP_UNITS = ["c", "f"] as const
export type TempUnit = (typeof TEMP_UNITS)[number]

// Fahrenheit oven dials are marked in 25° increments, and cookbooks pair
// common Celsius oven temperatures with conventional Fahrenheit values
// rather than exact conversions (175°C is "350°F", not 347°F).
const OVEN_CONVENTIONS: Record<number, number> = {
  100: 212,
  110: 225,
  120: 250,
  130: 265,
  140: 275,
  150: 300,
  160: 325,
  170: 340,
  175: 350,
  180: 350,
  190: 375,
  200: 400,
  210: 410,
  220: 425,
  230: 450,
  240: 475,
  250: 500,
}

export function celsiusToFahrenheit(celsius: number): number {
  const conventional = OVEN_CONVENTIONS[celsius]
  if (conventional !== undefined) return conventional
  const exact = (celsius * 9) / 5 + 32
  return Math.round(exact / 5) * 5
}

// Rewrites every "N°C" occurrence in prose to Fahrenheit. Leaves text
// untouched for unit "c" or when no Celsius temperature is present.
export function localizeTemps(text: string, unit: TempUnit): string {
  if (unit === "c") return text
  return text.replace(
    /(\d+(?:\.\d+)?)\s*°C/g,
    (_, value: string) => `${celsiusToFahrenheit(Number(value))}°F`
  )
}
