import {
  Component,
  Element,
  Prop,
  Host,
  Event,
  EventEmitter,
  h,
  Watch
} from "@stencil/core";
import { ENTER, SPACE } from "../../../../utils/keys";

@Component({
  tag: "calcite-date-month-header",
  styleUrl: "calcite-date-month-header.scss",
  shadow: true
})
export class CalciteDateMonth {
  //--------------------------------------------------------------------------
  //
  //  Element
  //
  //--------------------------------------------------------------------------

  @Element() el: HTMLElement;

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  /**
   * Be sure to add a jsdoc comment describing your propery for the generated readme file.
   * If your property should be hidden from documentation, you can use the `@internal` tag
   */
  @Prop() month: number = 0;

  @Prop() year: number = 0;

  @Prop() selectedDate: Date;

  @Prop() min: Date;

  @Prop() max: Date;

  @Prop() locale: string = "en-US";

  @Prop() prevMonthLabel: string = "";

  @Prop() nextMonthLabel: string = "";

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  componentWillUpdate(): void {}
  
  render() {
    let localizedMonth = this.getLocalizedMonths()[this.month];

    return (
      <Host>
        <div class="month-year" aria-hidden="true">
          <span
            role="button"
            aria-label={this.prevMonthLabel}
            tabindex={0}
            onClick={() => this.selectPrevMonth()}
            onKeyDown={event => this.selectPrevMonthOnEnter(event)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="left-icon"
              viewBox="0 0 16 16"
              height="16"
              width="16"
            >
              <path d="M11.783 14H9.017l-6-6 6-6h2.766l-6 6z" />
            </svg>
          </span>
          <div>
            <span class="month" role="heading">
              {localizedMonth}
            </span>
            <input
              role="input"
              tabindex={0}
              class="year"
              type="number"
              value={this.year}
              min = {this.min && this.min.getFullYear()}
              max = {this.max && this.max.getFullYear()}
              style={{ width: `${(`${this.year}`.length + 1) * 12}px` }}
              onChange={event => this.onYearChange(event)}
            />
          </div>
          <span
            role="button"
            aria-label={this.nextMonthLabel}
            tabindex={0}
            onClick={() => this.selectNextMonth()}
            onKeyDown={event => this.selectNextMonthOnEnter(event)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="right-icon"
              viewBox="0 0 16 16"
              height="16"
              width="16"
            >
              <path d="M10.217 8l-6-6h2.766l6 6-6 6H4.217z" />
            </svg>
          </span>
        </div>
      </Host>
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------
  @Event() calciteMonthChange: EventEmitter;

  @Event() calciteYearChange: EventEmitter;

  @Watch("month") monthChange() {
    this.calciteMonthChange.emit();
  }

  @Watch("year") yearChange() {
    this.calciteYearChange.emit();
  }

  private selectPrevMonth() {
    if (this.month === 0) {
      this.year = this.year - 1;
    }
    if(this.validateMonth((12 + this.month - 1) % 12, this.year)){
      this.month = (12 + this.month - 1) % 12;
    }
  }

  private selectPrevMonthOnEnter(event: KeyboardEvent) {
    if (event.keyCode === ENTER || event.keyCode === SPACE) {
      this.selectPrevMonth();
    }
  }

  private selectNextMonth() {
    if (this.month === 11) {
      if(this.validateYear(this.year + 1)){
        this.year += 1;
        return;
      }
    }
    if(this.validateMonth((this.month + 1) % 12, this.year)) {
      this.month = (this.month + 1) % 12;
    } 
  }

  private selectNextMonthOnEnter(event: KeyboardEvent) {
    if (event.keyCode === ENTER || event.keyCode === SPACE) {
      this.selectNextMonth();
    }
  }

  private validateYear(year){
    let isValid = true;
    if(this.min){
      isValid = isValid && (year > this.min.getFullYear())
    }
    if(this.max){
      isValid = isValid && (year < this.max.getFullYear())
    }

    return isValid;
  }

  private validateMonth(month, year){
    let isValid = true;
    if(this.min){
      isValid = isValid && (this.validateYear(year) ? true : year === this.min.getFullYear() && (month >= this.min.getMonth()))
    }
    if(this.max){
      isValid = isValid && (this.validateYear(year) ? true : year === this.max.getFullYear() && (month <= this.max.getMonth()))
    }

    return isValid;
  }

  private onYearChange(event) {
    this.year = parseInt(event.target.value);
  }

  private getLocalizedMonths() {
    let m = 0,
      months = [],
      date = new Date();
    for (; m < 12; m++) {
      date.setMonth(m);
      months.push(
        new Intl.DateTimeFormat(this.locale, {
          month: "long"
        }).format(date)
      );
    }

    return months;
  }
}
