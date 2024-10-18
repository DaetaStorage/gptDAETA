export function convertTimestamp(unixTimestamp: number) {
  const date = new Date(unixTimestamp * 1000); // Multiply by 1000 to convert from seconds to milliseconds
  const options = { day: "numeric", month: "long", year: "numeric" } as const;
  return date.toLocaleDateString("en-US", options); // 'en-GB' locale to ensure day comes first
}
