/* global React */
// Pixelboost-specific tweaks panel.
// Exposes:
//   - heroVariant: which hero headline angle
//   - density: cozy vs. regular
//   - accent: warm accent color

function PixelboostTweaks({ tw, setTw }) {
  const set = (k) => (v) => setTw(k, v);
  return (
    <window.TweaksPanel title="Pixelboost · Tweaks">
      <window.TweakSection label="Hero" />
      <window.TweakRadio
        label="Headline angle"
        value={tw.heroVariant}
        options={[
          { value: "inhouse", label: "In-house dev" },
          { value: "custom",  label: "Custom" },
          { value: "fast",    label: "Fast" },
        ]}
        onChange={set("heroVariant")}
      />

      <window.TweakSection label="Layout" />
      <window.TweakRadio
        label="Density"
        value={tw.density}
        options={[
          { value: "regular", label: "Regular" },
          { value: "cozy",    label: "Cozy" },
        ]}
        onChange={set("density")}
      />

      <window.TweakSection label="Theme" />
      <window.TweakColor
        label="Warm accent"
        value={tw.accent}
        onChange={set("accent")}
      />
    </window.TweaksPanel>
  );
}

// Hook that wires defaults → state, used by App
function usePixelboostTweaks() {
  const DEFAULTS = /*EDITMODE-BEGIN*/{
    "heroVariant": "inhouse",
    "density": "regular",
    "accent": "#F0B36A"
  }/*EDITMODE-END*/;
  const [tw, setTw] = window.useTweaks(DEFAULTS);
  return { tw, setTw };
}

Object.assign(window, { PixelboostTweaks, usePixelboostTweaks });
