import { useState, useCallback } from 'react';
import CopyButton from '../CopyButton';
import { hexToRgba } from '../../utils/color';
import './BoxShadowGenerator.css';

interface ShadowState {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

const DEFAULT: ShadowState = {
  x: 4,
  y: 4,
  blur: 16,
  spread: 0,
  color: '#6d28d9',
  opacity: 40,
  inset: false,
};

/**
 * CSS Box Shadow Generator with live preview.
 */
export default function BoxShadowGenerator() {
  const [state, setState] = useState<ShadowState>(DEFAULT);

  const update = useCallback(
    (key: keyof ShadowState, value: number | string | boolean) => {
      setState((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const alpha = (state.opacity / 100).toFixed(2);
  const rgba = hexToRgba(state.color, parseFloat(alpha));
  const insetStr = state.inset ? 'inset ' : '';
  const cssValue = `${insetStr}${state.x}px ${state.y}px ${state.blur}px ${state.spread}px ${rgba}`;
  const cssLine = `box-shadow: ${cssValue};`;

  return (
    <div className="panel-card">
      <div className="panel-header">
        <h2>CSS Box Shadow Generator</h2>
        <p>Adjust the sliders to craft the perfect shadow, then copy the CSS.</p>
      </div>

      {/* Live Preview */}
      <div className="shadow-preview-area">
        <div className="shadow-box" style={{ boxShadow: cssValue }} />
      </div>

      {/* Controls */}
      <div className="shadow-controls">
        <div className="shadow-controls-left">
          <SliderField label="X Offset" value={state.x} min={-100} max={100} unit="px" onChange={(v) => update('x', v)} />
          <SliderField label="Y Offset" value={state.y} min={-100} max={100} unit="px" onChange={(v) => update('y', v)} />
          <SliderField label="Blur Radius" value={state.blur} min={0} max={150} unit="px" onChange={(v) => update('blur', v)} />
          <SliderField label="Spread" value={state.spread} min={-50} max={100} unit="px" onChange={(v) => update('spread', v)} />
        </div>

        <div className="shadow-controls-right">
          {/* Color Picker */}
          <div className="field-group">
            <label htmlFor="shadow-color">Shadow Color</label>
            <input
              type="color"
              id="shadow-color"
              value={state.color}
              onChange={(e) => update('color', e.target.value)}
            />
          </div>

          {/* Opacity */}
          <SliderField label="Opacity" value={state.opacity} min={0} max={100} unit="%" onChange={(v) => update('opacity', v)} />

          {/* Inset Toggle */}
          <div className="field-group">
            <label>Inset</label>
            <label className="toggle-wrap">
              <input
                type="checkbox"
                checked={state.inset}
                onChange={(e) => update('inset', e.target.checked)}
              />
              <span className="toggle-switch" />
              <span className="toggle-label">Enable inset shadow</span>
            </label>
          </div>
        </div>
      </div>

      {/* CSS Output */}
      <div className="field-group" style={{ marginTop: 'var(--space-lg)' }}>
        <label>Generated CSS</label>
        <div className="code-output">
          <code>{cssLine}</code>
          <CopyButton text={cssLine} />
        </div>
      </div>
    </div>
  );
}

/* ---------- Internal slider sub-component ---------- */

interface SliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (value: number) => void;
}

function SliderField({ label, value, min, max, unit, onChange }: SliderFieldProps) {
  return (
    <div className="field-group">
      <label>{label}</label>
      <div className="slider-row">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <span className="slider-value">
          {value}
          {unit}
        </span>
      </div>
    </div>
  );
}
