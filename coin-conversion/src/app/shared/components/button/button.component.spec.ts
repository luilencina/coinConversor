import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';
import { By } from '@angular/platform-browser';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the button component', () => {
    expect(component).toBeTruthy();
  });

  it('should render label if provided', () => {
    component.label = 'Click Me';
    fixture.detectChanges();
    const buttonText = fixture.nativeElement.querySelector('button').textContent;
    expect(buttonText).toContain('Click Me');
  });

  it('should render icon if provided', () => {
    component.icon = 'home';
    fixture.detectChanges();
    const iconElement = fixture.debugElement.query(By.css('mat-icon'));
    expect(iconElement).toBeTruthy();
    expect(iconElement.nativeElement.textContent).toContain('home');
  });

  it('should emit clicked event on button click when enabled', () => {
    spyOn(component.clicked, 'emit');
    component.disabled = false;
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);

    expect(component.clicked.emit).toHaveBeenCalled();
  });

  it('should NOT emit clicked event on button click when disabled', () => {
    spyOn(component.clicked, 'emit');
    component.disabled = true;
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);

    expect(component.clicked.emit).not.toHaveBeenCalled();
  });

  it('should disable the button when disabled input is true', () => {
    component.disabled = true;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBeTrue();
  });

  it('should enable the button when disabled input is false', () => {
    component.disabled = false;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBeFalse();
  });
});
