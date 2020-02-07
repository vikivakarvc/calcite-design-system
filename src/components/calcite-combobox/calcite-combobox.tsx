import {
  Component,
  h,
  Host,
  Prop,
  State,
  Listen,
  Event,
  EventEmitter,
  Element
} from "@stencil/core";

import 'focus-within-polyfill';
import { filter } from "../../utils/filter";

@Component({
  tag: "calcite-combobox",
  styleUrl: "calcite-combobox.scss",
  shadow: true
})
export class CalciteCombobox {
  //--------------------------------------------------------------------------
  //
  //  Public Properties
  //
  //--------------------------------------------------------------------------

  @Prop() disabled = false;

  // --------------------------------------------------------------------------
  //
  //  Private Properties
  //
  // --------------------------------------------------------------------------

  @Element() el: HTMLElement;

  @State() selectedItems = [];

  textInput: HTMLInputElement = null;

  data: Array<object> = null;

  items: Array<HTMLCalciteComboboxItemElement> = null;

  // --------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  // --------------------------------------------------------------------------

  componentDidLoad() {
    this.items = Array.from(this.el.querySelectorAll("calcite-combobox-item"));
    this.data = this.getItemData();
  }

  // --------------------------------------------------------------------------
  //
  //  Events
  //
  // --------------------------------------------------------------------------

  @Event() calciteLookupChange: EventEmitter;

  @Listen("calciteItemChange") calciteItemChangeHandler(event: CustomEvent) {
    this.toggleSelection(event.detail);
  }

  @Listen("calciteChipDismiss") calciteChipDismissHandler(event: CustomEvent) {
    const value = event.detail.value;
    this.textInput.focus();
    this.deselectItem(value);
    this.toggleSelection({value, selected: false});
  }

  // --------------------------------------------------------------------------
  //
  //  Private Methods
  //
  // --------------------------------------------------------------------------

  inputHandler = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    const filteredData = filter(this.data, target.value);
    const values = filteredData.map((item) => item.value);
    this.items.forEach((item) => {
      const hasParent = item.parentElement.matches("calcite-combobox-item");

      item.hidden = values.indexOf(item.value) === -1;

      // If item is nested inside another item...
      if (hasParent) {
        const parent = item.parentElement as HTMLCalciteComboboxItemElement;
        // If there is a parent item
        if (parent !== null) {
          // If the parent item is a match, show me.
          if (values.indexOf(parent.value) !== -1) {
            item.hidden = false;
          }
          // If I am a match, show my parent.
          if (values.indexOf(item.value) !== -1) {
            parent.hidden = false;
          }
        }
      }
    });
  }

  toggleSelection(item): void {
    if (!item.selected) {
      this.selectedItems = this.selectedItems.filter( currentValue => {
        return currentValue !== item.value;
      });
    } else {
      this.selectedItems = [...this.selectedItems, item.value];
    }
    this.textInput.value = '';
    this.calciteLookupChange.emit(this.selectedItems);
  }

  deselectItem(value): void {
    const comboboxItem = this.el.querySelector(`calcite-combobox-item[value=${value}]`) as HTMLCalciteComboboxItemElement;
    comboboxItem.toggleSelected(false);
  }

  getItemData() {
    const result = [];
    this.items.forEach( item => {
      result.push({
        label: item.textLabel,
        value: item.value
      });
    });
    return result;
  }

  //--------------------------------------------------------------------------
  //
  //  Render Methods
  //
  //--------------------------------------------------------------------------

  render() {
    const listBoxId = 'listbox';
    return (
      <Host>
        <div role="combobox" aria-expanded="false" aria-owns={listBoxId} aria-haspopup="listbox">
          <span class="selections">
            {
              this.selectedItems.map( (item) => {
                return <calcite-chip value={item}>{item}</calcite-chip>
              })
            }
          </span>
          <input type="text" aria-autocomplete="list" aria-controls={listBoxId}
            onInput={this.inputHandler}
            disabled={this.disabled}
            ref={(el) => this.textInput = el as HTMLInputElement} />
        </div>
        <ul id={listBoxId} role="listbox" class={{"list": true}} tabindex="0" aria-multiselectable="true">
          <slot />
        </ul>
      </Host>
    );
  }
}
