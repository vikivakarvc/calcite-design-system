import { storiesOf } from '@storybook/html';
import { withKnobs, text, number, boolean, color } from '@storybook/addon-knobs'
import { darkBackground } from "../../../.storybook/helpers";
import notes from './readme.md';

storiesOf('calcite-loader', module)
  .addDecorator(withKnobs)
  .add('Indeterminate', () => {
    return `
      <calcite-loader
        is-active="${boolean("is-active", true)}"
        text="${text("text", "")}"
      />
  `
  }, { notes })
  .add('Determinate', () => {
    return `
      <calcite-loader
        is-active
        type="determinate"
        value="${number('value', 0, {range: true, min: 0, max: 100, step: 1})}"
      />
  `
  }, { notes })
  .add('Inline', () => {
    return `
    <calcite-loader
      inline
      is-active
    /></calcite-loader>Next to some text
    `
  }, { notes })
  .add('Dark mode', () => {
    return `
      <calcite-loader is-active text="Loading" theme="dark" />
    `
  }, { notes, backgrounds: darkBackground })
  .add('Custom theme', () => {
    return `
    <calcite-loader
      style="
        --calcite-loader-spot-light: ${color('spot-light', '#50ba5f')};
        --calcite-loader-spot-dark: ${color('spot-dark', '#1a6324')};
        --calcite-loader-spot: ${color('loader-spot', '#338033')};"
      is-active
    />
    `
  }, { notes })
