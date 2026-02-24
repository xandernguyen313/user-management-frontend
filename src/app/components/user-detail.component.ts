import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>User Details</h2>
      
      <div *ngIf="isLoading" class="loading">
        Loading user details...
      </div>
      
      <div *ngIf="!isLoading && !user" class="error">
        User not found!
        <button (click)="goBack()">Back to List</button>
      </div>

      <div *ngIf="!isLoading && user" class="user-detail">
        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <div *ngIf="successMessage" class="success-message">
          {{ successMessage }}
        </div>
        
        <div *ngIf="!isEditing" class="view-mode">
          <div class="detail-item">
            <label>ID:</label>
            <span>{{ user.id }}</span>
          </div>
          
          <div class="detail-item">
            <label>Name:</label>
            <span>{{ user.name }}</span>
          </div>
          
          <div class="detail-item">
            <label>Email:</label>
            <span>{{ user.email }}</span>
          </div>
          
          <div class="detail-item">
            <label>Password:</label>
            <span>{{ '•'.repeat(user.password.length) }}</span>
          </div>

          <div class="button-group">
            <button (click)="enableEdit()" class="edit-btn" [disabled]="isLoading">
              Edit
            </button>
            <button (click)="deleteUser()" class="delete-btn" [disabled]="isLoading">
              {{ isLoading ? 'Deleting...' : 'Delete' }}
            </button>
            <button (click)="goBack()" class="back-btn">Back</button>
          </div>
        </div>

        <div *ngIf="isEditing" class="edit-mode">
          <form (ngSubmit)="updateUser()" #editForm="ngForm">
            <div class="form-group">
              <label>Name:</label>
              <input 
                type="text" 
                [(ngModel)]="editedUser.name" 
                name="name" 
                required 
                placeholder="Enter name"
              />
            </div>
            
            <div class="form-group">
              <label>Email:</label>
              <input 
                type="email" 
                [(ngModel)]="editedUser.email" 
                name="email" 
                required 
                placeholder="Enter email"
              />
            </div>
            
            <div class="form-group">
              <label>Password:</label>
              <input 
                type="password" 
                [(ngModel)]="editedUser.password" 
                name="password" 
                required 
                placeholder="Enter password"
              />
            </div>

            <div class="button-group">
              <button type="submit" [disabled]="!editForm.valid || isLoading" class="save-btn">
                {{ isLoading ? 'Saving...' : 'Save' }}
              </button>
              <button type="button" (click)="cancelEdit()" class="cancel-btn" [disabled]="isLoading">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }

    h2 {
      color: #333;
      margin-bottom: 30px;
      text-align: center;
    }

    .loading {
      text-align: center;
      color: #4CAF50;
      padding: 20px;
      font-size: 16px;
    }

    .error {
      background: #ffebee;
      color: #c62828;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }

    .error-message {
      background-color: #ffebee;
      color: #c62828;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 15px;
    }

    .success-message {
      background-color: #e8f5e9;
      color: #2e7d32;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 15px;
    }

    .user-detail {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .detail-item {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
    }

    .detail-item label {
      font-weight: 600;
      color: #555;
      width: 120px;
      margin-right: 20px;
    }

    .detail-item span {
      color: #333;
      font-size: 16px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #555;
    }

    input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
    }

    input:focus {
      outline: none;
      border-color: #4CAF50;
    }

    .button-group {
      display: flex;
      gap: 10px;
      margin-top: 30px;
    }

    button {
      flex: 1;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: background-color 0.3s;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .edit-btn, .save-btn {
      background-color: #4CAF50;
      color: white;
    }

    .edit-btn:hover, .save-btn:hover:not(:disabled) {
      background-color: #45a049;
    }

    .delete-btn {
      background-color: #f44336;
      color: white;
    }

    .delete-btn:hover {
      background-color: #da190b;
    }

    .back-btn, .cancel-btn {
      background-color: #757575;
      color: white;
    }

    .back-btn:hover, .cancel-btn:hover {
      background-color: #616161;
    }
  `]
})
export class UserDetailComponent implements OnInit {
  user?: User;
  editedUser = {
    name: '',
    email: '',
    password: ''
  };
  isEditing = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  userId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userId = +id;
      this.loadUser();
    }
  }

  loadUser(): void {
    this.isLoading = true;
    this.userService.getUserById(this.userId).subscribe({
      next: (data) => {
        this.user = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.errorMessage = 'User not found';
        this.isLoading = false;
      }
    });
  }

  enableEdit(): void {
    if (this.user) {
      this.editedUser = {
        name: this.user.name,
        email: this.user.email,
        password: this.user.password
      };
      this.isEditing = true;
      this.errorMessage = '';
      this.successMessage = '';
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  updateUser(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.userService.updateUser(this.userId, this.editedUser).subscribe({
      next: (data) => {
        this.user = data;
        this.isEditing = false;
        this.isLoading = false;
        this.successMessage = 'User updated successfully!';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error updating user:', error);
        this.errorMessage = error.error?.message || 'Failed to update user';
        this.isLoading = false;
      }
    });
  }

  deleteUser(): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.isLoading = true;
      this.userService.deleteUser(this.userId).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.errorMessage = 'Failed to delete user';
          this.isLoading = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}