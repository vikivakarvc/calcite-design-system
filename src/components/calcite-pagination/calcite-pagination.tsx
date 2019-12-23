import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  // Listen,
  Prop,
  Method,
  State,
  Watch
} from "@stencil/core";
import { getElementDir } from "../../utils/dom";
import { CSS, TEXT } from "./resources";
import { chevronLeft16, chevronRight16, ellipsis16 } from "@esri/calcite-ui-icons";
import CalciteIcon from "../../utils/CalciteIcon";

const maxPagesDisplayed = 5;

@Component({
  tag: "calcite-pagination",
  styleUrl: "calcite-pagination.scss",
  shadow: true
})
export class CalcitePagination {
  //--------------------------------------------------------------------------
  //
  //  Public Properties
  //
  //--------------------------------------------------------------------------

  /** starting number of the pagination */
  @Prop({ reflect: true }) start = 1;

  /** ending number of the pagination */
  @Prop({ reflect: true }) total = 2;

  /** specify the theme of accordion, defaults to light */
  @Prop({ reflect: true }) theme: "light" | "dark" = "light";

  /** starting selected index */
  @Prop({ reflect: true }) num = 1;
  @Watch("num") numWatchHandler(newValue) {
    this.selectedIndex = newValue;
  }


  @Prop({ reflect: true }) textLabelNext:string = TEXT.nextLabel;

  @Prop({ reflect: true }) textLabelPrevious:string = TEXT.previousLabel;

  // --------------------------------------------------------------------------
  //
  //  Private Properties
  //
  // --------------------------------------------------------------------------

  @Element() el: HTMLElement;

  @State() selectedIndex = this.num;
  @Watch('selectedIndex') selectedIndexWatchHandler() {
    this.calcitePaginationUpdate.emit({
      start: this.start,
      total: this.total,
      num: this.selectedIndex
    });
  }

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------

  @Event() calcitePaginationUpdate: EventEmitter;

  // --------------------------------------------------------------------------
  //
  //  Public Methods
  //
  // --------------------------------------------------------------------------

  @Method()
  async nextPage(): Promise<void> {
    this.selectedIndex = Math.min(this.total, this.selectedIndex + 1);
  }

  @Method()
  async previousPage(): Promise<void> {
    this.selectedIndex = Math.max(1, this.selectedIndex - 1);
  }

  // --------------------------------------------------------------------------
  //
  //  Private Methods
  //
  // --------------------------------------------------------------------------

  previousClicked = (): void => {
    this.previousPage();
  };

  nextClicked = (): void => {
    this.nextPage();
  };

  showLeftEllipsis() {
    return (this.selectedIndex - this.start) > 3;
  }

  showRightEllipsis() {
    return (this.total - this.selectedIndex) > 2;
  }

  //--------------------------------------------------------------------------
  //
  //  Render Methods
  //
  //--------------------------------------------------------------------------

  renderPages() {
    let pages = [];
    let currentNum;
    let end;

    if ( this.total <= maxPagesDisplayed ) {
      currentNum = this.start + 1;
      end = this.total -1;
    } else {
      if ( this.selectedIndex < maxPagesDisplayed ) {
        currentNum = this.start + 1;
        end = this.start + 4;
      } else {
        if ( this.selectedIndex + 3 >= this.total ) {
          currentNum = this.total - 4;
          end = this.total -1;
        } else {
          currentNum = this.selectedIndex - 1;
          end = this.selectedIndex + 1;
        }
      }
    }

    while (currentNum <= end) {
      pages.push(currentNum);
      currentNum ++;
    }

    return pages.map(page => {
      return this.renderPage(page);
    });
  }

  renderPage(num) {
    return (
      <a class={{[CSS.page]:true, [CSS.selected]: (num === this.selectedIndex) }} onClick={() => {
        this.selectedIndex = num;
      }}>{num}</a>
    );
  }

  renderLeftEllipsis() {
    if ( this.total > maxPagesDisplayed && this.showLeftEllipsis() ) {
      return (
        <span class={CSS.ellipsis}>
          <CalciteIcon size="16" path={ellipsis16} />
        </span>
      );
    }
  }

  renderRightEllipsis() {
    if ( this.total > maxPagesDisplayed && ( this.total - this.selectedIndex > 3 ) ) {
      return (
        <span class={CSS.ellipsis}>
          <CalciteIcon size="16" path={ellipsis16} />
        </span>
      );
    }
  }

  render() {
    const dir = getElementDir(this.el);

    return (
      <Host dir={dir}>
        <a class={{[CSS.previous]: true, [CSS.disabled]: this.selectedIndex <= 1}} title={this.textLabelPrevious} onClick={this.previousClicked}>
          <CalciteIcon size="16" path={chevronLeft16} />
        </a>
        {this.renderPage(this.start)}
        {this.renderLeftEllipsis()}
        {this.renderPages()}
        {this.renderRightEllipsis()}
        {this.renderPage(this.total)}
        <a class={{[CSS.next]: true, [CSS.disabled]: this.selectedIndex >= this.total}} title={this.textLabelNext} onClick={this.nextClicked}>
          <CalciteIcon size="16" path={chevronRight16} />
        </a>
      </Host>
    );
  }
}
