import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TagCloudComponent } from "./tag-cloud.component";

describe("TagGroupComponent", () => {
  let component: TagCloudComponent;
  let fixture: ComponentFixture<TagCloudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TagCloudComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagCloudComponent);
    component = fixture.componentInstance;
    component.tags = createTags(10);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("toggleShow", () => {
    it("should initialize visibleTags when tag count less than 15", () => {
      fixture.detectChanges();

      expect(component.visibleTags.length).toEqual(10);
      expect(component.allVisible).toEqual(true);
    });
  });

  describe("toggleShow", () => {
    it("should show all tags", () => {
      component.tags = createTags(20);

      component.ngOnInit();
      component.toggleShow();

      expect(component.visibleTags.length).toEqual(20);
      expect(component.allVisible).toEqual(true);
    });

    it("should hide tags", () => {
      component.tags = createTags(20);

      component.ngOnInit();
      component.toggleShow();
      component.toggleShow();

      expect(component.visibleTags.length).toEqual(15);
      expect(component.allVisible).toEqual(false);
    });
  });
});

function createTags(num: number) {
  let tags = [];

  for (let i = 0; i < num; i++) {
    tags.push(`tag-${i}`);
  }

  return tags;
}
