import { Component } from '@angular/core';
import { Policy, PolicyService, PolicyResponse } from '../services/policy.service';
import { PolicyFormComponent } from '../policy-form/policy-form.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [FormsModule, RouterModule, CommonModule, NgFor, PolicyFormComponent],
})
export class DashboardComponent {
  policies: Policy[] = [];
  showModal: boolean = false;
  editMode: boolean = false;
  currentPolicy: Policy = this.getEmptyPolicy();
  searchTerm: string = '';
  filterType: string = 'all';
  errorMessage: string = '';
  successMessage: string = '';
  loading:boolean = false;


  constructor(private policyService: PolicyService) {}

  ngOnInit(): void {
    this.loadPolicies();
  }

  get filteredPolicies() {
    return this.policies.filter(policy => {
      const matchesSearch = policy.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesType = this.filterType === 'all' || policy.type === this.filterType;
      return matchesSearch && matchesType;
    });
  }

  getEmptyPolicy(): Policy {
    return {
      id: 0,
      name: '',
      type: 'Life',
      premium: 0,
      coverage: 0,
    };
  }

  loadPolicies(): void {
    this.loading = true;
    this.policyService.getPolicies().pipe(
      catchError((error) => {
        this.errorMessage = 'Error loading policies: ' + error.message;
        return of([]);
      })
    ).subscribe((data) => {
      this.policies = data;
      this.loading = false;
    });
  }

  deletePolicy(id: number): void {
    if (confirm('Are you sure you want to delete this policy?')) {
      this.policyService.deletePolicy(id).pipe(
        catchError((error) => {
          this.errorMessage = 'Error deleting policy: ' + error.message;
          return of(null);
        })
      ).subscribe((response: PolicyResponse | null) => {
        if (response && response.message) {
          this.successMessage = response.message;
          setTimeout(() => {
            this.successMessage = '';
          }, 2100 );
        }
        this.loadPolicies();
      });
    }
  }

  openAddModal(): void {
    this.editMode = false;
    this.currentPolicy = this.getEmptyPolicy();
    this.showModal = true;
  }

  openEditModal(policy: Policy): void {
    this.editMode = true;
    this.currentPolicy = { ...policy };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentPolicy = this.getEmptyPolicy();
  }

  onSave(): void {
    this.loadPolicies();
    this.closeModal();
  }

  onClose(): void {
    this.closeModal();
  }

  onSuccessMessage(message: string): void {
    this.successMessage = message;

    setTimeout(() => {
      this.successMessage = '';
    }, 2100 );
  }

  onErrorMessage(message: string): void {
    this.errorMessage = message;

    setTimeout(() => {
      this.errorMessage = '';
    }, 2100);
  }
}
