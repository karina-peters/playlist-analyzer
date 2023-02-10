import { DebugElement } from "@angular/core";
import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { first } from "rxjs/operators";
import { UniqueIdService } from "src/app/services/unique-id.service";

import { DataType, SelectorComponent } from "./selector.component";

describe("SelectorComponent", () => {
  let component: SelectorComponent;
  let fixture: ComponentFixture<SelectorComponent>;
  let selectEl: DebugElement;
  let inputEl: DebugElement;

  const idServiceSpy = jasmine.createSpyObj("UniqueIdService", ["getUniqueId"]);

  const options = [
    { index: 0, name: "option 0" },
    { index: 1, name: "option 1" },
    { index: 2, name: "option 2" },
    { index: 3, name: "option 3" },
    { index: 4, name: "option 4" },
    { index: 5, name: "option 5" },
    { index: 6, name: "option 6" },
    { index: 7, name: "option 7" },
    { index: 8, name: "option 8" },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [SelectorComponent],
      providers: [{ provide: UniqueIdService, useValue: idServiceSpy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectorComponent);
    component = fixture.componentInstance;
    selectEl = fixture.debugElement.query(By.css(".custom-select"));
    inputEl = fixture.debugElement.query(By.css("input"));
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("config: { allowSearch: true, externalSearch: false, type: Playlist }", () => {
    beforeEach(() => {
      spyOn(component, "toggleShowOptions").and.callThrough();
      spyOn(inputEl.nativeElement, "blur").and.callThrough();

      component.options = options;
      component.filteredOptions = options.slice(0, 7);
      component.config = { allowSearch: true, externalSearch: false, type: DataType.Playlist };

      fixture.detectChanges();
    });

    describe("objects$", () => {
      it("should append options", () => {
        const opts = [
          { index: 0, name: "option 0" },
          { index: 1, name: "option 1" },
          { index: 2, name: "option 2" },
        ];

        const nextOpts = [{ index: 3, name: "option 3" }];

        component.searchModel = "3";
        component.options = opts;
        fixture.detectChanges();

        component.options$.next(nextOpts);

        expect(component.toggleShowOptions).not.toHaveBeenCalled();
        expect(component.options.length).toEqual(4);
        expect(component.filteredOptions[0]).toEqual(nextOpts[0]);
      });
    });

    describe("onSelectFocusout", () => {
      it("should set clearing to false when clearing", () => {
        component.clearing = true;
        selectEl.triggerEventHandler("focusout", undefined);
        fixture.detectChanges();

        expect(component.clearing).toEqual(false);
        expect(component.toggleShowOptions).not.toHaveBeenCalled();
      });

      it("should reset search text and hide options when input doesn't match selected", () => {
        component.selectOption(3);
        component.searchModel = "xyz";

        selectEl.triggerEventHandler("focusout", undefined);
        fixture.detectChanges();

        expect(component.searchModel).toEqual(options[3].name);
        expect(component.filteredOptions).toEqual(component.options);
        expect(component.toggleShowOptions).toHaveBeenCalledWith(false);
      });

      it("should clear search text and hide options when option not selected", () => {
        component.searchModel = "xyz";

        selectEl.triggerEventHandler("focusout", undefined);
        fixture.detectChanges();

        expect(component.searchModel).toEqual("");
        expect(component.filteredOptions).toEqual(component.options);
        expect(component.toggleShowOptions).toHaveBeenCalledWith(false);
      });
    });

    describe("onInputFocus", () => {
      it("should show options and set highlight", () => {
        inputEl.triggerEventHandler("focus", undefined);
        fixture.detectChanges();

        expect(component.toggleShowOptions).toHaveBeenCalledWith(true);
        expect(component.searching).toEqual(true);
        expect(component.highlightedIndex).toEqual(0);
      });
    });

    describe("onInputBlur", () => {
      it("should remove highlight", () => {
        inputEl.triggerEventHandler("blur", undefined);
        fixture.detectChanges();

        expect(component.searching).toEqual(false);
        expect(component.highlightedIndex).toEqual(-1);
      });
    });

    describe("onInputKeyDown", () => {
      it("should update highlight on arrow", () => {
        inputEl.triggerEventHandler("focus", undefined);
        inputEl.triggerEventHandler("keydown", { key: "ArrowUp" });
        fixture.detectChanges();

        expect(component.highlightedIndex).toEqual(6);

        inputEl.triggerEventHandler("keydown", { key: "ArrowDown" });
        fixture.detectChanges();

        expect(component.highlightedIndex).toEqual(0);
      });

      it("should update highlight on page", () => {
        inputEl.triggerEventHandler("focus", undefined);
        inputEl.triggerEventHandler("keydown", { key: "PageDown" });
        fixture.detectChanges();

        expect(component.highlightedIndex).toEqual(5);

        inputEl.triggerEventHandler("keydown", { key: "PageUp" });
        fixture.detectChanges();

        expect(component.highlightedIndex).toEqual(0);
      });

      it("should select highlighted option on enter", () => {
        let output: any;
        component.selectedEvent.pipe(first()).subscribe((opt) => (output = opt));

        inputEl.triggerEventHandler("focus", undefined);
        inputEl.triggerEventHandler("keydown", { key: "Enter", target: inputEl.nativeElement });
        fixture.detectChanges();

        expect(output).toEqual(options[0]);
        expect(component.searchModel).toEqual(options[0].name);
        expect(component.highlightedIndex).toEqual(0);
        expect(component.filteredOptions).toEqual(component.options);

        expect(component.toggleShowOptions).toHaveBeenCalledWith(false);
        expect(inputEl.nativeElement.blur).toHaveBeenCalled();
      });

      it("should not select on enter when no highlighted option", () => {
        inputEl.triggerEventHandler("keydown", { key: "Enter", target: inputEl.nativeElement });
        fixture.detectChanges();

        expect(component.searchModel).toEqual("");
        expect(component.highlightedIndex).toEqual(-1);

        expect(component.toggleShowOptions).toHaveBeenCalledWith(false);
        expect(inputEl.nativeElement.blur).toHaveBeenCalled();
      });
    });

    describe("onInput", () => {
      it("should filter options when search returns results", fakeAsync(() => {
        inputEl.nativeElement.value = "4";
        inputEl.nativeElement.dispatchEvent(new Event("input"));
        fixture.detectChanges();

        tick();

        expect(component.showOptions).toEqual(true);
        expect(component.highlightedIndex).toEqual(4);
        expect(component.filteredOptions.length).toEqual(1);
        expect(component.filteredOptions[0]).toEqual(options[4]);
      }));

      it("should filter options when search returns no results", fakeAsync(() => {
        inputEl.nativeElement.value = "xyz";
        inputEl.nativeElement.dispatchEvent(new Event("input"));
        fixture.detectChanges();

        tick();

        expect(component.showOptions).toEqual(true);
        expect(component.highlightedIndex).toEqual(-1);
        expect(component.filteredOptions.length).toEqual(0);
      }));
    });
  });

  describe("config: { allowSearch: true, externalSearch: true, type: Track }", () => {
    beforeEach(() => {
      spyOn(component, "toggleShowOptions").and.callThrough();
      spyOn(inputEl.nativeElement, "blur").and.callThrough();

      component.options = options;
      component.config = { allowSearch: true, externalSearch: true, type: DataType.Track };

      fixture.detectChanges();
    });

    describe("objects$", () => {
      it("should replace options with search results", () => {
        const opts = [
          { index: 0, name: "search 0" },
          { index: 1, name: "search 1" },
        ];

        component.searchModel = "1";
        fixture.detectChanges();

        component.options$.next(opts);

        expect(component.toggleShowOptions).toHaveBeenCalledWith(true);
        expect(component.highlightedIndex).toEqual(-1);
        expect(component.options).toEqual(opts);
        expect(component.filteredOptions[0]).toEqual(opts[1]);
      });
    });

    describe("onInputFocus", () => {
      it("should emit search string for external search", () => {
        let output: any;
        component.searchEvent.pipe(first()).subscribe((search) => (output = search));
        component.searchModel = "xyz";

        inputEl.triggerEventHandler("focus", undefined);
        fixture.detectChanges();

        expect(output).toEqual("xyz");
        expect(component.searching).toEqual(true);
        expect(component.highlightedIndex).toEqual(0);
      });
    });

    describe("onInputBlur", () => {
      it("should remove highlight and clear options", () => {
        inputEl.triggerEventHandler("blur", undefined);
        fixture.detectChanges();

        expect(component.searching).toEqual(false);
        expect(component.highlightedIndex).toEqual(-1);
        expect(component.filteredOptions.length).toEqual(0);
      });
    });

    describe("onInput", () => {
      it("should hide options when search text deleted", fakeAsync(() => {
        inputEl.nativeElement.value = "";
        inputEl.nativeElement.dispatchEvent(new Event("input"));
        fixture.detectChanges();

        tick();

        expect(component.toggleShowOptions).toHaveBeenCalledWith(false);
        expect(component.searchModel).toEqual("");
      }));

      it("should request external search results from parent", fakeAsync(() => {
        let output: any;
        component.searchEvent.pipe(first()).subscribe((search) => (output = search));

        inputEl.nativeElement.value = "xyz";
        inputEl.nativeElement.dispatchEvent(new Event("input"));
        fixture.detectChanges();

        tick();

        expect(output).toEqual("xyz");
        expect(component.searchModel).toEqual("xyz");
      }));
    });

    describe("clearSearch", () => {
      it("should hide options when external search", () => {
        component.searchModel = "search text";
        component.clearSearch();
        fixture.detectChanges();

        expect(component.toggleShowOptions).toHaveBeenCalledWith(false);
      });
    });
  });

  describe("config: { allowSearch: false, externalSearch: false, type: Playlist }", () => {
    beforeEach(() => {
      spyOn(component, "toggleShowOptions").and.callThrough();

      component.options = options;
      component.config = { allowSearch: false, externalSearch: false, type: DataType.Playlist };

      fixture.detectChanges();
    });

    describe("onInputFocus", () => {
      it("should do nothing", () => {
        inputEl.triggerEventHandler("focus", undefined);
        fixture.detectChanges();

        expect(component.toggleShowOptions).not.toHaveBeenCalled();
        expect(component.searching).toEqual(false);
        expect(component.highlightedIndex).toEqual(-1);
      });
    });

    describe("onInputBlur", () => {
      it("should do nothing", () => {
        inputEl.triggerEventHandler("blur", undefined);
        fixture.detectChanges();

        expect(component.options).toEqual(options);
      });
    });
  });

  describe("toggleShowOptions", () => {
    it("should set showOptions to true", () => {
      component.toggleShowOptions(true);
      expect(component.showOptions).toEqual(true);
    });

    it("should set showOptions to false", () => {
      component.toggleShowOptions(false);
      expect(component.showOptions).toEqual(false);
    });

    it("should toggle showOptions", () => {
      component.toggleShowOptions();
      expect(component.showOptions).toEqual(true);

      component.toggleShowOptions();
      expect(component.showOptions).toEqual(false);
    });

    it("should not toggle when loading", () => {
      component.loading = true;
      component.toggleShowOptions(true);

      expect(component.showOptions).toEqual(false);
    });
  });

  describe("clearSearch", () => {
    it("should clear search text and reset options", () => {
      component.searchModel = "search text";
      component.clearSearch();

      expect(component.clearing).toEqual(true);
      expect(component.searchModel).toEqual("");
      expect(component.filteredOptions).toEqual(component.options);
    });
  });
});
