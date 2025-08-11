const { withPodfile } = require('@expo/config-plugins');

function ensureSimdjsonPod(podfile) {
  if (podfile.includes("pod 'simdjson'")) return podfile;
  // Inject after use_expo_modules! inside the target block
  const needle = 'use_expo_modules!';
  const insertion = "  pod 'simdjson', path: '../node_modules/@nozbe/simdjson', modular_headers: true\n";
  if (podfile.includes(needle)) {
    return podfile.replace(needle, `${needle}\n${insertion}`);
  }
  // Fallback: append near the end of the first target block
  return podfile.replace(/target\s+'[^']+'\s+do[\s\S]*?end/, (block) => {
    if (block.includes("pod 'simdjson'")) return block;
    const lines = block.split('\n');
    lines.splice(1, 0, insertion.trimEnd());
    return lines.join('\n');
  });
}

module.exports = function withWatermelonSimdjson(config) {
  return withPodfile(config, (config) => {
    const contents = config.modResults.contents;
    config.modResults.contents = ensureSimdjsonPod(contents);
    return config;
  });
};
