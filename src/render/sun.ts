/**
 * Approximate solar position (NOAA-style low-precision formulas, good to well under a degree),
 * returned as a unit vector in scene axes: +x east, +y up, +z south.
 */
export function sunDirection(date: Date, minutesWIB: number, lat: number, lon: number): [number, number, number] {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start) / 86_400_000);
  const rad = Math.PI / 180;
  const declination = -23.44 * rad * Math.cos(((2 * Math.PI) / 365) * (dayOfYear + 10));
  const b = ((2 * Math.PI) / 364) * (dayOfYear - 81);
  const equationOfTime = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
  // WIB is UTC+7, whose meridian is 105° E.
  const solarMinutes = minutesWIB + (lon - 105) * 4 + equationOfTime;
  const hourAngle = (solarMinutes / 60 - 12) * 15 * rad;
  const phi = lat * rad;
  const east = -Math.cos(declination) * Math.sin(hourAngle);
  const north = Math.sin(declination) * Math.cos(phi) - Math.cos(declination) * Math.sin(phi) * Math.cos(hourAngle);
  const up = Math.sin(declination) * Math.sin(phi) + Math.cos(declination) * Math.cos(phi) * Math.cos(hourAngle);
  return [east, up, -north];
}
