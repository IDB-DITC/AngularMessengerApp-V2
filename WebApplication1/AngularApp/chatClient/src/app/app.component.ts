import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'chatClient';

  hubConnection!: HubConnection;
  

  Messages: Message[] = [];

  user!: string | null;
  msg: string = "test message";


  constructor() {


    this.hubConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7224/mychat")
      .withAutomaticReconnect()
      .withServerTimeout(1000 * 30)
      .build();



  }


  ngOnInit(): void {

    while (!this.user)
      this.user = prompt("enter name");





    this.hubConnection.on('Receive', (user, message) => {

      this.Messages.push(new Message(user, message));
    });


    this.hubConnection.on('ReceiveImg', (user, message) => {

      this.Messages.push(new Message(user, message, true));
    });


    this.hubConnection.start();


    

  }

  get disconnected():boolean {
    return this.hubConnection.state != HubConnectionState.Connected;
  }



  SendMsg() {

    this.hubConnection.invoke("Send", this.user, this.msg);
  }


  fileSelect(ev: any) {


    const file = ev.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.hubConnection.invoke("SendImg", this.user, reader.result);
    };

  }
  
}



export class Message {
  constructor(public UserName: string, public Text: string, public IsImage: boolean = false) {

  }
}
