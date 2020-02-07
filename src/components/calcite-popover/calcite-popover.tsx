import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Method,
  Prop,
  State,
  Watch,
  h
} from "@stencil/core";
import { CSS } from "./resources";
import { CalcitePlacement, getPlacement } from "../../utils/popper";
import {
  createPopper,
  Instance as Popper,
  Modifier,
  Placement
} from "@popperjs/core";
import { VNode } from "@stencil/state-tunnel/dist/types/stencil.core";
import { x16 } from "@esri/calcite-ui-icons";
import CalciteIcon from "../../utils/CalciteIcon";
import { guid } from "../../utils/guid";

/**
 * @slot image - A slot for adding an image. The image will appear above the other slot content.
 */

@Component({
  tag: "calcite-popover",
  styleUrl: "calcite-popover.scss",
  shadow: true
})
export class CalcitePopover {
  // --------------------------------------------------------------------------
  //
  //  Properties
  //
  // --------------------------------------------------------------------------

  /**
   * Adds a click handler to the referenceElement to toggle open the Popover.
   */
  @Prop({ reflect: true }) addClickHandle = false;

  @Watch("addClickHandle")
  interactionElementHandler() {
    this.removeReferenceListener();
    this.addReferenceListener();
  }

  /**
   * Display a close button within the Popover.
   */
  @Prop({ reflect: true }) closeButton = false;

  /**
   * Prevents flipping the popover's placement when it starts to overlap its reference element.
   */
  @Prop({ reflect: true }) disableFlip = false;

  /**
   * Removes the caret pointer.
   */
  @Prop({ reflect: true }) disablePointer = false;

  /**
   * Defines the available placements that can be used when a flip occurs.
   */
  @Prop() flipPlacements?: Placement[];

  /**
   * Display and position the component.
   */
  @Prop({ reflect: true }) open = false;

  @Watch("open")
  openHandler(open: boolean) {
    if (open) {
      this.createPopper();
      this.calcitePopoverOpen.emit();
    } else {
      this.destroyPopper();
      this.calcitePopoverClose.emit();
    }
  }

  /**
   * Determines where the component will be positioned relative to the referenceElement.
   */
  @Prop({ reflect: true }) placement: CalcitePlacement = "auto";

  @Watch("placement")
  placementHandler() {
    this.reposition();
  }

  /**
   * Reference HTMLElement used to position this component according to the placement property.
   */
  @Prop() referenceElement!: HTMLElement | string;

  @Watch("referenceElement")
  referenceElementHandler() {
    this.removeReferenceListener();
    this._referenceElement = this.getReferenceElement();
    this.addReferenceListener();
    this.addReferenceAria();
    this.createPopper();
  }

  /** Text for close button. */
  @Prop() textClose = "Close";

  /** Select theme (light or dark) */
  @Prop({ reflect: true }) theme: "light" | "dark" = "light";

  /**
   * Offset the position of the popover in the horizontal direction.
   */
  @Prop({ reflect: true }) xOffset = 0;

  @Watch("xOffset")
  xOffsetHandler() {
    this.reposition();
  }

  /**
   * Offset the position of the popover in the vertical direction.
   */
  @Prop({ reflect: true }) yOffset = 0;

  @Watch("yOffset")
  yOffsetHandler() {
    this.reposition();
  }

  // --------------------------------------------------------------------------
  //
  //  Private Properties
  //
  // --------------------------------------------------------------------------

  @Element() el: HTMLCalcitePopoverElement;

  @State() _referenceElement: HTMLElement = this.getReferenceElement();

  popper: Popper;

  arrowEl: HTMLDivElement;

  // --------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  // --------------------------------------------------------------------------

  componentDidLoad() {
    this.createPopper();
    this.addReferenceListener();
    this.addReferenceAria();
  }

  componentDidUnload() {
    this.removeReferenceListener();
    this.destroyPopper();
  }

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------
  /** Fired when the popover is closed */
  @Event() calcitePopoverClose: EventEmitter;
  /** Fired when the popover is opened */
  @Event() calcitePopoverOpen: EventEmitter;

  // --------------------------------------------------------------------------
  //
  //  Public Methods
  //
  // --------------------------------------------------------------------------

  @Method() async reposition(): Promise<void> {
    const { popper } = this;

    popper ? this.updatePopper(popper) : this.createPopper();
  }

  @Method() async toggle(): Promise<void> {
    this.open = !this.open;
  }

  // --------------------------------------------------------------------------
  //
  //  Private Methods
  //
  // --------------------------------------------------------------------------

  getId = (): string => {
    return this.el.id || `calcite-popover-${guid()}`;
  };

  addReferenceAria = (): void => {
    const { _referenceElement } = this;

    if (
      _referenceElement &&
      !_referenceElement.hasAttribute("aria-describedby")
    ) {
      _referenceElement.setAttribute("aria-describedby", this.getId());
    }
  };

  clickHandler = (): void => {
    this.toggle();
  };

  addReferenceListener = (): void => {
    const { _referenceElement, addClickHandle } = this;

    if (!_referenceElement || !addClickHandle) {
      return;
    }

    _referenceElement.addEventListener("click", this.clickHandler);
  };

  removeReferenceListener = (): void => {
    const { _referenceElement } = this;

    if (!_referenceElement) {
      return;
    }

    _referenceElement.removeEventListener("click", this.clickHandler);
  };

  getReferenceElement(): HTMLElement {
    const { referenceElement } = this;

    return (
      (typeof referenceElement === "string"
        ? document.getElementById(referenceElement)
        : referenceElement) || null
    );
  }

  getModifiers(): Partial<Modifier<any>>[] {
    const verticalRE = /top|bottom/gi;
    const autoRE = /auto/gi;
    const {
      arrowEl,
      flipPlacements,
      disableFlip,
      disablePointer,
      placement,
      xOffset,
      yOffset
    } = this;
    const offsetEnabled = !!(yOffset || xOffset) && !autoRE.test(placement);
    const offsets = [yOffset, xOffset];

    if (verticalRE.test(placement)) {
      offsets.reverse();
    }

    return [
      {
        name: "arrow",
        enabled: !disablePointer,
        options: {
          element: arrowEl // todo
        }
      },
      {
        name: "flip",
        enabled: !disableFlip,
        options: {
          fallbackPlacements: flipPlacements // todo
        }
      },
      {
        name: "offset",
        enabled: !!offsetEnabled,
        options: {
          offset: offsets
        }
      }
    ];
  }

  updatePopper(popper: Popper): void {
    const { el, placement } = this;

    const options = {
      placement: getPlacement(el, placement),
      modifiers: this.getModifiers()
    };

    popper.setOptions(options);
  }

  createPopper(): void {
    this.destroyPopper();
    const { el, open, placement, _referenceElement } = this;

    if (!_referenceElement || !open) {
      return;
    }

    const newPopper = createPopper(_referenceElement, el, {
      placement: getPlacement(el, placement),
      modifiers: this.getModifiers()
    });

    this.popper = newPopper;
  }

  destroyPopper(): void {
    const { popper } = this;

    if (popper) {
      popper.destroy();
    }

    this.popper = null;
  }

  hide = (): void => {
    this.open = false;
  };

  // --------------------------------------------------------------------------
  //
  //  Render Methods
  //
  // --------------------------------------------------------------------------

  renderImage(): VNode {
    return this.el.querySelector("[slot=image]") ? (
      <div class={CSS.imageContainer}>
        <slot name="image" />
      </div>
    ) : null;
  }

  renderCloseButton(): VNode {
    const { closeButton, textClose } = this;

    return closeButton ? (
      <button
        aria-label={textClose}
        title={textClose}
        class={{ [CSS.closeButton]: true }}
        onClick={this.hide}
      >
        <CalciteIcon size="16" path={x16} />
      </button>
    ) : null;
  }

  render() {
    const { _referenceElement, open, disablePointer } = this;
    const displayed = _referenceElement && open;
    const arrowNode = !disablePointer ? (
      <div class={CSS.arrow} ref={arrowEl => (this.arrowEl = arrowEl)}></div>
    ) : null;

    return (
      <Host
        role="dialog"
        aria-hidden={!displayed ? "true" : "false"}
        id={this.getId()}
      >
        {arrowNode}
        <div
          class={{
            [CSS.container]: true,
            [CSS.containerOpen]: displayed
          }}
        >
          <div class={CSS.contentContainer}>
            {this.renderImage()}
            <div class={CSS.content}>
              <slot />
              {this.renderCloseButton()}
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
