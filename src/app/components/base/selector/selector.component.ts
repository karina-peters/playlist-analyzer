import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { UniqueIdService } from "src/app/services/unique-id.service";

export interface SelectorConfig {
  type: DataType;
  allowSearch: boolean;
  externalSearch?: boolean;
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
  @ViewChild("input") input!: ElementRef;

  @Input() loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  @Input() options$: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);
  @Input() config: SelectorConfig = {
    type: DataType.Other,
    allowSearch: false,
  };

  public selectorId: string = "";
  public options: Array<any> = [];
  public filteredOptions: Array<any> = [];

  public searchModel: string = "";
  public searching: boolean = false;
  public showOptions: boolean = false;
  public clearing: boolean = false;
  public loading: boolean = false;

  public highlightedIndex: number = -1;
  public selectedIndex: number = -1;
  public selected$: BehaviorSubject<number> = new BehaviorSubject<number>(-1);

  @Output() selectedEvent = new EventEmitter<any>();
  @Output() searchEvent = new EventEmitter<string>();

  constructor(private idService: UniqueIdService) {}

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

    this.loading$.subscribe((loading) => {
      this.loading = loading;
    });

    this.options$.subscribe((opts) => {
      // If getting search results from an external search, replace, else append
      if (this.config.externalSearch) {
        this.options = opts;
        this.selectedIndex = -1;
        this.toggleShowOptions(true);
      } else {
        this.options.push(...opts);
      }

      this.filteredOptions = this.options.filter((opt) => this.match(this.searchModel, opt.name));
    });

    this.selected$.subscribe((i) => this.setSelected(i));
  }

  public onSelectFocusout(_$event: FocusEvent): void {
    if (this.clearing) {
      this.clearing = false;
      return;
    }

    let selectedText = this.selectedIndex != -1 ? this.options[this.selectedIndex]?.name : "";
    if ((selectedText || this.selectedIndex == -1) && selectedText != this.searchModel) {
      // If search text doesn't match the current selection, reset it
      this.searchModel = selectedText;
      this.resetOptions();
    }

    this.toggleShowOptions(false);
  }

  public selectOption(index: number): void {
    this.selected$.next(index);
  }

  public onInputFocus(_$event: FocusEvent): void {
    if (this.config.allowSearch) {
      this.searching = true;
      this.highlightedIndex = 0;

      if (this.config.externalSearch) {
        // Re-populate options with external search results
        if (this.searchModel.length != 0) {
          this.externalSearch();
        }
      } else {
        this.toggleShowOptions(true);
      }
    }
  }

  public onInputBlur(_$event: FocusEvent): void {
    if (this.config.allowSearch) {
      this.searching = false;
      this.highlightedIndex = -1;

      if (this.config.externalSearch) {
        // Clear external search results on blur
        this.resetOptions();
      }
    }
  }

  public onInputKeyDown($event: KeyboardEvent): void {
    if ($event.key == "ArrowDown" || $event.key == "ArrowUp" || $event.key == "PageDown" || $event.key == "PageUp") {
      // Set highlight to next option
      this.highlightNextOption($event.key);
    } else if ($event.key == "Enter") {
      // Select current option if available, clear search and hide options otherwise
      let index = this.highlightedIndex;
      if (index != -1) {
        this.options[index] && this.selectOption(this.options[index].index);
      } else {
        this.selectOption(index);
      }

      // Remove focus from input
      if ($event.target instanceof HTMLElement) {
        $event.target.blur();
      }
    }
  }

  public onInput($event: string) {
    this.searchModel = $event;

    if (this.config.externalSearch) {
      if (this.searchModel == "") {
        // Hide options when the user clears the search
        this.toggleShowOptions(false);
      } else {
        // Request new search results from parent
        this.externalSearch();
      }
    } else {
      // Filter options list
      this.showOptions = true;
      this.filteredOptions = this.options.filter((opt) => this.match(this.searchModel, opt.name));
      this.highlightedIndex = this.filteredOptions.length > 0 ? this.filteredOptions[0].index : -1;

      this.adjustSelectorHeight();
    }
  }

  public toggleShowOptions(override?: boolean) {
    if (this.loading) {
      return;
    }

    this.showOptions = override != undefined ? override : !this.showOptions;
    this.adjustSelectorHeight();
  }

  public clearSearch() {
    this.clearing = true;
    this.searchModel = "";
    this.resetOptions();

    if (this.config.externalSearch) {
      this.toggleShowOptions(false);
    }

    // Call setTimeout to trigger onFocus event
    setTimeout(() => {
      this.input.nativeElement.focus();
    });
  }

  public getOptionId(index: number): string {
    return `option-${index}`;
  }

  private externalSearch() {
    this.searchEvent.emit(this.searchModel);
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
    this.filteredOptions = !this.config.externalSearch ? this.options : [];
  }

  private match(substr: string, optionName: string): boolean {
    return optionName.toLowerCase().includes(substr.toLowerCase());
  }

  private highlightNextOption(key: string): void {
    let numOptions = this.filteredOptions.length;
    let currentIndex = this.filteredOptions.findIndex((i) => i.index == this.highlightedIndex);
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

    this.highlightedIndex = this.filteredOptions[nextIndex].index;

    // Adjust scroll position if needed
    let currentOption = document.querySelector(`[id=${this.selectorId}] [id=option-${this.highlightedIndex}]`);
    currentOption && currentOption.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  private adjustSelectorHeight() {
    let height = 0;
    let numOptions = 0;
    let options = this.config.externalSearch ? this.options : this.filteredOptions;

    if (this.showOptions) {
      numOptions = options.length == 0 ? 1 : options.length;
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
