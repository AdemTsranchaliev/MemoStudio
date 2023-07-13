import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  constructor() { }
  
  users: BulgarianName[] = [
    { fullName: "Иван Петров", phoneNumber: "+359 88 1234567" },
    { fullName: "Мария Георгиева", phoneNumber: "+359 89 2345678" },
    { fullName: "Димитър Иванов", phoneNumber: "+359 87 3456789" },
    { fullName: "Елена Димитрова", phoneNumber: "+359 88 4567890" },
    { fullName: "Георги Петров", phoneNumber: "+359 89 5678901" },
    { fullName: "Анна Стоянова", phoneNumber: "+359 87 6789012" },
    { fullName: "Стефан Димитров", phoneNumber: "+359 88 7890123" },
    { fullName: "Милена Петрова", phoneNumber: "+359 89 8901234" },
    { fullName: "Николай Иванов", phoneNumber: "+359 87 9012345" },
    { fullName: "Таня Георгиева", phoneNumber: "+359 88 0123456" },
  ];  
  ngOnInit(): void {
  }

}

interface BulgarianName {
  fullName: string;
  phoneNumber: string;
}
