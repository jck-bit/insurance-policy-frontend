import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { PolicyService, Policy } from '../services/policy.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError } from 'rxjs';
import { of } from 'rxjs';

@Component({
  selector: 'app-policy-form',
  templateUrl: './policy-form.component.html',
  styleUrls: ['./policy-form.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class PolicyFormComponent implements OnInit {
  @Input() policy: Policy = { id: 0, name: '', type: 'Life', premium: 0, coverage: 0 };
  @Input() editMode: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
  @Output() successMessage = new EventEmitter<string>();

  errorMessage: string = '';

  constructor(private policyService: PolicyService) {}

  ngOnInit(): void {}

  savePolicy(): void {
    if (this.policy.id) {
      this.policyService.updatePolicy(this.policy.id, this.policy)
        .pipe(
          catchError((error) => {
            this.errorMessage = error.message;
            return of(null);
          })
        )
        .subscribe((response) => {
          if (response && response.message) {
            this.successMessage.emit(response.message);
            this.save.emit();
          }
        });
    } else {
      this.policyService.addPolicy(this.policy)
        .pipe(
          catchError((error) => {
            this.errorMessage = error.message;
            return of(null);
          })
        )
        .subscribe((response) => {
          if (response && response.message) {
            this.successMessage.emit(response.message);
            this.save.emit();
          }
        });
    }
  }

  closeForm(): void {
    this.close.emit();
  }
}
