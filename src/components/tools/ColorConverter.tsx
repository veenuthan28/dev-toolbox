import { useState, useCallback, useMemo } from 'react';
import CopyButton from '../CopyButton';
import { parseHex, rgbToHex, rgbToHsl, rgbToOklch } from '../../utils/color';
import './ColorConverter.css';

/**
 * Color Converter — enter HEX, get RGB / HSL / OKLCH with
 * live preview swatch and individual copy buttons.
 */
export default function ColorConverter() {
  const [hexInput, setHexInput] = useState('#6d28d9');
  const [pickerValue, setPickerValue] = useState('#6d28d9');

  const handleHexChange = useCallback((value: string) => {
    setHexInput(value);
    const normalised = value.startsWith('#') ? value : '#' + value;
    const rgb = parseHex(normalised);
    if (rgb) {
      setPickerValue(rgbToHex(rgb.r, rgb.g, rgb.b));
    }
  }, []);

  const handlePickerChange = useCallback((value: string) => {
    setPickerValue(value);
    setHexInput(value);
  }, []);

  const result = useMemo(() => {
    const normalised = hexInput.startsWith('#') ? hexInput : '#' + hexInput;
    const rgb = parseHex(normalised);
    if (!rgb) return null;

    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const oklch = rgbToOklch(rgb.r, rgb.g, rgb.b);

    return {
      hex,
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      oklch: `oklch(${oklch.l} ${oklch.c} ${oklch.h})`,
    };
  }, [hexInput]);

  return (
    <div className="panel-card">
      <div className="panel-header">
        <h2>Color Converter</h2>
        <p>Enter a HEX color to convert it to RGB, HSL, and OKLCH formats.</p>
      </div>

      {/* Input row */}
      <div className="color-input-row">
        <div className="field-group" style={{ flex: 1 }}>
          <label htmlFor="color-hex-input">HEX Color</label>
          <input
            type="text"
            id="color-hex-input"
            placeholder="#6d28d9"
            value={hexInput}
            onChange={(e) => handleHexChange(e.target.value)}
          />
        </div>
        <div className="field-group" style={{ maxWidth: 80 }}>
          <label htmlFor="color-picker-input">Pick</label>
          <input
            type="color"
            id="color-picker-input"
            value={pickerValue}
            onChange={(e) => handlePickerChange(e.target.value)}
          />
        </div>
      </div>

      {/* Live swatch */}
      <div
        className="color-swatch"
        style={{ background: result ? result.hex : '#000' }}
      />

      {/* Error */}
      {!result && hexInput.replace('#', '').length > 0 && (
        <div className="color-error">
          Invalid HEX color. Use formats like #fff or #6d28d9.
        </div>
      )}

      {/* Format outputs */}
      {result && (
        <div className="color-formats">
          <FormatCard label="HEX" value={result.hex} />
          <FormatCard label="RGB" value={result.rgb} />
          <FormatCard label="HSL" value={result.hsl} />
          <FormatCard label="OKLCH" value={result.oklch} />
        </div>
      )}
    </div>
  );
}

/* ---------- Internal sub-component ---------- */

function FormatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="color-format-card">
      <div>
        <div className="color-format-label">{label}</div>
        <div className="color-format-value">{value}</div>
      </div>
      <CopyButton text={value} />
    </div>
  );
}
