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
import { UP, DOWN, TAB, HOME, END, ESCAPE } from "../../utils/keys";
import { filter } from "../../utils/filter";
import { debounce } from "lodash-es";

const COMBO_BOX_ITEM = "calcite-combobox-item";

interface ItemData {
  label: string;
  value: string;
}

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

  @Prop({ reflect: true }) active = false;

  @Prop({ reflect: true }) disabled = false;

  /** specify the scale of the combobox, defaults to m */
  @Prop({ mutable: true, reflect: true }) scale: "xs" | "s" | "m" | "l" | "xl" =
    "m";

  @Prop() placeholder?: string;

  // --------------------------------------------------------------------------
  //
  //  Private Properties
  //
  // --------------------------------------------------------------------------

  @Element() el: HTMLElement;

  @State() items: HTMLCalciteComboboxItemElement[] = [];

  @State() selectedItems: HTMLCalciteComboboxItemElement[] = [];

  @State() visibleItems: HTMLCalciteComboboxItemElement[] = [];

  textInput: HTMLInputElement = null;

  data: ItemData[];

  observer = new MutationObserver(this.updateItems);

  // --------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  // --------------------------------------------------------------------------

  connectedCallback() {
    // prop validations
    let scale = ["xs", "s", "m", "l", "xl"];
    if (!scale.includes(this.scale)) this.scale = "m";
  }

  componentWillLoad(): void {
    this.updateItems();
  }

  componentDidLoad(): void {
    this.observer.observe(this.el, { childList: true, subtree: true });
  }

  componentDidUnload(): void {
    this.observer.disconnect();
  }

  // --------------------------------------------------------------------------
  //
  //  Events
  //
  // --------------------------------------------------------------------------

  @Event() calciteLookupChange: EventEmitter;
  @Event() calciteComboboxChipDismiss: EventEmitter;

  @Listen("calciteComboboxItemChange") calciteComboboxItemChangeHandler(
    event: CustomEvent<HTMLCalciteComboboxItemElement>
  ) {
    this.toggleSelection(event.detail);
  }

  @Listen("calciteChipDismiss") calciteChipDismissHandler(
    event: CustomEvent<HTMLCalciteChipElement>
  ) {
    this.textInput.focus();

    const value = event.detail?.value;
    const comboboxItem = this.items.find(item => item.value === value);

    if (comboboxItem) {
      this.toggleSelection(comboboxItem, false);
    }
  }

  // --------------------------------------------------------------------------
  //
  //  Private Methods
  //
  // --------------------------------------------------------------------------

  inputHandler = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    this.filterItems(target.value);
  };

  handleInputKeyDown(event: KeyboardEvent) {
    if (event.target === this.textInput) {
      if (event.shiftKey && event.key === "TAB") {
        return;
      } else if (event.keyCode === ESCAPE) {
        this.active = false;
      } else if (event.keyCode === DOWN) {
        this.focusFirstItem();
      } else if (event.keyCode === UP) {
        this.focusLastItem();
      } else {
        this.active = true;
        this.textInput.focus();
      }
    } else return;
  }

  filterItems = debounce((value: string) => {
    const filteredData = filter(this.data, value);
    const values = filteredData.map(item => item.value);
    this.items.forEach(item => {
      item.hidden = values.indexOf(item.value) === -1;
      // If item is nested inside another item...
      const { parentItem } = item;
      if (parentItem) {
        // If the parent item is a match, show me.
        if (values.indexOf(parentItem.value) !== -1) {
          item.hidden = false;
        }
        // If I am a match, show my parent.
        if (values.indexOf(item.value) !== -1) {
          parentItem.hidden = false;
        }
      }
    });

    this.visibleItems = this.getVisibleItems();
  }, 100);

  toggleSelection(
    item: HTMLCalciteComboboxItemElement,
    value = !item.selected
  ): void {
    item.selected = value;
    this.selectedItems = this.getSelectedItems();
    this.calciteLookupChange.emit(this.selectedItems);
  }

  getVisibleItems(): HTMLCalciteComboboxItemElement[] {
    return this.items.filter(item => !item.hidden);
  }

  getSelectedItems(): HTMLCalciteComboboxItemElement[] {
    return this.items.filter(item => item.selected);
  }

  updateItems(): void {
    this.items = this.getItems();
    this.data = this.getData();
    this.selectedItems = this.getSelectedItems();
    this.visibleItems = this.getVisibleItems();
  }

  getData(): ItemData[] {
    return this.items.map(item => ({
      value: item.value,
      label: item.textLabel
    }));
  }

  getItems(): HTMLCalciteComboboxItemElement[] {
    const items = Array.from(this.el.querySelectorAll(COMBO_BOX_ITEM));

    return items.map(item => {
      const { parentElement } = item;

      item.parentItem = parentElement.matches(COMBO_BOX_ITEM)
        ? (parentElement as HTMLCalciteComboboxItemElement)
        : null;

      return item;
    });
  }

  @Listen("calciteComboboxItemKeyEvent") calciteComboboxItemKeyEventHandler(
    event: CustomEvent<HTMLCalciteComboboxItemElement>
  ) {
    let item = event.detail;
    let isFirstItem = this.itemIndex(item) === 0;
    let isLastItem = this.itemIndex(item) === this.items.length - 1;
    const shiftKey = (event as any).shiftKey;
    const keyCode = (event as any).keyCode;
    switch (keyCode) {
      case TAB:
        if (isFirstItem && shiftKey) this.closeCalciteCombobox();
        if (isLastItem && !shiftKey) this.closeCalciteCombobox();
        else if (isFirstItem && shiftKey) this.textInput.focus();
        else if (shiftKey) this.focusPrevItem(item);
        else this.focusNextItem(item);
        break;
      case DOWN:
        this.focusNextItem(item);
        break;
      case UP:
        this.focusPrevItem(item);
        break;
      case HOME:
        this.focusFirstItem();
        break;
      case END:
        this.focusLastItem();
        break;
      case ESCAPE:
        this.closeCalciteCombobox();
        break;
    }
  }

  closeCalciteCombobox() {
    this.textInput.focus();
    this.active = false;
  }

  focusFirstItem() {
    const firstItem = this.items[0];
    firstItem.focus();
  }

  focusLastItem() {
    const lastItem = this.items[this.items.length - 1];
    lastItem.focus();
  }
  focusNextItem(item: HTMLCalciteComboboxItemElement) {
    const index = this.itemIndex(item);
    const nextItem = this.items[index + 1] || this.items[0];
    nextItem.focus();
  }

  focusPrevItem(item: HTMLCalciteComboboxItemElement) {
    const index = this.itemIndex(item);
    const prevItem = this.items[index - 1] || this.items[this.items.length - 1];
    prevItem.focus();
  }

  itemIndex(item: HTMLCalciteComboboxItemElement) {
    return this.items.indexOf(item);
  }

  comboboxFocusHandler = event => {
    this.active = event.type === "focusin";
  };

  //--------------------------------------------------------------------------
  //
  //  Render Methods
  //
  //--------------------------------------------------------------------------

  render() {
    const listBoxId = "listbox";
    return (
      <Host
        active={this.active}
        onFocusin={this.comboboxFocusHandler}
        onFocusout={this.comboboxFocusHandler}
      >
        <div class="selections">
          {this.selectedItems.map(item => {
            return (
              <calcite-chip
                key={item.value}
                active
                scale={this.scale}
                value={item.value}
              >
                {item.textLabel}
              </calcite-chip>
            );
          })}
        </div>
        <div
          role="combobox"
          aria-expanded={this.active.toString()}
          aria-owns={listBoxId}
          aria-haspopup="listbox"
        >
          <input
            type="text"
            placeholder={this.placeholder}
            aria-autocomplete="list"
            aria-controls={listBoxId}
            onInput={this.inputHandler}
            disabled={this.disabled}
            onKeyDown={e => this.handleInputKeyDown(e)}
            ref={el => (this.textInput = el as HTMLInputElement)}
          />
        </div>
        <ul
          id={listBoxId}
          role="listbox"
          class={{ list: true }}
          aria-multiselectable="true"
        >
          <slot />
        </ul>
      </Host>
    );
  }
}
