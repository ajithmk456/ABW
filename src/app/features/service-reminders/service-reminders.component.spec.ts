import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRemindersComponent } from './service-reminders.component';

describe('ServiceRemindersComponent', () => {
  let component: ServiceRemindersComponent;
  let fixture: ComponentFixture<ServiceRemindersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceRemindersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceRemindersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
