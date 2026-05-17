export function interpolatePrompt(
  template: string,
  upstreamOutputs: Record<string, unknown>
) {
  let result = template;

  for (const [nodeId, output] of Object.entries(upstreamOutputs)) {
    const stringOutput =
      typeof output === "string" ? output : JSON.stringify(output, null, 2);

    result = result.replaceAll(`{{${nodeId}}}`, stringOutput);
    result = result.replaceAll(`{{${nodeId}.Response}}`, stringOutput);
    result = result.replaceAll(`{{${nodeId}.Image}}`, stringOutput);
  }

  return result;
}