import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { UniqueIdService } from "src/app/services/unique-id.service";

export interface SelectorConfig {
  type: DataType;
  placeholder: string;
  allowSearch: boolean;
}

export enum DataType {
  Playlist,
  Track,
  Artist,
  Album,
  Other,
}

@Component({
  selector: "app-selector",
  templateUrl: "./selector.component.html",
  styleUrls: ["./selector.component.scss"],
})
export class SelectorComponent implements OnInit, OnDestroy {
  @Input() options$: Subject<Array<any>> = new Subject<Array<any>>();
  @Input() config: SelectorConfig = {
    type: DataType.Other,
    placeholder: "Select",
    allowSearch: false,
  };

  public selectorId: string = "";
  public options: Array<any> = [];
  public filteredOptions: Array<any> = [];

  public searchModel: string = "";
  public searching: boolean = false;
  public showOptions: boolean = false;

  public selectedIndex: number = -1;
  public selected$: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  @Output() selectedEvent = new EventEmitter<any>();

  constructor(private idService: UniqueIdService) {}

  ngOnInit(): void {
    this.selectorId = this.idService.getUniqueId("selector-");
    this.filteredOptions = this.options;

    this.options$.subscribe((opts) => {
      this.options.push(...opts);
      this.filteredOptions = this.options.filter((opt) => this.match(this.searchModel, opt.name));
    });

    this.selected$.subscribe((i) => this.setSelected(i));
  }

  public onSelectFocusout(_$event: FocusEvent): void {
    this.selected$.subscribe((selected) => {
      if (selected != -1) {
        // Ensure search text matches current selection
        let currentSelected = this.options[selected];
        this.searchModel = currentSelected.name;
      } else {
        this.clearSearch();
      }
    });

    this.toggleShowOptions(false);
  }

  public selectOption(index: number): void {
    this.selected$.next(index);
  }

  public onInputFocus(_$event: FocusEvent): void {
    if (this.config.allowSearch) {
      this.searching = true;
    }
  }

  public onInputBlur(_$event: FocusEvent): void {
    if (this.config.allowSearch) {
      this.searching = false;
      this.removeHightlight();
    }
  }

  public onInputClick(_$event: FocusEvent): void {
    if (this.config.allowSearch && this.searchModel != "") {
      this.clearSearch();
    }
  }

  public onInput($event: KeyboardEvent): void {
    if ($event.key == "ArrowDown" || $event.key == "ArrowUp") {
      // Set hightlight to next option
      this.hightlightNextOption($event.key);
    } else if ($event.key == "Enter") {
      // Select current option if available, clear search and hide options otherwise
      let index = this.getHighlightedIndex();
      if (index != -1) {
        this.filteredOptions[index] && this.selectOption(this.filteredOptions[index].index);
      } else {
        this.selectOption(index);
      }

      // Remove focus from input
      if ($event.target instanceof HTMLElement) {
        $event.target.blur();
      }
    } else if (this.isAcceptedKey($event.key)) {
      // Filter options list
      this.showOptions = true;
      this.filteredOptions = this.options.filter((opt) => this.match(this.searchModel, opt.name));

      this.adjustSelectorHeight();
    }
  }

  public toggleShowOptions(override?: boolean) {
    if (override != undefined) {
      this.showOptions = override;
    } else {
      this.showOptions = !this.showOptions;
    }

    this.adjustSelectorHeight();
  }

  private setSelected(index: number) {
    if (index != -1) {
      this.selectedEvent.emit(this.options[index]);
      this.searchModel = this.options[index].name;
      this.selectedIndex = index;

      this.resetOptions();
    }

    this.toggleShowOptions(false);
  }

  private resetOptions(): void {
    this.filteredOptions = this.options;
  }

  private isAcceptedKey(key: string) {
    // TODO
    return true;
  }

  private match(substr: string, optionName: string): boolean {
    // TODO: disregard non-alphanumeric characters
    return optionName.toLowerCase().includes(substr.toLowerCase());
  }

  private clearSearch() {
    this.searchModel = "";
    this.resetOptions();
  }

  private getHighlightedIndex(): number {
    let highlightedOption: HTMLElement = <HTMLElement>document.querySelectorAll(`#${this.selectorId} .option.highlighted`)[0];
    return highlightedOption?.id ? parseInt(highlightedOption.id) : -1;
  }

  private removeHightlight() {
    let highlightedOption: HTMLElement = <HTMLElement>document.querySelectorAll(`#${this.selectorId} .option.highlighted`)[0];
    highlightedOption && highlightedOption.classList.remove("highlighted");
  }

  private setHightlight(index: number) {
    this.removeHightlight();

    let option: HTMLElement = <HTMLElement>document.querySelectorAll(`#${this.selectorId} .option`)[index];
    option && option.classList.add("highlighted");
  }

  private hightlightNextOption(key: string): void {
    let numOptions = this.filteredOptions.length;
    let currentIndex = this.getHighlightedIndex();
    let lastIndex = numOptions - 1;
    let nextIndex = -1;

    if (key == "ArrowDown") {
      nextIndex = (currentIndex + 1) % numOptions;
    } else if (key == "ArrowUp") {
      nextIndex = currentIndex - 1 == -1 ? lastIndex : currentIndex - 1;
    } else {
      // TODO: handle page up/down
    }

    this.setHightlight(nextIndex);

    // Adjust scroll position if needed
    let currentOption = document.querySelectorAll(`#${this.selectorId} .option.highlighted`)[0];
    currentOption && currentOption.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  private adjustSelectorHeight() {
    let height = 0;
    let numOptions = 0;

    if (this.showOptions) {
      numOptions = this.filteredOptions.length == 0 ? 1 : this.filteredOptions.length;
    }

    height = 50 + 50 * numOptions;
    if (height > 315) {
      height = 315;
    }

    let customSelect: HTMLElement = <HTMLElement>document.querySelectorAll(`#${this.selectorId}.custom-select`)[0];
    if (customSelect) {
      customSelect.style.height = `${height}px`;
    }
  }

  ngOnDestroy() {
    this.options$.unsubscribe();
    this.selected$.unsubscribe();
  }
}
