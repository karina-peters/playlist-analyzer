import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { TrackService } from "src/app/services/track.service";
import { UniqueIdService } from "src/app/services/unique-id.service";

export interface SelectorConfig {
  type: DataType;
  allowSearch: boolean;
  searchFirst?: boolean;
  placeholder?: string;
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
  @Input() options$: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);
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
  public clearing: boolean = false;

  public selectedIndex: number = -1;
  public selected$: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  @Output() selectedEvent = new EventEmitter<any>();

  constructor(private idService: UniqueIdService, private trackService: TrackService) {}

  ngOnInit(): void {
    this.selectorId = this.idService.getUniqueId("selector-");
    this.filteredOptions = this.options;

    if (!this.config.placeholder) {
      if (this.config.type == DataType.Playlist) {
        this.config.placeholder = "Select a Playlist";
      } else if (this.config.type == DataType.Track) {
        this.config.placeholder = "Select a Track";
      } else {
        this.config.placeholder = "Select";
      }
    }

    this.options$.subscribe((opts) => {
      // If we're getting search results from the API, replace, else append
      if (this.config.searchFirst) {
        this.options = opts;
      } else {
        this.options.push(...opts);
      }

      this.filteredOptions = this.options.filter((opt) => this.match(this.searchModel, opt.name));
    });

    this.selected$.subscribe((i) => this.setSelected(i));
  }

  public onSelectFocusout(_$event: FocusEvent): void {
    this.selected$.subscribe((selected) => {
      if (selected != -1 && !this.clearing) {
        // Ensure search text matches current selection
        let currentSelected = this.options[selected];
        this.searchModel = currentSelected?.name;
      } else {
        // If an option hasn't been selected, clear search and reset options
        this.searchModel = "";
        this.clearing = false;
        this.resetOptions();
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

      if (this.config.searchFirst) {
        // Re-populate options with search results from the API
        if (this.searchModel.length == 0) return;
        this.apiSearch();
      } else {
        this.toggleShowOptions(true);
      }
    }
  }

  public onInputBlur(_$event: FocusEvent): void {
    if (this.config.allowSearch) {
      this.searching = false;

      if (this.config.searchFirst) {
        // Clear API search results on blur
        this.options = [];
      }

      this.removeHightlight();
    }
  }

  public onInputClick(_$event: FocusEvent): void {
    if (this.config.allowSearch && !this.config.searchFirst) {
      this.toggleShowOptions(true);
    }
  }

  public onInput($event: KeyboardEvent): void {
    if ($event.key == "ArrowDown" || $event.key == "ArrowUp" || $event.key == "PageDown" || $event.key == "PageUp") {
      // Set hightlight to next option
      this.hightlightNextOption($event.key);
    } else if ($event.key == "Enter") {
      // Select current option if available, clear search and hide options otherwise
      let index = this.getSelectedId();
      if (index != -1) {
        this.options[index] && this.selectOption(this.options[index].index);
      } else {
        this.selectOption(index);
      }

      // Remove focus from input
      if ($event.target instanceof HTMLElement) {
        $event.target.blur();
      }
    } else if (this.isAcceptedKey($event.key)) {
      if (this.config.searchFirst) {
        if (this.searchModel == "") {
          // Hide options when the user clears the search
          this.toggleShowOptions(false);
          return;
        }

        // Populate options with search results from the API
        this.apiSearch();
      } else {
        // Filter options list
        this.showOptions = true;
        this.filteredOptions = this.options.filter((opt) => this.match(this.searchModel, opt.name));

        this.adjustSelectorHeight();
      }
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

  public clearSearch() {
    this.clearing = true;
    this.searchModel = "";
    let search: HTMLElement = <HTMLElement>document.querySelectorAll(`#${this.selectorId} input`)[0];

    // Call setTimeout to trigger onFocus event
    setTimeout(() => {
      search.focus();
    });
  }

  private apiSearch() {
    let type = this.config.type == DataType.Track ? "track" : "";
    this.trackService.searchTracks(this.searchModel, type).subscribe((results) => {
      this.options$.next(results);
      this.selectedIndex = -1; // Reset selected index on new search

      this.toggleShowOptions(true);
    });
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
    return optionName.toLowerCase().includes(substr.toLowerCase());
  }

  private getSelectedId(): number {
    let highlightedOption: HTMLElement = <HTMLElement>document.querySelectorAll(`#${this.selectorId} .option.highlighted`)[0];
    return highlightedOption?.id ? parseInt(highlightedOption.id) : -1;
  }

  private getHighlightedIndex(): number {
    let highlightedOption: HTMLElement = <HTMLElement>document.querySelectorAll(`#${this.selectorId} .option.highlighted`)[0];
    return this.filteredOptions.findIndex((opt) => opt.index == parseInt(highlightedOption?.id));
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
    } else if (key == "PageDown") {
      nextIndex = (currentIndex + 5) % numOptions;
    } else if (key == "PageUp") {
      nextIndex = currentIndex - 5 < 0 ? lastIndex : currentIndex - 5;
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
      height = 75 + 50 * numOptions;
    } else {
      height = 50;
    }

    if (height > 325) {
      height = 325;
    }

    let customSelect: HTMLElement = <HTMLElement>document.querySelectorAll(`#${this.selectorId}.custom-select .show-options-wrapper`)[0];
    if (customSelect) {
      customSelect.style.height = `${height}px`;
    }
  }

  ngOnDestroy() {
    this.options$.unsubscribe();
    this.selected$.unsubscribe();
  }
}
